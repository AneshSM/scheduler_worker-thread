import express from "express";
import {
  getBlocking,
  getNonBlocking,
  getPromises,
  getPromisesParallely,
  getRoot,
} from "./controllers/index.controller.js";
import {
  enqueueTask,
  scheduleRecurringTaskCustom,
  setupGracefulShutdownCustom,
} from "./services/queue.service.js";
import { initDB } from "./utils/sequelize.util.js";
import {
  createQueue,
  createWorker,
  setupGracefulShutdown,
  scheduleRecurringTask,
} from "./utils/taskOrchestration.util.js";

const app = express();
await initDB(); // Call the function to initialize the DB

app.get("/", getRoot);

app.get("/blocking", getBlocking);

app.get("/non-blocking", getNonBlocking);
app.get("/promises", getPromises);
app.get("/parallel-promises", getPromisesParallely);

app.listen(3000, () => {
  console.log("Server listening at https://localhost:3000");
});

// bullmq task orchestration with redis, worker, queue and scheduler
const redisQueueWorkerScheduler = async () => {
  try {
    const queue = createQueue("taskQueue");
    const worker = createWorker("taskQueue", { concurrency: 10 });

    setupGracefulShutdown(worker);

    // Schedule recurring jobs
    await scheduleRecurringTask(queue, "updateDatabaseFlag", "0 0 * * *"); // Every midnight
    await scheduleRecurringTask(
      queue,
      "updateTransportRelations",
      "*/5 * * * *"
    ); // Every 5 min

    console.log("Worker is listening for jobs...");
  } catch (error) {
    console.error(`Error in main execution: ${error.message}`);
    process.exit(1);
  }
};

// Example scheduling and executing tasks with sequelize storage

const runApp = async () => {
  console.log("Starting task scheduler...");

  // Schedule tasks
  await scheduleRecurringTaskCustom("updateDatabaseFlag", "*/5 * * * *", {
    key: "value",
  });

  // Enqueue a one-time task
  await enqueueTask("updateDatabaseFlag");

  // Graceful shutdown
  setupGracefulShutdownCustom();
};

// runApp();
// redisQueueWorkerScheduler();
