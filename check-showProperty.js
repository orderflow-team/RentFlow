var fs = require('fs');
var path = 'src/app.service.ts';
var content = fs.readFileSync(path, 'utf8');

// Check showPropertyDetail function
var idx = content.indexOf('showPropertyDetail');
var count = 0;
while (idx >= 0 && count < 5) {
  var lineNum = content.substring(0, idx).split('\n').length;
  if (lineNum > 100) {
    var lineStart = content.lastIndexOf('\n', idx) + 1;
    var snippet = content.substring(lineStart, Math.min(content.length, idx + 300));
    console.log('=== showPropertyDetail at line ~' + lineNum + ' ===');
    console.log(JSON.stringify(snippet.substring(0, 500)));
    console.log('');
  }
  idx = content.indexOf('showPropertyDetail', idx + 1);
  count++;
}
