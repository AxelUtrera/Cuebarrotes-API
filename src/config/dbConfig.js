const mongoose = require("mongoose");

const dbUser = process.env.DB_USER;
const dbPwd = process.env.DB_PWD;
const dbHost = process.env.DB_HOST;

const dbName = process.env.DB_NAME;

const DBURI = `mongodb+srv://${dbUser}:${dbPwd}@${dbHost}/${dbName}`;
const connect = () => {
    mongoose.connect(DBURI)
        .then(() => {
            console.log('Connected to database');
        })
        .catch((err) => {
            console.error('Data base Error!:', err);
        });
};

module.exports = () => {
    connect();
};