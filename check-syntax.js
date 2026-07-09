var fs = require('fs');
var d = fs.readFileSync('dist/src/app.service.js', 'utf8');
var gdp = d.indexOf('getDashboardPage()');
var si = d.indexOf('<script>', gdp);
var ei = d.indexOf('</script>', si + 10);
var js = d.substring(si + 8, ei);

// Use node --check for better error reporting
fs.writeFileSync('dash_check.js', js, 'utf8');

// Try to parse with detailed error
var vm = require('vm');
try {
  var script = new vm.Script(js, { filename: 'dashboard.js' });
  console.log('JS VALID');
} catch(e) {
  console.log('Error:', e.message);
  var lineMatch = e.stack && e.stack.match(/dashboard\.js:(\d+)/);
  if (lineMatch) {
    var lineNum = parseInt(lineMatch[1]);
    console.log('Line:', lineNum);
    var lines = js.split('\n');
    for (var i = Math.max(0, lineNum - 3); i < Math.min(lines.length, lineNum + 2); i++) {
      console.log('  ' + (i+1) + ': ' + JSON.stringify(lines[i]).substring(0, 200));
    }
  }
  // Also try node --check
  var cp = require('child_process');
  var result = cp.execSync('node --check dash_check.js 2>&1 || true', { cwd: process.cwd() });
  console.log('node --check output:', result.toString());
}
