resource "azurerm_resource_group" "club_booking_rg" {
  location = "uksouth"
  name     = "club-booking-rg"
}

resource "azurerm_mysql_flexible_server" "club_booking_db_server" {
  location            = "uksouth"
  name                = "club-booking-db"
  resource_group_name = azurerm_resource_group.club_booking_rg.name
  tags = {
    environment = "production"
    project     = "club-booking"
  }
  zone = "1"

  # Added administrator_login and administrator_login_password
  administrator_login         = "adminuser"
  administrator_password      = "AdminPassword123"

  sku_name   = "B_Standard_B1s" # Example SKU, adjust based on your requirements
  # storage_mb = 5120             # Minimum storage size for MySQL Flexible Server is 5GB
  version    = "5.7"            # Choose the MySQL version that suits your needs

  backup_retention_days        = 7

  # It's recommended to use a delegated subnet for Flexible Servers for enhanced security and networking features.
  # Ensure your network and subnet are properly configured to allow for this.
  # delegated_subnet_id = azurerm_subnet.example.id
}

resource "azurerm_mysql_flexible_database" "club_booking_main_db" {
  charset             = "utf8mb4"
  collation           = "utf8mb4_general_ci"
  name                = "clubbookingdb"
  resource_group_name = azurerm_resource_group.club_booking_rg.name
  server_name         = azurerm_mysql_flexible_server.club_booking_db_server.name
}

resource "azurerm_mysql_flexible_server_firewall_rule" "allow_all_ips" {
  end_ip_address      = "255.255.255.255"
  name                = "AllowAll_2024-2-4_14-53-29"
  resource_group_name = azurerm_resource_group.club_booking_rg.name
  server_name         = azurerm_mysql_flexible_server.club_booking_db_server.name
  start_ip_address    = "0.0.0.0"
}

resource "azurerm_data_factory" "club_booking_factory" {
  location            = "uksouth"
  name                = "club-booking-factory"
  resource_group_name = azurerm_resource_group.club_booking_rg.name
  identity {
    type = "SystemAssigned"
  }
}

resource "azurerm_service_plan" "club_booking_service_plan" {
  location            = "ukwest"
  name                = "ASP-clubbookingrg-af57"
  os_type             = "Linux"
  resource_group_name = azurerm_resource_group.club_booking_rg.name
  sku_name            = "B1"
}

resource "azurerm_linux_web_app" "club_booking_web_app" {
  app_settings = {
    APPINSIGHTS_INSTRUMENTATIONKEY                  = "89a68436-801c-477d-91dd-087e26def990"
    APPINSIGHTS_PROFILERFEATURE_VERSION             = "1.0.0"
    APPINSIGHTS_SNAPSHOTFEATURE_VERSION             = "1.0.0"
    APPLICATIONINSIGHTS_CONNECTION_STRING           = "InstrumentationKey=89a68436-801c-477d-91dd-087e26def990;IngestionEndpoint=https://ukwest-0.in.applicationinsights.azure.com/;LiveEndpoint=https://ukwest.livediagnostics.monitor.azure.com/"
    APP_DEBUG                                       = "true"
    APP_ENV                                         = "production"
    APP_KEY                                         = "base64:8FMojiIlvdOe+6AU8ZWK7Bp2Vz/UnLCfhUosfia3DCA="
    APP_NAME                                        = "club-booking"
    APP_URL                                         = "https://club-booking.azurewebsites.net/"
    ApplicationInsightsAgent_EXTENSION_VERSION      = "~2"
    DB_CONNECTION                                   = "mysql"
    DB_HOST                                         = "club-booking-db.mysql.database.azure.com"
    DB_PASSWORD                                     = club_booking_db_server.administrator_login_password
    DB_PORT                                         = "3306"
    DB_USERNAME                                     = club_booking_db_server.administrator_login
    DiagnosticServices_EXTENSION_VERSION            = "~3"
    InstrumentationEngine_EXTENSION_VERSION         = "disabled"
    MYSQL_ATTR_SSL_KEY                              = "/home/site/wwwroot/DigiCertGlobalRootG2.crt.pem"
    SnapshotDebugger_EXTENSION_VERSION              = "disabled"
    XDT_MicrosoftApplicationInsights_BaseExtensions = "disabled"
    XDT_MicrosoftApplicationInsights_Mode           = "recommended"
    XDT_MicrosoftApplicationInsights_PreemptSdk     = "disabled"
  }
  location            = "ukwest"
  name                = "club-booking"
  resource_group_name = azurerm_resource_group.club_booking_rg.name
  service_plan_id     = azurerm_service_plan.club_booking_service_plan.id
  site_config {
    always_on        = false
    app_command_line = "/home/site/wwwroot/deploy/startup.sh"
    ftps_state       = "FtpsOnly"
    application_stack {
      php_version = "8.2"
    }
  }
  sticky_settings {
    app_setting_names = ["APP_DEBUG", "APPINSIGHTS_INSTRUMENTATIONKEY", "APPLICATIONINSIGHTS_CONNECTION_STRING ", "APPINSIGHTS_PROFILERFEATURE_VERSION", "APPINSIGHTS_SNAPSHOTFEATURE_VERSION", "ApplicationInsightsAgent_EXTENSION_VERSION", "XDT_MicrosoftApplicationInsights_BaseExtensions", "DiagnosticServices_EXTENSION_VERSION", "InstrumentationEngine_EXTENSION_VERSION", "SnapshotDebugger_EXTENSION_VERSION", "XDT_MicrosoftApplicationInsights_Mode", "XDT_MicrosoftApplicationInsights_PreemptSdk", "APPLICATIONINSIGHTS_CONFIGURATION_CONTENT", "XDT_MicrosoftApplicationInsightsJava", "XDT_MicrosoftApplicationInsights_NodeJS"]
  }
}

resource "azurerm_monitor_smart_detector_alert_rule" "failure_anomalies_alert" {
  description         = "Failure Anomalies notifies you of an unusual rise in the rate of failed HTTP requests or dependency calls."
  detector_type       = "FailureAnomaliesDetector"
  frequency           = "PT1M"
  name                = "Failure Anomalies - club-booking-web-app"
  resource_group_name = azurerm_resource_group.club_booking_rg.name
  scope_resource_ids  = ["/subscriptions/7edcaefc-2472-4932-afc9-92f50890c417/resourcegroups/club-booking-rg/providers/microsoft.insights/components/club-booking-web-app"]
  severity            = "Sev3"
  action_group {
    ids = [
      "/subscriptions/7edcaefc-2472-4932-afc9-92f50890c417/resourcegroups/club-booking-rg/providers/microsoft.insights/actionGroups/application-insights-smart-detection"
    ]
  }
}

resource "azurerm_monitor_action_group" "smart_detection_action_group" {
  name                = "Application Insights Smart Detection"
  resource_group_name = azurerm_resource_group.club_booking_rg.name
  short_name          = "SmartDetect"
  arm_role_receiver {
    name                    = "Monitoring Contributor"
    role_id                 = "749f88d5-cbae-40b8-bcfc-e573ddc772fa"
    use_common_alert_schema = true
  }
  arm_role_receiver {
    name                    = "Monitoring Reader"
    role_id                 = "43d0d8ad-25c7-4714-9337-8ba259a9fe05"
    use_common_alert_schema = true
  }
}

resource "azurerm_application_insights" "club_booking_app_insights" {
  application_type    = "web"
  location            = "ukwest"
  name                = "club-booking-app-insights"
  resource_group_name = azurerm_resource_group.club_booking_rg.name
  sampling_percentage = 50
  workspace_id        = "/subscriptions/7edcaefc-2472-4932-afc9-92f50890c417/resourceGroups/DefaultResourceGroup-WUK/providers/Microsoft.OperationalInsights/workspaces/DefaultWorkspace-7edcaefc-2472-4932-afc9-92f50890c417-WUK"
}
