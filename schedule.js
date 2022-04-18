var cron = require('node-cron');

cron.schedule('0 8 * * *', () => {
  console.log('running a task every day at 08:00');
});