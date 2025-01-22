import { parentPort, workerData } from "worker_threads";
import { Task } from "../utils/sequelize.util.js";
import { taskHandlers } from "../tasks/index.js";

// Function to process a task
const processTask = async (taskId) => {
  console.log("Proecssing task, ", taskId);
  const task = await Task.findByPk(taskId);
  if (!task) {
    throw new Error(`Task not found: ${taskId}`);
  }

  const handler = taskHandlers[task.name];
  if (!handler) {
    throw new Error(`Handler not found for task: ${task.name}`);
  }

  try {
    console.log(`Processing task: ${task.name}`);
    await handler(task.data);
    task.status = "completed";
    await task.save();
    parentPort.postMessage({ taskId: task.id, status: "completed" });
  } catch (error) {
    console.error(`Task ${taskId} failed: ${error.message}`);
    if (task.retryCount < task.maxRetries) {
      task.retryCount++;
      task.status = "pending";
      task.nextRetryAt = new Date(Date.now() + 5000); // Retry after 5 seconds
      await task.save();
    } else {
      task.status = "failed";
      await task.save();
    }
    parentPort.postMessage({ taskId: task.id, status: "failed" });
  }
};

processTask(workerData.taskId);
