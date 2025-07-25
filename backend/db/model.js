const db = require("./connection");
const { DataTypes } = require("sequelize");

const User = db.define("users", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    name: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    gender: {
        type: DataTypes.CHAR,
        allowNull: false,
    },
});

db.sync()
    .then(() => console.log("Database has been synced"))
    .catch((err) => console.error("Error creating DB - " + err));

exports = module.exports = {
    db,
    User,
};
