import { JobScheduler } from "../services/job.service.js";

// Main logic to start the job scheduler
const jobClassScheduler = async () => {
  try {
    const scheduler = new JobScheduler();

    const backgroundJobs = [
      // {
      //   name: "anotherTask",
      //   params: { another: "bar" },
      //   options: {
      //     cron: "*/3 * * * *", // Runs every 5 minutes
      //     maxRetries: 3, // Max retries on failure
      //     priority: 2, // Priority (1 = high priority)
      //   },
      // },
      // {
      //   name: "exampleTask",
      //   params: { example: "bar" },
      //   options: {
      //     cron: "*/5 * * * *", // Runs every 5 minutes
      //     maxRetries: 3, // Max retries on failure
      //     priority: 1, // Priority (1 = high priority)
      //   },
      // },
      // {
      //   name: "updateDatabaseFlag",
      //   options: {
      //     cron: "*/1 * * * *", // Runs every 5 minutes
      //     maxRetries: 3, // Max retries on failure
      //     priority: 4, // Priority (1 = high priority)
      //   },
      // },
      {
        name: "updateTransportRelations",
        options: {
          cron: "*/1 * * * *", // Runs every 1 minutes
          maxRetries: 3, // Max retries on failure
          priority: 3, // Priority (1 = high priority)
        },
      },
    ];

    await Promise.all(
      backgroundJobs.map((job) =>
        scheduler.addJob({
          name: job.name,
          data: job.params,
          options: job.options,
        })
      )
    );
    // Start the job scheduler
    await scheduler.start();

    // Graceful shutdown handling
    process.on("SIGINT", () => scheduler.shutdown());
    process.on("SIGTERM", () => scheduler.shutdown());
  } catch (error) {
    console.error("Error starting the job scheduler:", error.message);
    process.exit(1);
  }
};

export default jobClassScheduler;
