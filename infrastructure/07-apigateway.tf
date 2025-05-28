resource "aws_apigatewayv2_api" "photo_gallery" {
  name          = "${var.project_name}-api"
  protocol_type = "HTTP"
  cors_configuration {
    allow_origins = ["*"]
    allow_methods = ["GET", "POST", "PUT", "DELETE", "OPTIONS"]
    allow_headers = ["Content-Type", "Authorization"]
  }
}

resource "aws_apigatewayv2_stage" "photo_gallery" {
  api_id      = aws_apigatewayv2_api.photo_gallery.id
  name        = "$default"
  auto_deploy = true
}

resource "aws_apigatewayv2_integration" "photo_gallery" {
  api_id                 = aws_apigatewayv2_api.photo_gallery.id
  integration_uri        = aws_lambda_function.get_photos.arn
  integration_type       = "AWS_PROXY"
  integration_method     = "POST"
}

resource "aws_apigatewayv2_route" "get_photos" {
  api_id    = aws_apigatewayv2_api.photo_gallery.id
  route_key = "GET /photos"
  target    = "integrations/${aws_apigatewayv2_integration.photo_gallery.id}"
}

resource "aws_lambda_permission" "allow_get" {
    statement_id  = "AllowAPIGatewayInvokeGetPhotos"
    action        = "lambda:InvokeFunction"
    function_name = aws_lambda_function.get_photos.function_name
    principal     = "apigateway.amazonaws.com"
    source_arn    = "${aws_apigatewayv2_api.photo_gallery.execution_arn}/*/*"
}