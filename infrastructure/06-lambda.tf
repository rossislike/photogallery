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
      #   {
      #     Effect = "Allow"
      #     Action = [
      #       "dynamodb:GetItem",
      #       "dynamodb:PutItem",
      #       "dynamodb:UpdateItem",
      #       "dynamodb:DeleteItem",
      #       "dynamodb:Query",
      #       "dynamodb:Scan"
      #     ]
      #     Resource = [aws_dynamodb_table.hec.arn]
      #   }
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
    }
  }
}