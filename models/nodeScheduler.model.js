import { DataTypes } from "sequelize";
import { sequelize } from "../utils/sequelize.util.js";

const NodeSchedulerTask = sequelize.define("NodeSchedulerTask", {
  name: { type: DataTypes.STRING, allowNull: false },
  data: { type: DataTypes.JSON, allowNull: true },
  status: {
    type: DataTypes.ENUM("pending", "in_progress", "completed", "failed"),
    defaultValue: "pending",
  },
  attempts: { type: DataTypes.INTEGER, defaultValue: 0 },
  maxAttempts: { type: DataTypes.INTEGER, defaultValue: 3 },
  lastError: { type: DataTypes.TEXT, allowNull: true },
  scheduledAt: { type: DataTypes.DATE, allowNull: true },
  executedAt: { type: DataTypes.DATE, allowNull: true },
  priority: { type: DataTypes.INTEGER, defaultValue: 0 },
});

export default NodeSchedulerTask;
