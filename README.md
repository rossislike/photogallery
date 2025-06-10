# Photogallery App

---

# Cognito & API Gateway Test Workflow

## 1. API Gateway Test

- Deploy API Gateway with Terraform
- Update `.env` with API Gateway endpoint
- Enable CORS
- `npm run build`
- Upload to S3 bucket
- Invalidate CloudFront

## 2. CloudFront Test

- Deploy CloudFront with Terraform
- Update `.env` with CloudFront DNS
- Enable CORS
- `npm run build`
- Upload to S3 bucket
- Invalidate CloudFront

## 3. Domain Name Test

- Deploy Route53 with Terraform
- Update `.env` with domain name
- Enable CORS
- `npm run build`
- Upload to S3 bucket
- Invalidate CloudFront

---

## S3 Commands

```sh
aws s3 rm s3://rumo-coffeeship-client/dist --recursive
npm run build
aws s3 cp dist/ s3://rumo-coffeeship-client/dist --recursive
```

## S3 Delete All Versions

```sh
aws s3api delete-objects --bucket photogallery-artifacts-g7px \
  --delete "$(aws s3api list-object-versions \
  --bucket photogallery-artifacts-g7px \
  --output=json \
  --query='{Objects: Versions[].{Key:Key,VersionId:VersionId}}')"

# Also remove delete markers
aws s3api delete-objects --bucket photogallery-artifacts-g7px \
  --delete "$(aws s3api list-object-versions \
  --bucket photogallery-artifacts-g7px \
  --output=json \
  --query='{Objects: DeleteMarkers[].{Key:Key,VersionId:VersionId}}')"
```

---

## Terraform Resources

- `aws_apigatewayv2_route.get_photos`
- `aws_apigatewayv2_integration.photo_gallery`
- `aws_dynamodb_table.photogallery`

---

## API Usage Examples

### Multipart Form Upload

```sh
curl --location 'https://0tq6ktfxxf.execute-api.us-east-1.amazonaws.com/photos' \
  --form 'image=@"/Users/stratus/Pictures/hat.png"' \
  --form 'title="test pic"' \
  --form 'description="a test pic"' \
  --form 'tags="cool,amazing, nice"'
```

### JSON Upload (Base64 Image)

1. **Encode the image to base64:**

   ```sh
   base64_data=$(base64 < image.jpg | tr -d '\n')
   ```

2. **Send as JSON:**

   ```sh
   curl -X POST \
     -H "Content-Type: application/json" \
     -d "{\"image\": \"data:image/jpeg;base64,$base64_data\"}" \
     https://api.example.com/upload
   ```

3. **Using jq to insert base64 into JSON:**

   ```sh
   base64_data=$(base64 < cloud.jpeg | tr -d '\n')
   jq --arg img "data:image/jpeg;base64,$base64_data" '.image = $img' upload.json > final_upload.json
   ```

4. **Send the file:**

   ```sh
   curl -X POST \
     -H "Content-Type: application/json" \
     -d @final_upload.json \
     https://0tq6ktfxxf.execute-api.us-east-1.amazonaws.com/photos
   ```

   ```sh
   curl -X POST \
     -H "Content-Type: application/json" \
     -d @final_upload.json \
     https://3szgxctg7a.execute-api.us-east-1.amazonaws.com/photos
   ```

---

## Example JSON Body

```json
{
  "body": {
    "title": "My Image Title",
    "description": "Detailed description here",
    "tags": "tag1,tag2,tag3",
    "image": "data:image/jpeg;base64,iVBORw0KGgoAAAANSUhEUgA..."
  }
}
```

---

## Python Environment Setup

```sh
python -m venv venv
source venv/bin/activate
pip install boto3
```
