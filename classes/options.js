
const fs = require('fs'); 

class Options {
  constructor(file_path) {
    this.user = null;
    this.password = null;
    this.readOptionsFile(file_path);
  }

  readOptionsFile(file_path) {
    const file = fs.readFileSync(file_path, 'utf8');
    const lines = file.split('\n');

    for (let line of lines) {
      const [key, value] = line.trim().split('=');

      if (key === 'user') {
        this.user = value;
      } else if (key === 'password') {
        this.password = value;
      }
    }
  }
}

module.exports = Options;


