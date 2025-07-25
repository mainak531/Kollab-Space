const Sequelize = require("sequelize");

const DB_NAME = process.env.DB_NAME || "kollab";
const DB_USER = process.env.DB_USER || "kollabadmin";
const DB_PASS = process.env.DB_PASSWORD || "kollabpass";
const DB_HOST = process.env.DB_HOST || "localhost";
const useSSL = process.env.DB_SSL === "true";

const db = new Sequelize(DB_NAME, DB_USER, DB_PASS, {
  host: DB_HOST,
  dialect: "postgres",
  dialectOptions: useSSL
    ? {
        ssl: {
          require: true,
          rejectUnauthorized: false,
        },
      }
    : {},
  logging: false,
});

db.authenticate()
  .then(() => console.log("✅ Database connected"))
  .catch((err) => console.error("❌ Error creating DB -", err));

module.exports = db;


