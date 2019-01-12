import Sequelize from 'sequelize';
import sequelize from '../utils/database';

const OrderProduct = sequelize.define('orderProduct', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
    },
    quantity: {
        type: Sequelize.INTEGER,
        allowNull: false,
    },
});

export default OrderProduct;
