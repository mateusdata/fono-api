const cron = require('node-cron');
const os = require('os');

const { exec } = require('child_process');

cron.schedule("2 * * * * *", () => {

    exec(`find ${os.temp()} -type f -name \"*pdf\" -mmin +2 -delete`, (error, stdout, stderr) => {
      if (error) {
        return;
      }
      if (stderr) {
        return;
      }
    });
});


