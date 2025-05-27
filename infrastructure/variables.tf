variable "tags" {
  description = "Tags to apply to resources"
  type        = map(string)
  default = {
    Project     = "photogallery"
    Environment = "dev"
    ManagedBy   = "terraform"
  }
}

variable "project_name" {
  description = "Name of the project"
  type        = string
  default     = "photogallery"
}

variable "environment" {
  description = "Environment (dev, staging, prod)"
  type        = string
  default     = "dev"
}

variable "github_owner" {
  description = "GitHub repository owner"
  type        = string
  default     = "rossislike"
}

variable "github_repo" {
  description = "GitHub repository name"
  type        = string
  default     = "photogallery"
}

variable "github_branch" {
  description = "GitHub branch to track"
  type        = string
  default     = "main"
}

variable "github_token" {
  description = "GitHub personal access token"
  type        = string
  sensitive   = true
}

