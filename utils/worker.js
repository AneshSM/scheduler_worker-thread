import { workerData, parentPort } from "worker_threads";
import { taskHandlers } from "../tasks/index.js";

const { task } = workerData;

(async () => {
  try {
    console.log("Initiate task execution", task.name);
    const handler = taskHandlers[task.name];
    if (!handler) {
      throw new Error(`No handler found for task: ${task.name}`);
    } else await handler(task.data);
    parentPort.postMessage("done");
  } catch (error) {
    console.log("Error while executing handlers in worker", error);
    throw error;
  }
})();
