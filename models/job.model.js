import { DataTypes } from "sequelize";
import { sequelize } from "../utils/sequelize.util.js";

const JobClassTask = sequelize.define("JobClassTask", {
  name: { type: DataTypes.STRING, allowNull: false },
  data: { type: DataTypes.JSON, allowNull: true },
  status: {
    type: DataTypes.ENUM(
      "pending",
      "processing",
      "completed",
      "failed",
      "canceled"
    ),
    defaultValue: "pending",
  },
  cron: { type: DataTypes.STRING, allowNull: true },
  lastError: { type: DataTypes.TEXT, allowNull: true },
  retries: { type: DataTypes.INTEGER, defaultValue: 0 },
  maxRetries: { type: DataTypes.INTEGER, defaultValue: 3 },
  scheduledFor: { type: DataTypes.DATE, allowNull: true },
  priority: { type: DataTypes.INTEGER, defaultValue: 0 }, // High priority (lower number = higher priority)
});

export default JobClassTask;
