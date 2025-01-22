import { Queue, Worker } from "bullmq";
import { redis } from "./redis.util.js";
import { taskHandlers } from "../tasks/index.js";
import { isValidCron } from "cron-validator";

// Configuration for queues
const QUEUE_OPTIONS = {
  connection: redis,
  defaultJobOptions: {
    attempts: 3, // Retry up to 3 times
    backoff: { type: "exponential", delay: 5000 }, // Exponential backoff for retries
    removeOnComplete: true, // Remove completed jobs automatically
    removeOnFail: 100, // Keep 100 failed jobs for debugging
  },
};

// Create a queue dynamically
const createQueue = (queueName) => {
  return new Queue(queueName, QUEUE_OPTIONS);
};

// Create a worker dynamically
const createWorker = (queueName, options = {}) => {
  return new Worker(
    queueName,
    async (job) => {
      const handler = taskHandlers[job.name];
      if (!handler) {
        console.error(`No handler found for job: ${job.name}`);
        throw new Error(`Handler not found for job: ${job.name}`);
      }

      try {
        console.log(`Processing job: ${job.name}`);
        return await handler(job.data);
      } catch (error) {
        console.error(`Job failed: ${job.id}, Error: ${error.message}`);
        throw error;
      }
    },
    {
      connection: redis,
      concurrency: options.concurrency || 5, // Default concurrency is 5
    }
  );
};

// Schedule a recurring job
const scheduleRecurringTask = async (
  queue,
  taskName,
  cronPattern,
  data = {}
) => {
  if (!isValidCron(cronPattern, { alias: true, allowBlankDay: true })) {
    throw new Error(`Invalid cron pattern: ${cronPattern}`);
  }

  const existingJobs = await queue.getRepeatableJobs();
  if (existingJobs.some((job) => job.name === taskName)) {
    console.log(`Job "${taskName}" is already scheduled.`);
    return;
  }

  await queue.add(taskName, data, {
    repeat: { cron: cronPattern },
  });
  console.log(
    `Scheduled recurring task "${taskName}" with cron: "${cronPattern}"`
  );
};

// Graceful shutdown for workers
const setupGracefulShutdown = (worker) => {
  const shutdown = async () => {
    console.log("Shutting down worker...");
    await worker.close();
    process.exit(0);
  };

  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);
};

export {
  scheduleRecurringTask,
  setupGracefulShutdown,
  createQueue,
  createWorker,
};
