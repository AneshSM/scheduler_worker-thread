import {
  blocker,
  nonBlocker,
  parallelPromises,
  promises,
} from "../services/index.service.js";

const getRoot = (req, res, next) => {
  res.send("Hello world!");
};
const getBlocking = (req, res, next) => {
  blocker();
  res.send("Blocking endponit execution completed");
};

const getNonBlocking = (req, res, next) => {
  nonBlocker
    .then(() => {
      res.send("Non blocking endponit execution completed");
    })
    .catch((err) => {
      res.status(500).send({ err, message: "Failed non blocking call" });
    });
};

const getPromises = (req, res, next) => {
  promises()
    .then(() => {
      res.send("Promise endponit execution completed");
    })
    .catch((err) => {
      res.status(500).send({ err, message: "Failed to get promise call" });
    });
};

const getPromisesParallely = (req, res, next) => {
  parallelPromises()
    .then(() => {
      res.send("Parallel  endponit execution completed");
    })
    .catch((err) => {
      res
        .status(500)
        .send({ err, message: "Failed to get Parallel promise call" });
    });
};

export {
  getRoot,
  getBlocking,
  getNonBlocking,
  getPromises,
  getPromisesParallely,
};
