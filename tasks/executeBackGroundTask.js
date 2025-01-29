import Tasks from "../models/Task.model.js";

// Function to generate dummy data
export async function bulkCreateDummyTasks(n) {
  try {
    // Generate an array of dummy tasks
    const tasks = Array.from({ length: n }, (_, i) => ({
      name: `Task_${i + 1}`, // Unique task name
      data: { info: `This is data for Task_${i + 1}` }, // Random JSON data
      background_process: i % 2 === 0, // Alternate between true and false
      status: "pending", // Default status
    }));

    // Bulk insert into the database
    await Tasks.bulkCreate(tasks, { validate: true });

    console.log(`${n} dummy tasks successfully created.`);
  } catch (error) {
    console.error("Error creating dummy tasks:", error);
  }
}

export const fetchExecutableTask = async () => {
  try {
    return JSON.parse(
      JSON.stringify(
        await Tasks.findAll({ where: { background_process: true } })
      )
    );
  } catch (error) {
    console.log("Error while fetching task list", error);
  }
};

const executeBackGroundTask = async ({ task }) => {
  // Logic for exampleTask
  if (!task) {
    throw new Error("Invalid data for executeBackGroundTask");
  }
  console.log("Processing executeBackGroundTask with data:", task);
  await new Promise((resolve) => setTimeout(resolve, 10000)); // Simulate task
  console.log("Completed exampleTask with data:", task);
};
export default executeBackGroundTask;
