import Redis from "ioredis";
// Set up Redis connection for job orchestration
const redis = new Redis({
  host: "redis-12084.c305.ap-south-1-1.ec2.redns.redis-cloud.com", // Provided by RedisLabs
  port: 12084, // Default Redis port
  password: "qHc9YHC5ficHDzZJXYcFtFOaJffhqCRT", // Your Redis password
  db: 0,
  enableReadyCheck: true,
  retryStrategy: (times) => Math.min(times * 50, 2000), // Exponential backoff
  maxRetriesPerRequest: null,
});

redis.on("connect", () => {
  console.log("Successfully connected to Redis!");
});

redis.on("error", (err) => {
  console.error("Error connecting to Redis:", err);
});

const handleTestRedis = () => {
  // Test the connection by setting a key
  redis
    .set("mykey", "Hello, Redis!")
    .then(() => {
      console.log("Key set successfully");
    })
    .catch((err) => {
      console.error("Error setting key:", err);
    });

  // Test by getting the value of the key
  redis
    .get("mykey")
    .then((result) => {
      console.log("Value of mykey:", result); // Output: Hello, Redis!
    })
    .catch((err) => {
      console.error("Error getting value:", err);
    });
};

export { redis, handleTestRedis };
