output "api_gateway_endpoint" {
  value = aws_apigatewayv2_api.photo_gallery.api_endpoint
}


output "cloudfront_distribution_id" {
  value = aws_cloudfront_distribution.distribution.id
}
output "cloudfront_distribution_domain_name" {
  value = "https://${aws_cloudfront_distribution.distribution.domain_name}"
}