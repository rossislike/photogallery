resource "aws_cognito_user_pool" "photo_gallery" {
    name = "${var.project_name}-userpool"
    user_pool_tier = "ESSENTIALS"
    username_attributes = ["email"]
    auto_verified_attributes = ["email"]
    
    account_recovery_setting {
        recovery_mechanism {
            name = "verified_email"
            priority = 1
        }
    }

    admin_create_user_config {
      allow_admin_create_user_only = true
    }

    email_configuration {
        email_sending_account = "COGNITO_DEFAULT"
    }

    password_policy {
        minimum_length    = 8
        require_uppercase = true
        require_lowercase = true
        require_numbers   = true
        require_symbols   = true
    }

    schema {
        name = "email"
        attribute_data_type = "String"
        mutable = true
        required = true
        developer_only_attribute = false

        string_attribute_constraints {
            max_length = "2048"
            min_length = "0"
        }
    }

    sign_in_policy {
      allowed_first_auth_factors = [ "PASSWORD" ]
    }

    username_configuration {
        case_sensitive = false
    }

    verification_message_template {
        default_email_option = "CONFIRM_WITH_CODE"
    } 

    tags = var.tags
}

resource "aws_cognito_user_pool_client" "photo_gallery" {
    name = "${var.project_name}-userpool-client"

    access_token_validity = 60
    allowed_oauth_flows = ["code"]
    allowed_oauth_flows_user_pool_client = true
    allowed_oauth_scopes = ["email", "openid", "profile"]
    auth_session_validity = 3

    callback_urls = ["https://photogallery.rumothy.com"]
    logout_urls = ["https://photogallery.rumothy.com"]

    default_redirect_uri = "https://photogallery.rumothy.com"
    enable_propagate_additional_user_context_data = false
    enable_token_revocation = true

    explicit_auth_flows = [
        "ALLOW_REFRESH_TOKEN_AUTH",
        "ALLOW_USER_PASSWORD_AUTH",
        "ALLOW_USER_SRP_AUTH",
        "ALLOW_USER_AUTH",
    ]

    id_token_validity = 60
    prevent_user_existence_errors = "ENABLED"
    refresh_token_validity = 30

    supported_identity_providers = ["COGNITO"]
    user_pool_id = aws_cognito_user_pool.photo_gallery.id
    write_attributes = []

    token_validity_units {
        access_token = "minutes"
        id_token = "minutes"
        refresh_token = "days"
    }
}

resource "aws_cognito_user_pool_domain" "photo_gallery" {
    domain = "${var.project_name}-userpool-domain"
    user_pool_id = aws_cognito_user_pool.photo_gallery.id
    managed_login_version = 1
}