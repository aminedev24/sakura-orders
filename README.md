# Orders App

## Local Dev
`npm run dev`
API: http://localhost/orders-app/server/api.php

## Gh-Pages Deploy
1. Update package.json homepage with your GitHub username.
2. `git init git remote add origin git@github.com:yourusername/orders-app.git`
3. `npm run deploy-gh`

## Capacitor Android
1. `npm i @capacitor/core @capacitor/android @capacitor/cli`
2. `npx cap add android`
3. `npx cap sync`
4. `npx cap open android`

Update capacitor.config.ts server.url with your IP.

## Env
Copy .env.example → .env with VITE_API_URL=your-prod-api
