const fs = require('fs');
const {version} = require('./package.json');

try {
  fs.rmdirSync(`obs-analog-clock-v${version}`, {
    recursive: true,
  });
} catch {}
