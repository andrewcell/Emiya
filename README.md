# Emiya
Source code repository of [DodoSeki](https://dodo.ij.r)

Made by using Node.Js, React, Vue.

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
