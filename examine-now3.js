var fs = require('fs');
var path = 'src/app.service.ts';
var content = fs.readFileSync(path, 'utf8');

// Search for showBuildingDetail in the template area (inside getDashboardPage)
var idx = content.indexOf('showBuildingDetail');
console.log('showBuildingDetail found at: ' + idx);

while (idx >= 0) {
  // Check context - is this a function definition?
  var context = content.substring(Math.max(0, idx - 30), Math.min(content.length, idx + 100));
  console.log('  Context: ' + JSON.stringify(context));
  
  idx = content.indexOf('showBuildingDetail', idx + 1);
}
