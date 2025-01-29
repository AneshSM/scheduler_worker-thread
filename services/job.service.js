import { Worker } from "worker_threads";
import cronParser from "cron-parser";
import path from "path";
import JobClassTask from "../models/job.model.js";

const retryStrategies = {
  exponentialBackoff: (retries) => Math.pow(2, retries) * 1000, // Exponential backoff
};

// Cron-based JobClass Task Scheduler
class JobScheduler {
  constructor() {
    this.workerPool = new Map();
    this.concurrency = 5;
  }

  // Add a new job
  async addJob({ name, data, options = {} }) {
    const {
      cron = null,
      maxRetries = 3,
      scheduledFor = null,
      priority = 0,
    } = options;

    if (cron && !cronParser.parseString(cron)) {
      throw new Error(`Invalid cron expression: ${cron}`);
    }

    const job = await JobClassTask.create({
      name,
      data,
      cron,
      maxRetries,
      scheduledFor,
      priority,
    });

    // If job has a cron, schedule it
    if (cron) {
      this.scheduleRecurringJob(job);
    }

    return job;
  }

  // Schedule recurring job
  scheduleRecurringJob(job) {
    const interval = cronParser.parseExpression(job.cron);
    const nextRun = interval.next().toDate();

    setTimeout(async () => {
      await this.addJob({
        name: job.name,
        data: job.data,
        options: {
          cron: job.cron,
          maxRetries: job.maxRetries,
          priority: job.priority,
        },
      });
      this.processPendingJobs();
      this.scheduleRecurringJob(job);
    }, nextRun - new Date());
  }

  // Process jobs with retries and priority
  async processJob(job) {
    try {
      // Mark job as processing
      await job.update({ status: "processing" });

      // Create worker thread for job execution
      const worker = new Worker(
        path.resolve(process.cwd(), "utils", "worker.js"),
        {
          workerData: { name: job.name, data: job.data },
        }
      );
      this.workerPool.set(job.id, worker);

      worker.on("message", async () => {
        await job.update({ status: "completed", lastError: null });
        this.workerPool.delete(job.id);
      });

      worker.on("error", async (error) => {
        const strategy = retryStrategies.exponentialBackoff;
        if (job.retries < job.maxRetries) {
          const nextRetryDelay = strategy(job.retries);
          await job.update({ status: "pending", retries: job.retries + 1 });
          console.info(`Retrying job ${job.id} with delay ${nextRetryDelay}ms`);
          setTimeout(() => this.processJob(job), nextRetryDelay);
        } else {
          await job.update({ status: "failed", lastError: error.message });
          console.error(
            `JobClass Task ${job.id} failed after ${job.retries} retries: ${error.message}`
          );
        }
        this.workerPool.delete(job.id);
      });

      worker.on("exit", (code) => {
        if (code !== 0) {
          console.error(`Worker for job ${job.id} exited with code ${code}`);
        }
        this.workerPool.delete(job.id);
      });
    } catch (error) {
      await job.update({ status: "failed", lastError: error.message });
      console.error(
        `Unexpected error processing job ${job.id}: ${error.message}`
      );
    }
  }

  // Process all pending jobs
  async processPendingJobs() {
    const pendingJobs = await JobClassTask.findAll({
      where: { status: "pending" },
      order: [["priority", "ASC"]], // Process high priority jobs first
    });

    for (const job of pendingJobs.slice(0, this.concurrency)) {
      this.processJob(job);
    }
  }

  // Start processing jobs
  async start() {
    await this.processPendingJobs();
    console.info("JobClass Task scheduler started.");
  }

  // Graceful shutdown
  async shutdown() {
    console.info("Shutting down workers...");
    for (const worker of this.workerPool.values()) {
      worker.terminate();
    }
    process.exit(0);
  }
}

export { JobScheduler };
