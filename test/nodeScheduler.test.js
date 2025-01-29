import { fetchExecutableTask } from "../tasks/executeBackGroundTask.js";
import {
  scheduleNodeSchedulerTask,
  scheduleDelayedNodeSchedulerTask,
  scheduleRepetativeNodeSchedulerTask,
} from "../utils/nodeScheduler.util.js";
// Custom task/job queue with postgresql
const nodeScheduler = async () => {
  // Schedule a job that runs every 10 seconds
  // scheduleRepetativeNodeSchedulerTask(10, "exampleTask", { param: "run every 10 seconds" });

  // Schedule a delayed job (runs after 60 seconds)
  // scheduleDelayedNodeSchedulerTask(60000, "exampleDelayedTask", {
  //   param: "run after 1 minute",
  // });

  // scheduleNodeSchedulerTask({ second: 20 }, "exampleCronTask", {
  //   param: "run every 20 seconds",
  // });

  // Schedule a cron job (every minute)
  // scheduleNodeSchedulerTask("0 */1 * * * *", "executeBackGroundTask", {
  //   param: "run every 1 minutes",
  // });
  // Schedule a cron job (every 5 minutes)
  // scheduleNodeSchedulerTask("0 */5 * * * *", "exampleCronTask", {
  //   param: "run every 5 minutes",
  // });
  fetchExecutableTask().then((taskList) =>
    taskList.map((task) =>
      scheduleNodeSchedulerTask("0 */1 * * * *", "executeBackGroundTask", {
        task,
      })
    )
  );
  scheduleNodeSchedulerTask("0 0 * * *", "updateTransportRelations", {
    param: "run everyday at end of the day ",
  });
  scheduleNodeSchedulerTask("0 0 * * *", "scheduleCleanup");
  console.log("Scheduler and queue system running...");
};

export default nodeScheduler;
