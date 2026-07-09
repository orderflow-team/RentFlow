var fs = require('fs');
var path = 'src/app.service.ts';
var content = fs.readFileSync(path, 'utf8');

// Find showBuildingDetail
var idx = content.indexOf('window.showBuildingDetail');
if (idx < 0) idx = content.indexOf('showBuildingDetail');
console.log('Found at position: ' + idx);
if (idx >= 0) {
  // Print next 4000 chars
  var snippet = content.substring(idx, Math.min(content.length, idx + 4000));
  console.log(snippet);
}
