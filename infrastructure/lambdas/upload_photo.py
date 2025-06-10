import json
import boto3
import os
import nanoid

bucket_name = os.environ['BUCKET_NAME']
s3 = boto3.client('s3')

def lambda_handler(event, context):
    try:
        # Parse request body
        body = json.loads(event.get('body', '{}'))
        
        # Get file metadata
        file_name = body.get('fileName', '')
        
        # Extract file extension
        if '.' in file_name:
            file_ext = file_name.rsplit('.', 1)[1].lower()
        else:
            file_ext = 'jpg'  # Default extension
            
        # Generate unique ID for the image
        image_id = str(nanoid.generate())
        key = f"photos/{image_id}.{file_ext}"
        
        # Generate a presigned URL for uploading
        presigned_url = s3.generate_presigned_url(
            'put_object',
            Params={
                'Bucket': bucket_name,
                'Key': key,
                'ContentType': f'image/{file_ext}',
                'Metadata': {
                    'file_name': file_name
                }
            },
            ExpiresIn=300  # URL expires in 5 minutes
        )
        
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Methods': 'OPTIONS,POST'
            },
            'body': json.dumps({
                'uploadUrl': presigned_url,
                'key': key,
                'imageId': image_id
            })
        }
        
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type'
            },
            'body': json.dumps({'error': str(e)})
        }