const blocker = () => {
  const now = new Date().getTime();
  while (new Date().getTime() < now + 10000) {}
  return;
};

const nonBlocker = () => {
  return new Promise(async (resolve) => {
    setTimeout(() => {
      resolve({});
    }, 10000);
  });
};

const sleep = (index) => {
  return new Promise((resolve) => {
    console.log("Sleep start");
    setTimeout(() => {
      console.log("Sleep completed");
      resolve(`Done, ${index}`);
    }, 10000);
  });
};

const promises = async () => {
  const result = [];
  for (let index = 0; index < 10; index++) {
    result.push(await sleep(index));
  }
  return result;
};

const parallelPromises = async () => {
  const promises = [];
  for (let index = 0; index < 10; index++) {
    promises.push(sleep(index));
  }
  return Promise.all(promises);
};

export { blocker, nonBlocker, promises, parallelPromises };
