var fs = require('fs');
var content = fs.readFileSync('src/app.service.ts', 'utf8');

// Find all lines with onclick= or onchange= that have variable arguments
var lines = content.split('\n');
for (var i = 0; i < lines.length; i++) {
  var line = lines[i];
  // Check for onclick with variable args (containing + and p. or b. or t. or u.)
  if ((line.includes('onclick="') || line.includes('onchange="')) &&
      (line.includes('p.id') || line.includes('propId') || line.includes('b.id') ||
       line.includes('buildingId') || line.includes('t.id') || line.includes('u.id') ||
       line.includes('renderProperties') || line.includes('renderLeases') || line.includes('renderMaintenance'))) {
    // Check it's not in our event delegation code
    if (line.includes('renderProperties') && line.includes('el.id')) continue;
    console.log('LINE ' + (i+1) + ':');
    var hex = Buffer.from(line, 'utf8').toString('hex');
    console.log('  HEX: ' + hex);
    console.log('  JSON: ' + JSON.stringify(line));
    console.log('  CHARS:');
    for (var j = 0; j < line.length; j++) {
      var ch = line[j];
      var code = line.charCodeAt(j);
      if (ch === '\\' || ch === "'" || ch === '"' || ch === '+' || ch === '(' || ch === ')') {
        process.stdout.write('  [' + j + '] code=' + code + ' char=' + (ch === '\\' ? 'BS' : ch) + '\n');
      }
    }
    console.log('');
  }
}
