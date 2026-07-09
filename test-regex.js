var fs = require('fs');
var content = fs.readFileSync('src/app.service.ts', 'utf8');

// Find a specific pattern location
var idx = content.indexOf('showPropertyDetail');
while (idx >= 0) {
  var snippet = content.substring(Math.max(0, idx - 30), idx + 80);
  if (snippet.includes('p.id') && snippet.includes('onclick')) {
    console.log('Found target pattern at byte', idx);
    
    var startIdx = snippet.indexOf('onclick="');
    var actualIdx = Math.max(0, idx - 30) + startIdx;
    var onclickEnd = content.indexOf('")', actualIdx + 20);
    
    var exactOnclick = content.substring(actualIdx, onclickEnd + 2);
    console.log('Exact onclick string length:', exactOnclick.length);
    console.log('Exact onclick chars:', JSON.stringify(exactOnclick));
    
    var codes = [];
    for (var i = 0; i < exactOnclick.length; i++) {
      codes.push(exactOnclick.charCodeAt(i));
    }
    console.log('Codes:', codes.join(','));
    
    // Test regexes directly using RegExp constructor to avoid escaping issues
    var r1 = new RegExp('onclick="showPropertyDetail');
    console.log('Regex1 (simple):', r1.test(exactOnclick));
    
    // Match two backslashes followed by a quote - use RegExp constructor for clarity
    var r2 = new RegExp('\\\\\\\\' + "'");
    console.log('Regex2 (\\\\\\\\\'):', r2.test(exactOnclick));
    
    // Match one backslash followed by a quote
    var r3 = new RegExp('\\\\' + "'");
    console.log('Regex3 (\\\\\'):', r3.test(exactOnclick));
    
    // Show raw bytes after the opening paren
    var parenIdx = exactOnclick.indexOf('(') + 1;
    var afterParen = exactOnclick.substring(parenIdx);
    console.log('After paren (first 30 chars):', JSON.stringify(afterParen.substring(0, 30)));
    
    // Show the 10 bytes after showPropertyDetail(
    var spdIdx = exactOnclick.indexOf('showPropertyDetail');
    var afterSPD = exactOnclick.substring(spdIdx + 'showPropertyDetail('.length);
    var buf = Buffer.from(afterSPD, 'utf8');
    console.log('Bytes after showPropertyDetail(:');
    for (var j = 0; j < Math.min(20, buf.length); j++) {
      process.stdout.write(buf[j].toString(16).padStart(2,'0') + '(' + buf[j] + ') ');
    }
    console.log();
    
    break;
  }
  idx = content.indexOf('showPropertyDetail', idx + 1);
}
