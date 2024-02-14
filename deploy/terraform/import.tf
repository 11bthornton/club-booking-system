import {
  id = "/subscriptions/7edcaefc-2472-4932-afc9-92f50890c417/resourceGroups/club-booking-rg"
  to = azurerm_resource_group.res-0
}
import {
  id = "/subscriptions/7edcaefc-2472-4932-afc9-92f50890c417/resourceGroups/club-booking-rg/providers/Microsoft.DBforMySQL/flexibleServers/club-booking-db"
  to = azurerm_mysql_flexible_server.res-1
}
import {
  id = "/subscriptions/7edcaefc-2472-4932-afc9-92f50890c417/resourceGroups/club-booking-rg/providers/Microsoft.DBforMySQL/flexibleServers/club-booking-db/databases/clubbookingdb"
  to = azurerm_mysql_flexible_database.res-9
}
import {
  id = "/subscriptions/7edcaefc-2472-4932-afc9-92f50890c417/resourceGroups/club-booking-rg/providers/Microsoft.DBforMySQL/flexibleServers/club-booking-db/databases/forge"
  to = azurerm_mysql_flexible_database.res-10
}
import {
  id = "/subscriptions/7edcaefc-2472-4932-afc9-92f50890c417/resourceGroups/club-booking-rg/providers/Microsoft.DBforMySQL/flexibleServers/club-booking-db/databases/information_schema"
  to = azurerm_mysql_flexible_database.res-11
}
import {
  id = "/subscriptions/7edcaefc-2472-4932-afc9-92f50890c417/resourceGroups/club-booking-rg/providers/Microsoft.DBforMySQL/flexibleServers/club-booking-db/databases/mysql"
  to = azurerm_mysql_flexible_database.res-12
}
import {
  id = "/subscriptions/7edcaefc-2472-4932-afc9-92f50890c417/resourceGroups/club-booking-rg/providers/Microsoft.DBforMySQL/flexibleServers/club-booking-db/databases/performance_schema"
  to = azurerm_mysql_flexible_database.res-13
}
import {
  id = "/subscriptions/7edcaefc-2472-4932-afc9-92f50890c417/resourceGroups/club-booking-rg/providers/Microsoft.DBforMySQL/flexibleServers/club-booking-db/databases/sys"
  to = azurerm_mysql_flexible_database.res-14
}
import {
  id = "/subscriptions/7edcaefc-2472-4932-afc9-92f50890c417/resourceGroups/club-booking-rg/providers/Microsoft.DBforMySQL/flexibleServers/club-booking-db/firewallRules/AllowAll_2024-2-4_14-53-29"
  to = azurerm_mysql_flexible_server_firewall_rule.res-15
}
import {
  id = "/subscriptions/7edcaefc-2472-4932-afc9-92f50890c417/resourceGroups/club-booking-rg/providers/Microsoft.DataFactory/factories/club-booking-factory"
  to = azurerm_data_factory.res-16
}
import {
  id = "/subscriptions/7edcaefc-2472-4932-afc9-92f50890c417/resourceGroups/club-booking-rg/providers/Microsoft.Web/serverfarms/ASP-clubbookingrg-af57"
  to = azurerm_service_plan.res-17
}
import {
  id = "/subscriptions/7edcaefc-2472-4932-afc9-92f50890c417/resourceGroups/club-booking-rg/providers/Microsoft.Web/sites/club-booking"
  to = azurerm_linux_web_app.res-18
}
import {
  id = "/subscriptions/7edcaefc-2472-4932-afc9-92f50890c417/resourceGroups/club-booking-rg/providers/Microsoft.Web/sites/club-booking/hostNameBindings/club-booking.azurewebsites.net"
  to = azurerm_app_service_custom_hostname_binding.res-31
}
import {
  id = "/subscriptions/7edcaefc-2472-4932-afc9-92f50890c417/resourceGroups/club-booking-rg/providers/Microsoft.Web/sites/club-booking/slots/staging"
  to = azurerm_linux_web_app_slot.res-32
}
import {
  id = "/subscriptions/7edcaefc-2472-4932-afc9-92f50890c417/resourceGroups/club-booking-rg/providers/Microsoft.Web/sites/club-booking/slots/staging/hostNameBindings/club-booking-staging.azurewebsites.net"
  to = azurerm_app_service_slot_custom_hostname_binding.res-36
}
import {
  id = "/subscriptions/7edcaefc-2472-4932-afc9-92f50890c417/resourceGroups/club-booking-rg/providers/Microsoft.Web/sites/club-booking/slots/testing"
  to = azurerm_linux_web_app_slot.res-179
}
import {
  id = "/subscriptions/7edcaefc-2472-4932-afc9-92f50890c417/resourceGroups/club-booking-rg/providers/Microsoft.Web/sites/club-booking/slots/testing/hostNameBindings/club-booking-testing.azurewebsites.net"
  to = azurerm_app_service_slot_custom_hostname_binding.res-183
}
import {
  id = "/subscriptions/7edcaefc-2472-4932-afc9-92f50890c417/resourceGroups/club-booking-rg/providers/Microsoft.AlertsManagement/smartDetectorAlertRules/Failure Anomalies - club-booking"
  to = azurerm_monitor_smart_detector_alert_rule.res-470
}
import {
  id = "/subscriptions/7edcaefc-2472-4932-afc9-92f50890c417/resourceGroups/club-booking-rg/providers/Microsoft.Insights/actionGroups/Application Insights Smart Detection"
  to = azurerm_monitor_action_group.res-471
}
import {
  id = "/subscriptions/7edcaefc-2472-4932-afc9-92f50890c417/resourceGroups/club-booking-rg/providers/Microsoft.Insights/components/club-booking"
  to = azurerm_application_insights.res-472
}
