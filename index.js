import express from "express";

const app = express();

app.get("/", (req, res, next) => {
  res.send("Hello world!");
});

app.get("/blocking", (req, res, next) => {
  const now = new Date().getTime();
  while (new Date().getTime() < now + 10000) {}
  res.send("Blocking endponit execution completed");
});

app.get("/non-blocking", (req, res, next) => {
  new Promise(async (resolve) => {
    setTimeout(() => {
      resolve(res.send("Non blocking endponit execution completed"));
    }, 10000);
  });
});

app.listen(3000, () => {
  console.log("Server listening at https://localhost:3000");
});
