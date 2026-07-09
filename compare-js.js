var fs = require('fs');

// Check the LIVE served JS
var h = fs.readFileSync('C:/Users/cleve/Desktop/dash_live3.html', 'utf8');
var si = h.indexOf('<script>');
var ei = h.indexOf('</script>', si + 10);
var liveJS = h.substring(si + 8, ei);

// Check the DIST file JS
var d = fs.readFileSync('dist/src/app.service.js', 'utf8');
var gdp = d.indexOf('getDashboardPage()');
var si2 = d.indexOf('<script>', gdp);
var ei2 = d.indexOf('</script>', si2 + 10);
var distJS = d.substring(si2 + 8, ei2);

// Compare
console.log('Live JS length:', liveJS.length);
console.log('Dist JS length:', distJS.length);
console.log('Are they same length?', liveJS.length === distJS.length);

// Check for specific patterns
console.log('Live has onkeyup:', liveJS.indexOf('onkeyup') >= 0);
console.log('Dist has onkeyup:', distJS.indexOf('onkeyup') >= 0);
console.log('Live has event.keyCode:', liveJS.indexOf('event.keyCode') >= 0);
console.log('Dist has event.keyCode:', distJS.indexOf('event.keyCode') >= 0);

// If they differ, find the first difference
if (liveJS.length !== distJS.length) {
  var minLen = Math.min(liveJS.length, distJS.length);
  for (var i = 0; i < minLen; i++) {
    if (liveJS[i] !== distJS[i]) {
      console.log('First difference at position', i);
      console.log('Live context:', JSON.stringify(liveJS.substring(Math.max(0,i-20), i+40)));
      console.log('Dist context:', JSON.stringify(distJS.substring(Math.max(0,i-20), i+40)));
      break;
    }
  }
}

// Try vm on live JS
var vm = require('vm');
var liveClean = liveJS.replace(/\r/g, '');
try {
  vm.runInThisContext(liveClean, { filename: 'live.js' });
  console.log('LIVE JS: VALID via vm');
} catch(e) {
  console.log('LIVE JS ERROR: ' + e.message.substring(0, 80));
  var m = e.stack.match(/live.js:(\d+)/);
  if (m) {
    var lineNum = parseInt(m[1]);
    var lines = liveClean.split('\n');
    console.log('At line ' + lineNum + ':');
    for (var i = Math.max(0, lineNum-2); i < Math.min(lines.length, lineNum+2); i++) {
      console.log('  ' + (i+1) + ': ' + JSON.stringify(lines[i]).substring(0, 200));
    }
  }
}
