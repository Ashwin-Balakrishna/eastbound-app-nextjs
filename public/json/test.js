let json = require("./outputBackup.json");

let str = "";

let id = 1;

for (let k in json.countries) {
  for (let l in json.countries[k].states) {
    str += `${id++}, ${json.countries[k].states[l].state}, ${
      json.countries[k].country
    }\r\n`;
  }
}
