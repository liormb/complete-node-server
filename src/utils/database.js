import Sequelize from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const sequelize = new Sequelize(
    'node-complete',
    'root', process.env.DB_PASSWORD, // my password
    {
        dialect: 'mysql',
        host: 'localhost',
    },
);

export default sequelize;
