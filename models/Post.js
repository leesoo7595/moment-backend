const Sequelize = require("sequelize");

class Post extends Sequelize.Model {
    static init(sequelize) {
        super.init({
            id: {type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true},
            title: {type: Sequelize.STRING, allowNull: false},
            category: {type: Sequelize.STRING, allowNull: true},
            date: {type: Sequelize.STRING, allowNull: false},
            address: {type: Sequelize.STRING, allowNull: false},
            lat: {type: Sequelize.FLOAT, allowNull: false},
            lng: {type: Sequelize.FLOAT, allowNull: false},
            summary: {type: Sequelize.STRING, allowNull: false},
            text: {type: Sequelize.STRING, allowNull: false},
            img: {type: Sequelize.ARRAY(Sequelize.STRING), allowNull: true}
        }, {sequelize, modelName: "post"})
    }
}

module.exports = {Post};