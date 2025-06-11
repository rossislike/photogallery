import json 
import boto3
import os

bucket_name = os.environ['BUCKET_NAME']
table_name = os.environ['PHOTOS_TABLE_NAME']

dynamodb = boto3.resource('dynamodb')
def lambda_handler(event, context):
    query_parameters = event.get('queryStringParameters', {}) or {}
    user = query_parameters.get('user', '')
    
    if not user:
        return {
            'statusCode': 400,
            'body': json.dumps({'error': 'User parameter is required'})
        }

    s3 = boto3.client('s3')
    table = dynamodb.Table(table_name)
    
    items = []
    response_scan = table.query(
        ExpressionAttributeValues={
            ':pk': f'PHOTO#{user}'
        },
        KeyConditionExpression='PK = :pk',
        TableName=table_name,
    )

    items.extend(response_scan.get('Items', []))
    for item in items:
        signed_url = s3.generate_presigned_url(
            'get_object', 
            Params={
                'Bucket':bucket_name,
                'Key':item['image_key']
            },
            ExpiresIn=3600
        )
        item['url'] = signed_url
        item['id'] = item['PK'].split('#')[1]
    
    return {
        'statusCode': 200,
        'body': json.dumps(items)
    }