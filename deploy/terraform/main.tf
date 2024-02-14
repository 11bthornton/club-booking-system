resource "azurerm_resource_group" "res-0" {
  location = "uksouth"
  name     = "club-booking-rg"
}
resource "azurerm_mysql_flexible_server" "res-1" {
  location            = "uksouth"
  name                = "club-booking-db"
  resource_group_name = "club-booking-rg"
  tags = {
    environment = "production"
    project     = "club-booking"
  }
  zone = "1"
}
resource "azurerm_mysql_flexible_database" "res-9" {
  charset             = "utf8mb4"
  collation           = "utf8mb4_general_ci"
  name                = "clubbookingdb"
  resource_group_name = "club-booking-rg"
  server_name         = "club-booking-db"
  depends_on = [
    azurerm_mysql_flexible_server.res-1,
  ]
}
resource "azurerm_mysql_flexible_database" "res-10" {
  charset             = "utf8mb4"
  collation           = "utf8mb4_0900_ai_ci"
  name                = "forge"
  resource_group_name = "club-booking-rg"
  server_name         = "club-booking-db"
  depends_on = [
    azurerm_mysql_flexible_server.res-1,
  ]
}
resource "azurerm_mysql_flexible_database" "res-11" {
  charset             = "utf8mb3"
  collation           = "utf8mb3_general_ci"
  name                = "information_schema"
  resource_group_name = "club-booking-rg"
  server_name         = "club-booking-db"
  depends_on = [
    azurerm_mysql_flexible_server.res-1,
  ]
}
resource "azurerm_mysql_flexible_database" "res-12" {
  charset             = "utf8mb4"
  collation           = "utf8mb4_0900_ai_ci"
  name                = "mysql"
  resource_group_name = "club-booking-rg"
  server_name         = "club-booking-db"
  depends_on = [
    azurerm_mysql_flexible_server.res-1,
  ]
}
resource "azurerm_mysql_flexible_database" "res-13" {
  charset             = "utf8mb4"
  collation           = "utf8mb4_0900_ai_ci"
  name                = "performance_schema"
  resource_group_name = "club-booking-rg"
  server_name         = "club-booking-db"
  depends_on = [
    azurerm_mysql_flexible_server.res-1,
  ]
}
resource "azurerm_mysql_flexible_database" "res-14" {
  charset             = "utf8mb4"
  collation           = "utf8mb4_0900_ai_ci"
  name                = "sys"
  resource_group_name = "club-booking-rg"
  server_name         = "club-booking-db"
  depends_on = [
    azurerm_mysql_flexible_server.res-1,
  ]
}
resource "azurerm_mysql_flexible_server_firewall_rule" "res-15" {
  end_ip_address      = "255.255.255.255"
  name                = "AllowAll_2024-2-4_14-53-29"
  resource_group_name = "club-booking-rg"
  server_name         = "club-booking-db"
  start_ip_address    = "0.0.0.0"
  depends_on = [
    azurerm_mysql_flexible_server.res-1,
  ]
}
resource "azurerm_data_factory" "res-16" {
  location            = "uksouth"
  name                = "club-booking-factory"
  resource_group_name = "club-booking-rg"
  identity {
    type = "SystemAssigned"
  }
}
resource "azurerm_service_plan" "res-17" {
  location            = "ukwest"
  name                = "ASP-clubbookingrg-af57"
  os_type             = "Linux"
  resource_group_name = "club-booking-rg"
  sku_name            = "P0v3"
}
resource "azurerm_linux_web_app" "res-18" {
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
    DB_PASSWORD                                     = "Jollycase#15"
    DB_PORT                                         = "3306"
    DB_USERNAME                                     = "clubbookingdbadmin"
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
  resource_group_name = "club-booking-rg"
  service_plan_id     = "/subscriptions/7edcaefc-2472-4932-afc9-92f50890c417/resourceGroups/club-booking-rg/providers/Microsoft.Web/serverfarms/ASP-clubbookingrg-af57"
  site_config {
    always_on        = false
    app_command_line = "/home/startup.sh"
    ftps_state       = "FtpsOnly"
  }
  sticky_settings {
    app_setting_names = ["APP_DEBUG", "APPINSIGHTS_INSTRUMENTATIONKEY", "APPLICATIONINSIGHTS_CONNECTION_STRING ", "APPINSIGHTS_PROFILERFEATURE_VERSION", "APPINSIGHTS_SNAPSHOTFEATURE_VERSION", "ApplicationInsightsAgent_EXTENSION_VERSION", "XDT_MicrosoftApplicationInsights_BaseExtensions", "DiagnosticServices_EXTENSION_VERSION", "InstrumentationEngine_EXTENSION_VERSION", "SnapshotDebugger_EXTENSION_VERSION", "XDT_MicrosoftApplicationInsights_Mode", "XDT_MicrosoftApplicationInsights_PreemptSdk", "APPLICATIONINSIGHTS_CONFIGURATION_CONTENT", "XDT_MicrosoftApplicationInsightsJava", "XDT_MicrosoftApplicationInsights_NodeJS"]
  }
  depends_on = [
    azurerm_service_plan.res-17,
  ]
}
resource "azurerm_app_service_custom_hostname_binding" "res-31" {
  app_service_name    = "club-booking"
  hostname            = "club-booking.azurewebsites.net"
  resource_group_name = "club-booking-rg"
  depends_on = [
    azurerm_linux_web_app.res-18,
  ]
}
resource "azurerm_linux_web_app_slot" "res-32" {
  app_service_id = "/subscriptions/7edcaefc-2472-4932-afc9-92f50890c417/resourceGroups/club-booking-rg/providers/Microsoft.Web/sites/club-booking"
  app_settings = {
    APPINSIGHTS_INSTRUMENTATIONKEY                  = "89a68436-801c-477d-91dd-087e26def990"
    APPINSIGHTS_PROFILERFEATURE_VERSION             = "1.0.0"
    APPINSIGHTS_SNAPSHOTFEATURE_VERSION             = "1.0.0"
    APPLICATIONINSIGHTS_CONNECTION_STRING           = "InstrumentationKey=89a68436-801c-477d-91dd-087e26def990;IngestionEndpoint=https://ukwest-0.in.applicationinsights.azure.com/;LiveEndpoint=https://ukwest.livediagnostics.monitor.azure.com/"
    APP_DEBUG                                       = "true"
    APP_ENV                                         = "staging"
    APP_KEY                                         = "base64:8FMojiIlvdOe+6AU8ZWK7Bp2Vz/UnLCfhUosfia3DCA="
    APP_NAME                                        = "club-booking"
    APP_URL                                         = "https://club-booking.azurewebsites.net/"
    ApplicationInsightsAgent_EXTENSION_VERSION      = "~2"
    DB_CONNECTION                                   = "mysql"
    DB_HOST                                         = "club-booking-db.mysql.database.azure.com"
    DB_PASSWORD                                     = "Jollycase#15"
    DB_PORT                                         = "3306"
    DB_USERNAME                                     = "clubbookingdbadmin"
    DiagnosticServices_EXTENSION_VERSION            = "~3"
    InstrumentationEngine_EXTENSION_VERSION         = "disabled"
    MYSQL_ATTR_SSL_KEY                              = "/home/site/wwwroot/DigiCertGlobalRootG2.crt.pem"
    SnapshotDebugger_EXTENSION_VERSION              = "disabled"
    XDT_MicrosoftApplicationInsights_BaseExtensions = "disabled"
    XDT_MicrosoftApplicationInsights_Mode           = "recommended"
    XDT_MicrosoftApplicationInsights_PreemptSdk     = "disabled"
  }
  name = "staging"
  site_config {
    always_on        = false
    app_command_line = "/home/startup.sh"
    ftps_state       = "FtpsOnly"
  }
  depends_on = [
    azurerm_linux_web_app.res-18,
  ]
}
resource "azurerm_app_service_slot_custom_hostname_binding" "res-36" {
  app_service_slot_id = "/subscriptions/7edcaefc-2472-4932-afc9-92f50890c417/resourceGroups/club-booking-rg/providers/Microsoft.Web/sites/club-booking/slots/staging"
  hostname            = "club-booking-staging.azurewebsites.net"
  depends_on = [
    azurerm_linux_web_app_slot.res-32,
  ]
}
resource "azurerm_linux_web_app_slot" "res-179" {
  app_service_id = "/subscriptions/7edcaefc-2472-4932-afc9-92f50890c417/resourceGroups/club-booking-rg/providers/Microsoft.Web/sites/club-booking"
  app_settings = {
    APPINSIGHTS_INSTRUMENTATIONKEY                  = "89a68436-801c-477d-91dd-087e26def990"
    APPINSIGHTS_PROFILERFEATURE_VERSION             = "1.0.0"
    APPINSIGHTS_SNAPSHOTFEATURE_VERSION             = "1.0.0"
    APPLICATIONINSIGHTS_CONNECTION_STRING           = "InstrumentationKey=89a68436-801c-477d-91dd-087e26def990;IngestionEndpoint=https://ukwest-0.in.applicationinsights.azure.com/;LiveEndpoint=https://ukwest.livediagnostics.monitor.azure.com/"
    APP_DEBUG                                       = "true"
    APP_ENV                                         = "staging"
    APP_KEY                                         = "base64:8FMojiIlvdOe+6AU8ZWK7Bp2Vz/UnLCfhUosfia3DCA="
    APP_NAME                                        = "club-booking"
    APP_URL                                         = "https://club-booking.azurewebsites.net/"
    ApplicationInsightsAgent_EXTENSION_VERSION      = "~2"
    DB_CONNECTION                                   = "mysql"
    DB_HOST                                         = "club-booking-db.mysql.database.azure.com"
    DB_PASSWORD                                     = "Jollycase#15"
    DB_PORT                                         = "3306"
    DB_USERNAME                                     = "clubbookingdbadmin"
    DiagnosticServices_EXTENSION_VERSION            = "~3"
    InstrumentationEngine_EXTENSION_VERSION         = "disabled"
    MYSQL_ATTR_SSL_KEY                              = "/home/site/wwwroot/DigiCertGlobalRootG2.crt.pem"
    SnapshotDebugger_EXTENSION_VERSION              = "disabled"
    XDT_MicrosoftApplicationInsights_BaseExtensions = "disabled"
    XDT_MicrosoftApplicationInsights_Mode           = "recommended"
    XDT_MicrosoftApplicationInsights_PreemptSdk     = "disabled"
  }
  name = "testing"
  site_config {
    always_on        = false
    app_command_line = "/home/startup.sh"
    ftps_state       = "FtpsOnly"
  }
  depends_on = [
    azurerm_linux_web_app.res-18,
  ]
}
resource "azurerm_app_service_slot_custom_hostname_binding" "res-183" {
  app_service_slot_id = "/subscriptions/7edcaefc-2472-4932-afc9-92f50890c417/resourceGroups/club-booking-rg/providers/Microsoft.Web/sites/club-booking/slots/testing"
  hostname            = "club-booking-testing.azurewebsites.net"
  depends_on = [
    azurerm_linux_web_app_slot.res-179,
  ]
}
resource "azurerm_monitor_smart_detector_alert_rule" "res-470" {
  description         = "Failure Anomalies notifies you of an unusual rise in the rate of failed HTTP requests or dependency calls."
  detector_type       = "FailureAnomaliesDetector"
  frequency           = "PT1M"
  name                = "Failure Anomalies - club-booking"
  resource_group_name = "club-booking-rg"
  scope_resource_ids  = ["/subscriptions/7edcaefc-2472-4932-afc9-92f50890c417/resourcegroups/club-booking-rg/providers/microsoft.insights/components/club-booking"]
  severity            = "Sev3"
  action_group {
    ids = [
      "/subscriptions/7edcaefc-2472-4932-afc9-92f50890c417/resourcegroups/club-booking-rg/providers/microsoft.insights/actionGroups/application-insights-smart-detection"
    ]
  }
}
resource "azurerm_monitor_action_group" "res-471" {
  name                = "Application Insights Smart Detection"
  resource_group_name = "club-booking-rg"
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
resource "azurerm_application_insights" "res-472" {
  application_type    = "web"
  location            = "ukwest"
  name                = "club-booking"
  resource_group_name = "club-booking-rg"
  sampling_percentage = 0
  workspace_id        = "/subscriptions/7edcaefc-2472-4932-afc9-92f50890c417/resourceGroups/DefaultResourceGroup-WUK/providers/Microsoft.OperationalInsights/workspaces/DefaultWorkspace-7edcaefc-2472-4932-afc9-92f50890c417-WUK"
}
