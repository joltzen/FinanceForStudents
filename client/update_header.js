const replace = require('replace-in-file');

const options = {
  files: ['src/**/*.js'], // Adjust this to match your file patterns
  from: /\/\*\*\s+([\s\S]*?)\s+\*\/\s*/gm,
  to: `/**
* Copyright (c) ${new Date().getFullYear()}, Jason Oltzen
*
*/`,
};

try {
  const changes = replace.sync(options);
  console.log('Header updated in files:', changes.join(', '));
} catch (error) {
  console.error('Error updating header:', error);
}
