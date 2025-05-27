resource "random_string" "bucket_suffix" {
  length  = 4
  special = false
  upper = false
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