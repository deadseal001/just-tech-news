const { Sequelize } = require('sequelize');

const PORT = process.env.PORT || 3001;

require('dotenv').config();

//create connection to our db

const sequelize = new Sequelize(
    process.env.DB_NAME, 
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
    host: 'localhost',
    dialect: 'mysql',
    port:3306
    }
);

module.exports=sequelize;