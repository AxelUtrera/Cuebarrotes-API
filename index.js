require('dotenv').config();
const Server = require('./src/models/server');
const initDataBase = require('./src/config/dbConfig');
const server = new Server();
server.listen();
initDataBase();