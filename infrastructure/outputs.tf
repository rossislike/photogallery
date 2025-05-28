output "api_gateway_endpoint" {
  value = aws_apigatewayv2_api.photo_gallery.api_endpoint
}


output "cloudfront_distribution_id" {
  value = "https://${aws_cloudfront_distribution.distribution.id}"
}
