resource "aws_iam_role" "lambda_role" {
  name = "${var.project_name}-lambda-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "lambda.amazonaws.com"
        }
      }
    ]
  })
}

resource "aws_iam_role_policy" "lambda_policy" {
  name = "${var.environment}-lambda-execution-policy"
  role = aws_iam_role.lambda_role.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "s3:PutObject",
          "s3:GetObject",
          "s3:DeleteObject",
          "s3:ListBucket"
        ]
        Resource = [
          aws_s3_bucket.website.arn,
          "${aws_s3_bucket.website.arn}/*"
        ]
      },
        {
          Effect = "Allow"
          Action = [
            "dynamodb:GetItem",
            "dynamodb:PutItem",
            "dynamodb:UpdateItem",
            "dynamodb:DeleteItem",
            "dynamodb:Query",
            "dynamodb:Scan"
          ]
          Resource = [aws_dynamodb_table.photogallery.arn]
        }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "lambda_basic_execution" {
  role       = aws_iam_role.lambda_role.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}

resource "aws_cloudwatch_log_group" "lambda_logs" {
  name              = "/aws/lambda/${var.project_name}"
  retention_in_days = 14
}


resource "aws_lambda_layer_version" "python_layer" {
  filename            = "layer/layer.zip"
  layer_name          = "${var.project_name}-layer"
  description         = "Python dependencies layer"
  compatible_runtimes = ["python3.13"]
}

####################################################
resource "aws_lambda_function" "get_photos" {
  filename         = "lambdas/get_photos.zip"
  function_name    = "${var.project_name}-get-photos"
  source_code_hash = filebase64sha256("lambdas/get_photos.zip")
  role             = aws_iam_role.lambda_role.arn
  handler          = "get_photos.lambda_handler"
  runtime          = "python3.13"
  #   layers           = [aws_lambda_layer_version.python_layer.arn]

  logging_config {
    log_group  = aws_cloudwatch_log_group.lambda_logs.name
    log_format = "Text"
  }
  environment {
    variables = {
      BUCKET_NAME = aws_s3_bucket.website.bucket
      PHOTOS_TABLE_NAME = aws_dynamodb_table.photogallery.name
    }
  }
}

resource "aws_lambda_permission" "allow_get" {
    statement_id  = "AllowAPIGatewayInvokeGetPhotos"
    action        = "lambda:InvokeFunction"
    function_name = aws_lambda_function.get_photos.function_name
    principal     = "apigateway.amazonaws.com"
    source_arn    = "${aws_apigatewayv2_api.photo_gallery.execution_arn}/*/*"
}

####################################################
resource "aws_lambda_function" "post_photo" {
  filename         = "lambdas/post_photo.zip"
  function_name    = "${var.project_name}-post-photo"
  source_code_hash = filebase64sha256("lambdas/post_photo.zip")
  role             = aws_iam_role.lambda_role.arn
  handler          = "post_photo.lambda_handler"
  runtime          = "python3.13"
  layers           = [aws_lambda_layer_version.python_layer.arn]

  logging_config {
    log_group  = aws_cloudwatch_log_group.lambda_logs.name
    log_format = "Text"
  }
  environment {
    variables = {
      PHOTOS_TABLE_NAME = aws_dynamodb_table.photogallery.name
    }
  }
}

resource "aws_lambda_permission" "allow_post_photo" {
    statement_id  = "AllowAPIGatewayInvokePostPhoto"
    action        = "lambda:InvokeFunction"
    function_name = aws_lambda_function.post_photo.function_name
    principal     = "apigateway.amazonaws.com"
    source_arn    = "${aws_apigatewayv2_api.photo_gallery.execution_arn}/*/*"
}

####################################################
resource "aws_lambda_function" "upload_photo" {
  filename         = "lambdas/upload_photo.zip"
  function_name    = "${var.project_name}-upload-photo"
  source_code_hash = filebase64sha256("lambdas/upload_photo.zip")
  role             = aws_iam_role.lambda_role.arn
  handler          = "upload_photo.lambda_handler"
  runtime          = "python3.13"
  layers           = [aws_lambda_layer_version.python_layer.arn]

  logging_config {
    log_group  = aws_cloudwatch_log_group.lambda_logs.name
    log_format = "Text"
  }
  environment {
    variables = {
      BUCKET_NAME = aws_s3_bucket.website.bucket
    }
  }
}

resource "aws_lambda_permission" "allow_upload_photo" {
    statement_id  = "AllowAPIGatewayInvokeUploadPhoto"
    action        = "lambda:InvokeFunction"
    function_name = aws_lambda_function.upload_photo.function_name
    principal     = "apigateway.amazonaws.com"
    source_arn    = "${aws_apigatewayv2_api.photo_gallery.execution_arn}/*/*"
}