var fs = require('fs');
var path = 'src/app.service.ts';
var content = fs.readFileSync(path, 'utf8');

// Find the function definition (not just the call)
var idx = content.indexOf('showBuildingDetail = async function');
if (idx < 0) idx = content.indexOf('showBuildingDetail = function');
if (idx < 0) idx = content.indexOf('window.showBuildingDetail', 100000); // after index 100k (in template area)

console.log('Found at: ' + idx);

if (idx > 0) {
  // Print from function definition
  // Find the opening { of the function body
  var brace = content.indexOf('{', idx);
  if (brace > 0) {
    // Print next 4000 chars
    var snippet = content.substring(brace + 1, Math.min(content.length, brace + 4000));
    console.log(snippet);
  }
}
