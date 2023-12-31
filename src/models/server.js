const express = require('express');
const cors = require('cors');

class Server {
    constructor() {
        this.app = express();
        this.port = process.env.PORT;
        this.middlewares();
        this.routes();
    }


    middlewares() {
        this.app.use(cors());
        this.app.use(express.json());
        this.app.use(express.static('public'));
    }


    routes() {
        this.app.use('/api/v1/customer', require('../v1/routes/customerRoutes'));
        this.app.use('/api/v1/employee', require('../v1/routes/employeeRoutes'));
        this.app.use('/api/v1/administrator', require('../v1/routes/administratorRoutes'));
        this.app.use('/api/v1/auth', require('../v1/routes/authRoutes'));
    }


    listen() {
        this.app.listen(this.port, () => {
            console.log(`Server listening on port ${this.port}`)
        })
    }
}
module.exports = Server;