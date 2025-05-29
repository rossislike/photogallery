resource "aws_cognito_user_pool" "pool" {
  auto_verified_attributes = [
    "email",
  ]
  name                = "${var.project_name}-user-pool"
  user_pool_tier      = "ESSENTIALS"
  username_attributes = ["email"]

  account_recovery_setting {
    recovery_mechanism {
      name     = "verified_email"
      priority = 1
    }
  }

  admin_create_user_config {
    allow_admin_create_user_only = false
  }

  email_configuration {
    email_sending_account = "COGNITO_DEFAULT"
  }

  password_policy {
    minimum_length                   = 8
    password_history_size            = 0
    require_lowercase                = true
    require_numbers                  = true
    require_symbols                  = true
    require_uppercase                = true
    temporary_password_validity_days = 7
  }

  schema {
    attribute_data_type      = "String"
    developer_only_attribute = false
    mutable                  = true
    name                     = "email"
    required                 = true

    string_attribute_constraints {
      max_length = "2048"
      min_length = "0"
    }
  }

  sign_in_policy {
    allowed_first_auth_factors = [
      "PASSWORD",
    ]
  }

  username_configuration {
    case_sensitive = false
  }

  verification_message_template {
    default_email_option = "CONFIRM_WITH_CODE"
  }
}

resource "aws_cognito_user_pool_client" "client" {
  access_token_validity = 60
  allowed_oauth_flows = ["code"]
  allowed_oauth_flows_user_pool_client = true
  allowed_oauth_scopes = [
    "email",
    "openid",
    "phone",
  ]
  auth_session_validity = 3
  callback_urls = [
    "http://localhost:5173",
    "https://${aws_cloudfront_distribution.distribution.domain_name}",
    "https://${var.project_name}.rumothy.com"
  ]
  # client_secret                                 = aws_cognito_user_pool_client.client.client_secret
  default_redirect_uri                          = "http://localhost:5173"
  enable_propagate_additional_user_context_data = false
  enable_token_revocation                       = true
  explicit_auth_flows = [
    "ALLOW_REFRESH_TOKEN_AUTH",
    "ALLOW_USER_AUTH",
    "ALLOW_USER_SRP_AUTH",
    "ALLOW_USER_PASSWORD_AUTH"
  ]
  id_token_validity = 60
  logout_urls = [
    "http://localhost:5173",
    "https://${aws_cloudfront_distribution.distribution.domain_name}",
    "https://${var.project_name}.rumothy.com"
  ]
  name                          = "${var.project_name}WebClient"
  prevent_user_existence_errors = "ENABLED"
  read_attributes               = []
  refresh_token_validity        = 5
  supported_identity_providers = ["COGNITO"]
  user_pool_id     = aws_cognito_user_pool.pool.id
  write_attributes = []

  token_validity_units {
    access_token  = "minutes"
    id_token      = "minutes"
    refresh_token = "days"
  }

}

resource "aws_cognito_user_pool_domain" "domain" {
  domain                = "${var.project_name}-domain"
  user_pool_id          = aws_cognito_user_pool.pool.id
  managed_login_version = 1
}