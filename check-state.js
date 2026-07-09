var fs = require('fs');
var path = 'src/app.service.ts';
var content = fs.readFileSync(path, 'utf8');

// Find showBuildingDetail function and show the whole template section
var idx = content.indexOf('window.showBuildingDetail');
if (idx >= 0) {
  var lineStart = content.lastIndexOf('\n', idx);
  // Find the end of the function (next window.xxx or function)
  var lineEnd = content.indexOf('\n  window.', idx + 50);
  if (lineEnd < 0) lineEnd = content.indexOf('\n  async function', idx + 50);
  if (lineEnd < 0) lineEnd = idx + 5000;
  
  console.log('=== showBuildingDetail function ===');
  console.log(JSON.stringify(content.substring(idx, Math.min(content.length, lineEnd))));
}
