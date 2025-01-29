import { Worker } from "worker_threads";
import NodeSchedulerTask from "../models/nodeScheduler.model.js";
const CONCURRENCY = 5;
let runningJobs = 0;

/**
 * Add a task to the database and queue.
 */
export const addNodeSchedulerTask = async (name, data, options = {}) => {
  const { priority = 0, maxAttempts = 3 } = options;

  const task = await NodeSchedulerTask.create({
    name,
    data,
    priority,
    maxAttempts,
  });

  return task;
};

/**
 * Process jobs from the queue.
 */
export const processNodeSchedulerQueue = async (task) => {
  if (runningJobs >= CONCURRENCY) return;
  if (!task) return;
  task.status = "in_progress";
  await task.save();

  runningJobs++;
  console.log(runningJobs, "worker task execution", task.name);
  const worker = new Worker("./utils/worker.js", {
    workerData: { task: JSON.parse(JSON.stringify(task)) },
  });

  worker.on("message", async () => {
    task.status = "completed";
    task.executedAt = new Date();
    await task.save();
    runningJobs--;
    processNodeSchedulerQueue();
  });

  worker.on("error", async (err) => {
    console.error(`NodeSchedulerTask ${task.id} failed: ${err.message}`);
    task.status = "failed";
    task.lastError = err.message;
    task.attempts += 1;

    if (task.attempts < task.maxAttempts) {
      task.status = "pending"; // Retry
    }

    await task.save();
    runningJobs--;
    processNodeSchedulerQueue();
  });

  worker.on("exit", () => {
    console.log(`Worker for task ${task.id} exited.`);
  });
};
