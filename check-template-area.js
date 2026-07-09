var fs = require('fs');
var path = 'src/app.service.ts';
var content = fs.readFileSync(path, 'utf8');
var lines = content.split('\n');

// Show lines around the building card template (showPropertyDetail's try-catch)
// This is where data-action="show-building" was on building cards
console.log('=== Lines around building card generation ===');
for (var i = 0; i < lines.length; i++) {
  if (lines[i].indexOf('data-action="show-building"') >= 0 && i > 50) {
    console.log('Line ' + (i + 1) + ': ' + JSON.stringify(lines[i].substring(0, 300)));
  }
  if (lines[i].indexOf('margin-right:10px') >= 0) {
    console.log('Line ' + (i + 1) + ' (margin-right): ' + JSON.stringify(lines[i].substring(0, 400)));
  }
  if (lines[i].indexOf('propBuildings') >= 0) {
    console.log('Line ' + (i + 1) + ' (propBuildings): ' + JSON.stringify(lines[i].substring(0, 400)));
  }
  // Check for the unitFilter select
  if (lines[i].indexOf('unitFilter') >= 0 && i > 100) {
    console.log('Line ' + (i + 1) + ' (unitFilter): ' + JSON.stringify(lines[i].substring(0, 400)));
  }
  // Check for add-unit button
  if (lines[i].indexOf('add-unit') >= 0 && i > 100 && !lines[i].includes('case ')) {
    console.log('Line ' + (i + 1) + ' (add-unit NOT case): ' + JSON.stringify(lines[i].substring(0, 400)));
  }
  // Check for data-action="show-building" in template only (non-case, non-event-delegation)
  if (lines[i].indexOf('show-building') >= 0 && i > 100 && !lines[i].includes('case ') && !lines[i].includes('getAttribute')) {
    console.log('Line ' + (i + 1) + ' (show-building template): ' + JSON.stringify(lines[i].substring(0, 400)));
  }
}
