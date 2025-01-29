import { DataTypes } from "sequelize";
import { sequelize } from "../utils/sequelize.util.js";

const Tasks = sequelize.define("Task", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  data: {
    type: DataTypes.JSONB,
    allowNull: true, // Task-specific data
  },
  background_process: {
    type: DataTypes.BOOLEAN,
    defaultValue: false, // Only tasks with this true will be scheduled
  },
});

export default Tasks;
