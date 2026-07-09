var fs = require('fs');
var path = 'src/app.service.ts';
var content = fs.readFileSync(path, 'utf8');
var lines = content.split('\n');
for (var i = 2025; i < Math.min(2095, lines.length); i++) {
  console.log('' + (i + 1) + ': ' + JSON.stringify(lines[i]).substring(0, 500));
}
