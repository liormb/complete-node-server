import Sequelize from 'sequelize';
import sequelize from '../utils/database';

const CartProduct = sequelize.define('cartProduct', {
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

export default CartProduct;
