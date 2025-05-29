output "api_gateway_endpoint" {
  value = aws_apigatewayv2_api.photo_gallery.api_endpoint
}


output "cloudfront_distribution_id" {
  value = aws_cloudfront_distribution.distribution.id
}
output "cloudfront_distribution_domain_name" {
  value = "https://${aws_cloudfront_distribution.distribution.domain_name}"
}

output "cognito_user_pool_id" {
  value = aws_cognito_user_pool.pool.id
}

output "cognito_user_pool_client_id" {
  value = aws_cognito_user_pool_client.client.id
}

output "cognito_user_pool_domain" {
  value = "https://${aws_cognito_user_pool_domain.domain.domain}.auth.us-east-1.amazoncognito.com"
}