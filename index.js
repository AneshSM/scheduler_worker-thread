import express from "express";
import {
  getBlocking,
  getNonBlocking,
  getPromises,
  getPromisesParallely,
  getRoot,
} from "./controllers/index.controller.js";

import {
  bullmqRedisQueueWorkerScheduler,
  jobClassScheduler,
  nodeCronScheduler,
  nodeScheduler,
} from "./test/index.test.js";

import { initDB } from "./utils/sequelize.util.js";
import {
  bulkCreateDummyTasks,
  fetchExecutableTask,
} from "./tasks/executeBackGroundTask.js";
import { scheduleJob } from "node-schedule";

await initDB();

const app = express();
app.get("/", getRoot);

app.get("/blocking", getBlocking);

app.get("/non-blocking", getNonBlocking);
app.get("/promises", getPromises);
app.get("/parallel-promises", getPromisesParallely);

app.listen(3000, () => {
  console.log("Server listening at https://localhost:3000");
});

// bulkCreateDummyTasks(11);

/*
 * Job scheduler class handling queue, timeout schedule with cron and execution in worker thread
 */
// jobClassScheduler();

/*
 * Task scheduler with node-cron executed in worker with in memeory queue and worker pool
 */
// nodeCronScheduler();

/*
 * Complete task orchestration with bullmq on redis handling queue, scheduling and execution in worker
 */
// bullmqRedisQueueWorkerScheduler();

/**
 * Task scheduler with node-scheduler, queue in postgre sql and execution in worker thread
 */
// nodeScheduler();

/**
 *Task scheduler with graphile worker
 */
