import {
  createQueue,
  createWorker,
  scheduleRecurringTask,
  setupGracefulShutdown,
} from "../utils/bullmq.util.js";

// bullmq task orchestration with redis, worker, queue and scheduler
const bullmqRedisQueueWorkerScheduler = async () => {
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

export default bullmqRedisQueueWorkerScheduler;
