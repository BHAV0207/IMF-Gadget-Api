const Redis = require('ioredis');

const redisUrl = process.env.REDIS_URL || 'redis://default:<password>@<hostname>:<port>';

const redis = new Redis(redisUrl);

redis.on("connect" , () => {
  console.log("connected to Redis...");
})

redis.on("error" , (err) => {
  console.error("Redis error" , err);
})

module.exports = redis;