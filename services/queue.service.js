import { sequelize, Task } from "../utils/sequelize.util.js";
import { Worker } from "worker_threads";
import { isValidCron } from "cron-validator";
import cron from "node-cron";

const taskQueue = []; // In-memory task queue
const workerPool = [];
const MAX_WORKERS = 5;

// Function to create a new task
const createTask = async (taskName, data, cronPattern = null) => {
  const task = await Task.create({
    name: taskName,
    data: data,
    cronPattern: cronPattern,
  });
  return task;
};

// Function to schedule recurring tasks
const scheduleRecurringTaskCustom = async (
  taskName,
  cronPattern,
  data = {}
) => {
  if (!isValidCron(cronPattern, { alias: true, allowBlankDay: true })) {
    throw new Error(`Invalid cron pattern: ${cronPattern}`);
  }

  const existingTask = await Task.findOne({
    where: { name: taskName, cronPattern },
  });
  if (existingTask) {
    console.log(`Task "${taskName}" is already scheduled.`);
    return;
  }

  await createTask(taskName, data, cronPattern);

  cron.schedule(cronPattern, async () => {
    console.log(`Enqueuing task "${taskName}" as per cron pattern.`);
    enqueueTask(taskName);
  });

  console.log(
    `Scheduled recurring task "${taskName}" with cron pattern: "${cronPattern}"`
  );
};

// Function to enqueue tasks into the task queue
const enqueueTask = async (taskName) => {
  const task = await Task.findOne({
    where: { name: taskName, status: "pending" },
  });
  if (task) {
    taskQueue.push(task.id);
    console.log(`Task "${taskName}" added to queue.`);
    processTaskQueue(); // Trigger task processing
  }
};

// Process the task queue using worker threads
const processTaskQueue = async () => {
  while (taskQueue.length > 0 && workerPool.length < MAX_WORKERS) {
    const taskId = taskQueue.shift();

    const worker = new Worker("./services/worker.service.js", {
      workerData: { taskId },
    });

    workerPool.push(worker);

    worker.on("message", async (message) => {
      console.log(
        `Task ${message.taskId} completed with status: ${message.status}`
      );
    });

    worker.on("error", async (error) => {
      console.error(
        `Worker error for task: ${taskId}, Error: ${error.message}`
      );
    });

    worker.on("exit", (code) => {
      console.log(`Worker exited with code: ${code}`);
      workerPool.splice(workerPool.indexOf(worker), 1); // Remove worker from pool
    });
  }
};

// Graceful shutdown for workers
const setupGracefulShutdownCustom = async () => {
  const shutdown = async () => {
    console.log("Shutting down workers...");
    workerPool.forEach((worker) => worker.terminate());
    await sequelize.close();
    process.exit(0);
  };

  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);
};

export {
  createTask,
  scheduleRecurringTaskCustom,
  enqueueTask,
  setupGracefulShutdownCustom,
};
