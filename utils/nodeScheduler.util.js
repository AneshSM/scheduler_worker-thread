import schedule from "node-schedule";
import {
  addNodeSchedulerTask,
  processNodeSchedulerQueue,
} from "../services/nodeScheduler.service.js";

/**
 * Schedule a repetative task based on seconds.
 * @param {number} intervalInSeconds - Interval in seconds.
 * @param {string} taskName - Name of the task.
 * @param {object} data - Data to pass to the task.
 */
export const scheduleRepetativeNodeSchedulerTask = (
  intervalInSeconds,
  taskName,
  data
) => {
  console.log(
    `Scheduling repetitive task "${taskName}" every ${intervalInSeconds} seconds.`
  );
  setInterval(() => {
    addNodeSchedulerTask(taskName, data);
  }, intervalInSeconds * 1000);
};

/**
 * Schedule a cron-based task.
 * @param {string} cronExpression - Cron-like expression.
 * @param {string} taskName - Name of the task.
 * @param {object} data - Data to pass to the task.
 */
export const scheduleNodeSchedulerTask = (cronExpression, taskName, data) => {
  schedule.scheduleJob(cronExpression, async () => {
    console.log(`node scheduler triggered for task: "${taskName}"`);
    const task = await addNodeSchedulerTask(taskName, data);
    processNodeSchedulerQueue(task);
  });
};

/**
 * Schedule a one-time or delayed task.
 * @param {Date | number} time - Time or delay in milliseconds.
 * @param {string} taskName - Name of the task.
 * @param {object} data - Data to pass to the task.
 */
export const scheduleDelayedNodeSchedulerTask = (time, taskName, data) => {
  const date = typeof time === "number" ? new Date(Date.now() + time) : time;
  schedule.scheduleJob(date, () => {
    console.log(`One-time job triggered for task: "${taskName}"`);
    addNodeSchedulerTask(taskName, data);
  });
};
