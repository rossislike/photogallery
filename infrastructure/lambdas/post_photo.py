import json
import boto3
import os
import re
from datetime import datetime

table_name = os.environ['PHOTOS_TABLE_NAME']

def lambda_handler(event, context):
    try:
        body_str = event.get('body', '{}')
        
        image_key = body_str['image_key']
        user = body_str['user']
        image_id = body_str['image_id']
        title = body_str['title']
        description = body_str['description']
        tags = body_str['tags']
        tags = re.sub(r"\s+", "", tags)
        
        dynamodb = boto3.resource('dynamodb')
        table = dynamodb.Table(table_name)

        pk = f'PHOTO#{user}'
        sk = f'PHOTO#{image_id}'
        item = {
            'PK': pk,
            'SK': sk,
            'image_key': image_key,
            'title': title,
            'dateAdded': datetime.now().isoformat()
        }

        if description is not None:
            item['description'] = description
        if tags is not None:
            item['tags'] = tags if isinstance(tags, list) else tags.split(',')

        table.put_item(Item=item)

        return {
            'statusCode': 200,
            'body': json.dumps({'item': item })
        }
    except Exception as e:
        print(e)
        return {
            'statusCode': 400,
            'body': json.dumps({'error': str(e)})
        }