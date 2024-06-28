const fs = require('fs');
const configPath = './config.json';

let config: any;

try {
  const configFile = fs.readFileSync(configPath, 'utf8');
  config = JSON.parse(configFile);
} catch (error) {
  console.error(`Error reading config file: ${(error as Error).message}`);
}

console.log(typeof config.db.password, config.db.password);

export { config };
