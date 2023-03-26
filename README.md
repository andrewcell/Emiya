# Emiya
Source code repository of [DodoSeki](https://dodo.ij.r)

*** This project changed to public recently. Therefore, most of source codes are not well documented. please regard this.***

Made by using Node.Js, React, Vue.

## Instructions
### Run in development mode
```bash
$ npm run start:dev
```
This will run Webpack watch mode for Frontend and Node.js for Backend in same time.

### Build for Production
```bash
$ npm run build
```
This will build whole project into dist directory.
1. Compile TypeScript codes into JavaScript Node.js
2. Compile Frontend TypeScript codes (located in src/public/scripts) into every single entry files using Webpack
3. Obfuscate minified webpack frontend javascript files
4. After finished, It become able to run in Production mode
### Run in production mode
```bash
$ npm run start
```
1. Run build first
2. Edit environment file (env/production.env)
3. Run start
## Modules
 - Villagers - Provide charts for your villagers in ACNH and find awesome clothes for villager and check detail information
 - Translation - Search items, villagers and other things in different languages.
 - cp - Support page named "Resident services"
 - others: abandoned or unused entry files

## Environment variables
 - NODE_ENV : development or production
 - PORT : Listening port for Node.js
 - HOST : Listening host for Node.js
 - MONGODB : MongoDB connection string that use for Account and related data management
 - ALLOWREGISTER : Allow Register account
 - SENDGRID : SendGrid API Key for send verification mail after register
 - SENDGRIDSENDER : SendGrid Sender email address for verification mail
 - GITHUB : Github API key to display Repository status
 - EMIYAJAESKEY : EmiyaJ AES Key to encrypt payload when communicate to EmiyaJ API
 - EMIYAJAESIV : EmiyaJ AES Iv 
 - AESKEY : AES Key to encrypt payload between Frontend and Backend
 - ENCRYPTION : (not implemented) Switch to encrypt payload on Frontend
