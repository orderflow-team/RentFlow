var fs = require('fs');
var path = 'src/app.service.ts';
var content = fs.readFileSync(path, 'utf8');

// Find the key function definitions in the template area
var props = [
  { name: 'showPropertyDetail', desc: 'Property detail function' },
  { name: 'showBuildingDetail', desc: 'Building detail function' },
  { name: 'renderTenants', desc: 'Tenants rendering' },
  { name: 'data-prop-id=\"', desc: 'data-prop-id attribute (check for corruption)' },
  { name: 'add-building', desc: 'add-building action' },
  { name: 'add-unit', desc: 'add-unit action' },
  { name: 'show-building', desc: 'show-building action' },
  { name: 'buildingUnits', desc: 'building units div' },
  { name: 'propBuildings', desc: 'property buildings div' },
  { name: 'buildingId', desc: 'buildingId variable' },
  { name: 'propId', desc: 'propId variable (template use)' },
];

props.forEach(function(p) {
  var idx = content.indexOf(p.name);
  if (idx >= 0) {
    var lineNum = content.substring(0, idx).split('\n').length;
    console.log(p.desc + ' (' + p.name + ')');
    console.log('  Position: ' + idx + ', Line: ~' + lineNum);
    
    // Show the full line
    var lineStart = content.lastIndexOf('\n', idx) + 1;
    var lineEnd = content.indexOf('\n', idx);
    if (lineEnd < 0) lineEnd = Math.min(content.length, idx + 200);
    var line = content.substring(lineStart, lineEnd);
    console.log('  Line content: ' + JSON.stringify(line.substring(0, 200)));
    console.log('');
  }
});
