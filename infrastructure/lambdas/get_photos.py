import json 
import boto3
import os

bucket_name = os.environ['BUCKET_NAME']
def lambda_handler(event, context):
    # Initialize the S3 client
    s3 = boto3.client('s3')
    
    # Define the bucket name and prefix
    prefix = 'photos/'

    # List objects in the specified S3 bucket with the given prefix
    response = s3.list_objects_v2(Bucket=bucket_name, Prefix=prefix)

    # Extract the photo URLs from the response
    photos = []
    if 'Contents' in response:
        for obj in response['Contents']:
            photo_url = f"https://{bucket_name}.s3.amazonaws.com/{obj['Key']}"
            photos.append(photo_url)

    # Return the list of photo URLs as a JSON response
    return {
        'statusCode': 200,
        'body': json.dumps(photos)
    }