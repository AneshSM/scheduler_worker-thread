import { DataTypes } from "sequelize";
import { sequelize } from "../utils/sequelize.util.js";

const NodeCronTask = sequelize.define("NodeCronTask", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  status: {
    type: DataTypes.ENUM("pending", "processing", "completed", "failed"),
    defaultValue: "pending",
  },
  data: {
    type: DataTypes.JSONB,
    allowNull: true,
  },
  retryCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  maxRetries: {
    type: DataTypes.INTEGER,
    defaultValue: 3,
  },
  nextRetryAt: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  cronPattern: {
    type: DataTypes.STRING,
    allowNull: true,
  },
});

export default NodeCronTask;
