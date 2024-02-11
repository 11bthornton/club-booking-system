terraform {
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~> 3.0.2"
    }
  }

  required_version = ">= 1.1.0"
}

provider "azurerm" {
  features {}
}

resource "azurerm_resource_group" "app_service_rg" {
  name     = "club-booking-interactive-test-rg"
  location = "UK South"  
}

resource "azurerm_app_service_plan" "app_service_plan" {
  name                = "club-booking-interactive-test-asp"
  location            = azurerm_resource_group.app_service_rg.location
  resource_group_name = azurerm_resource_group.app_service_rg.name

  sku {
    tier = "Standard"  # Choose the appropriate tier for your needs
    size = "S1"
  }

  # Enable auto-scaling or other features as needed
}

resource "azurerm_app_service" "app_service" {
  name                = "club-booking-interactive-test-as"
  location            = azurerm_resource_group.app_service_rg.location  # Inherits "UK South" from the resource group
  resource_group_name = azurerm_resource_group.app_service_rg.name
  app_service_plan_id = azurerm_app_service_plan.app_service_plan.id

  site_config {
    # startup_command = "/home/site/wwwroot/deploy/startup.sh"

    php_version = "7.4"  # Specify the PHP version
  }

  app_settings = {
    # Add application settings such as environment variables
    "APP_ENV" = "production"
    "DB_CONNECTION" = "mysql"
    "DB_HOST"       = azurerm_mysql_server.mysql_server.fqdn
    "DB_DATABASE"   = azurerm_mysql_database.mysql_db.name
    "DB_USERNAME"   = azurerm_mysql_server.mysql_server.administrator_login
    "DB_PASSWORD"   = azurerm_mysql_server.mysql_server.administrator_login_password
  }

  connection_string {
    name  = "Database"
    type  = "MySQL"
    value = "Server=${azurerm_mysql_server.mysql_server.fqdn};Database=${azurerm_mysql_database.mysql_db.name};Uid=${azurerm_mysql_server.mysql_server.administrator_login};Pwd=${azurerm_mysql_server.mysql_server.administrator_login_password};"
  }

  # Configure other settings as needed, such as identity, logs, etc.
}

resource "azurerm_mysql_server" "mysql_server" {
  name                = "my-mysql-server-${random_id.server_id.hex}"
  location            = azurerm_resource_group.app_service_rg.location
  resource_group_name = azurerm_resource_group.app_service_rg.name

  administrator_login          = "mysqladminun"
  administrator_login_password = "H@Sh1CoR3!"

  sku_name   = "B_Gen5_1"
  version    = "8.0"
  storage_mb = 5120

  backup_retention_days        = 7
  geo_redundant_backup_enabled = false
  auto_grow_enabled            = true

  public_network_access_enabled    = false
  ssl_enforcement_enabled          = true
  ssl_minimal_tls_version_enforced = "TLS1_2"
}

resource "random_id" "server_id" {
  byte_length = 8
}

resource "azurerm_mysql_database" "mysql_db" {
  name                = "mydatabase"
  resource_group_name = azurerm_resource_group.app_service_rg.name
  server_name         = azurerm_mysql_server.mysql_server.name
  charset             = "utf8"
  collation           = "utf8_unicode_ci"
}
