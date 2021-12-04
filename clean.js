const fs = require('fs');
const dirname = 'dist';

try {
  fs.rmdirSync('./dist', {
    recursive: true,
  });
} catch {}
