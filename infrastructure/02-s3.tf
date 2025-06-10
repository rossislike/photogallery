resource "random_string" "bucket_suffix" {
  length  = 4
  special = false
  upper   = false
}

locals {
  suffix = random_string.bucket_suffix.result
}

resource "aws_s3_bucket" "website" {
  bucket = "photogallery-website-${local.suffix}"
  tags   = var.tags
}


resource "aws_s3_bucket" "artifacts" {
  bucket = "photogallery-artifacts-${local.suffix}"
  tags   = var.tags
}

resource "aws_s3_bucket_versioning" "artifacts" {
  bucket = aws_s3_bucket.artifacts.id
  versioning_configuration {
    status = "Enabled"
  }
}

resource "aws_s3_bucket_cors_configuration" "website" {
  bucket = aws_s3_bucket.website.id

  cors_rule {
    allowed_headers = ["*"]
    allowed_methods = ["GET", "PUT", "POST", "DELETE", "HEAD"]
    allowed_origins = ["http://localhost:5173", "https://photogallery.rumothy.com"]
    expose_headers  = ["ETag"]
    max_age_seconds = 3000
  }
}