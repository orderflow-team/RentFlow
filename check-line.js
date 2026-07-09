var fs = require('fs');
var c = fs.readFileSync('src/app.service.ts', 'utf8');
var lines = c.split('\n');

// Also check the compiled JS for the error line
try {
  var d = fs.readFileSync('dist/src/app.service.js', 'utf8');
  var gdp = d.indexOf('getDashboardPage()');
  var si = d.indexOf('<script>', gdp);
  var ei = d.indexOf('</script>', si + 10);
  var js = d.substring(si + 8, ei);
  var jsLines = js.split('\n');
  console.log('=== Compiled JS line ~678 ===');
  for (var i = 675; i < Math.min(682, jsLines.length); i++) {
    console.log('  ' + (i+1) + ': ' + JSON.stringify(jsLines[i]).substring(0, 300));
  }
} catch(e) {
  console.log('Compiled JS error:', e.message.substring(0, 100));
}

console.log('\n=== TS Source lines with add-building or btn+propId ===');
for (var i = 0; i < lines.length; i++) {
  if ((lines[i].includes('add-building') || (lines[i].includes('propId') && lines[i].includes('btn')))) {
    if (lines[i].includes('data-prop-id') || lines[i].includes('add-building') || (lines[i].includes('propId') && lines[i].includes('add'))) {
      console.log('LINE ' + (i+1) + ': ' + JSON.stringify(lines[i]).substring(0, 500));
    }
  }
}
