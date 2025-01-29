import {
  enqueueNodeCronTask,
  scheduleNodeCronTask,
  nodeCronSchedulerShutdownHandler,
} from "../services/scheduler.service.js";

// Example scheduling and executing tasks with sequelize storage
const nodeCronScheduler = async () => {
  console.log("Starting node cron task scheduler...");

  // Schedule tasks for every 5th minute
  await scheduleNodeCronTask("updateDatabaseFlag", "*/5 * * * *", {
    key: "value",
  });

  // Enqueue a one-time task
  await enqueueNodeCronTask("updateDatabaseFlag");

  // Graceful shutdown
  nodeCronSchedulerShutdownHandler();
};

export default nodeCronScheduler;
