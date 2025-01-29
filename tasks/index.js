// taskLoader.js
import { scheduleJob } from "node-schedule";
import { updateDatabaseFlag } from "./updateDatabaseFlag.js";
import { updateTransportRelations } from "./updateTransportRelations.js";
import NodeSchedulerTask from "../models/nodeScheduler.model.js";
import { Op } from "sequelize";
import executeBackGroundTask from "./executeBackGroundTask.js";
export const taskHandlers = {
  updateDatabaseFlag,
  updateTransportRelations,
  exampleTask: async (data) => {
    // Logic for exampleTask
    if (!data || !data.param) {
      throw new Error("Invalid data for exampleTask");
    }
    console.log("Processing exampleTask with data:", data);
    await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate task
    console.log("Completed exampleTask with data:", data);
  },

  anotherTask: async (data) => {
    // Logic for anotherTask
    console.log("Processing anotherTask with data:", data);
    await new Promise((resolve) => setTimeout(resolve, 2000)); // Simulate task
    console.log("Completed anotherTask with data:", data);
  },
  exampleCronTask: async (data) => {
    // Logic for exampleTask
    if (!data || !data.param) {
      throw new Error("Invalid data for exampleCronTask");
    }
    console.log("Processing exampleCronTask with data:", data);
    await new Promise((resolve) => setTimeout(resolve, 10000)); // Simulate task
    console.log("Completed exampleCronTask with data:", data);
  },
  scheduleCleanup: async () => {
    console.log("Running job cleanup...");
    const result = await NodeSchedulerTask.destroy({
      where: {
        status: "completed",
        executedAt: {
          [Op.lte]: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        },
      },
    });
    console.log(`Deleted ${result} old jobs.`);
  },
  executeBackGroundTask,
};
