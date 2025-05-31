resource "aws_apigatewayv2_api" "photo_gallery" {
  name          = "${var.project_name}-api"
  protocol_type = "HTTP"
  cors_configuration {
    allow_origins = [
      "http://localhost:5173",
      "https://photogallery.rumothy.com",
      "https://dd2oc3pa7ypmy.cloudfront.net"
    ]
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

  authorizer_id = aws_apigatewayv2_authorizer.photo_gallery.id
  authorization_type = "JWT"
}


resource "aws_apigatewayv2_authorizer" "photo_gallery" {  
  api_id          = aws_apigatewayv2_api.photo_gallery.id
  name            = "Cognito-PhotoGallery"
  authorizer_type = "JWT"
  jwt_configuration {
    issuer   = "https://cognito-idp.us-east-1.amazonaws.com/${aws_cognito_user_pool.pool.id}"
    audience = ["${aws_cognito_user_pool_client.client.id}"]
  }
  identity_sources = ["$request.header.Authorization"]
}

