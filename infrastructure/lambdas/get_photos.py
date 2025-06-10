import json 
import boto3
import os

bucket_name = os.environ['BUCKET_NAME']
table_name = os.environ['PHOTOS_TABLE_NAME']

dynamodb = boto3.resource('dynamodb')
def lambda_handler(event, context):
    # Initialize the S3 client
    s3 = boto3.client('s3')
    table = dynamodb.Table(table_name)
    
    items = []
    response_scan = table.scan(
        TableName=table_name,
        FilterExpression='begins_with(PK, :pk)',
        ExpressionAttributeValues={
            ':pk': 'PHOTO'
        }
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