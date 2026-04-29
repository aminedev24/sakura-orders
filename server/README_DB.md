# Production Database Configuration

## Setup
1. Copy `server/.env.example` → `server/.env` and fill values.
2. Production server config (.htaccess or vhost):
   ```
   SetEnv APP_ENV production
   SetEnv DB_HOST localhost
   SetEnv DB_USER yqjezvte_abdennour
   SetEnv DB_PASS ~8fRLqf8Jim@
   SetEnv DB_NAME yqjezvte_sakura_orders
   ```
3. Restart web server.
4. Test: `curl yourdomain/server/api.php?action=fetch`

Local dev unchanged.
