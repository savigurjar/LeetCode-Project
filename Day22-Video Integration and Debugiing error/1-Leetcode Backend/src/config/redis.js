

const { createClient } = require('redis');

const redisClient = createClient({
    username: 'default',
    password: process.env.REDIS_KEY,
    socket: {
        host: 'redis-18789.c14.us-east-1-2.ec2.redns.redis-cloud.com',
        port: 18789,
        // connectTimeout: 5555000
        // tls: true,
    }
});

redisClient.on("error", (err) => console.error(" Redis Client Error", err));

module.exports = redisClient;