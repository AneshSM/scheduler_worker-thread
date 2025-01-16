import express from "express";
import {
  getBlocking,
  getNonBlocking,
  getPromises,
  getPromisesParallely,
  getRoot,
} from "./index.controller.js";

const app = express();

app.get("/", getRoot);

app.get("/blocking", getBlocking);

app.get("/non-blocking", getNonBlocking);
app.get("/promises", getPromises);
app.get("/parallel-promises", getPromisesParallely);

app.listen(3000, () => {
  console.log("Server listening at https://localhost:3000");
});
