import { Sequelize } from "sequelize";

const sequelize = new Sequelize(
  "postgres://postgres:Gain@123@localhost:5432/scheduler",
  {
    dialect: "postgres",
    pool: {
      max: 15, // Allow up to 15 concurrent connections
      min: 5, // Keep a minimum of 5 connections in the pool
      acquire: 30000, // Wait 30 seconds for a connection
      idle: 10000, // Release connection if idle for 10 seconds
    },
    retry: {
      max: 3, // Retry queries up to 3 times
    },
    logging: false,
  }
);

// sequelize.addHook("beforeConnect", () => {
//   console.log("Attempting to acquire a connection...");
// });

// sequelize.addHook("afterConnect", () => {
//   console.log("Connection successfully acquired.");
// });

// Synchronize models with the database
const initDB = async () => {
  try {
    await sequelize.authenticate(); // Ensure the database connection works
    console.log("Database connection established successfully.");

    await sequelize.sync({ alter: true }); // Sync all models to the database
    console.log("All models synchronized successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error.message);
  }
};
export { sequelize, initDB };
