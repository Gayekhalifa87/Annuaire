const redis = require('redis');

const redisClient = redis.createClient({
  url: 'redis://127.0.0.1:6379'
});

redisClient.on('error', (err) => console.error('❌ Erreur Redis:', err));
redisClient.on('connect', () => console.log('✅ Connecté à Redis'));

(async () => {
  await redisClient.connect();
})();

module.exports = redisClient;
