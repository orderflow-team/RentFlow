var fs = require('fs');
var path = 'src/app.service.ts';
var content = fs.readFileSync(path, 'utf8');

// Show lines 2015-2060 of the file (the corrupted area)
var lines = content.split('\n');
for (var i = 2015; i < Math.min(2065, lines.length); i++) {
  console.log('' + (i + 1) + ': ' + JSON.stringify(lines[i]).substring(0, 500));
}
