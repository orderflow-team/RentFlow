var fs = require('fs');
var path = 'src/app.service.ts';
var content = fs.readFileSync(path, 'utf8');

// Find the setContent call that starts the building detail template
// This is after "← Back to buildings" in the template
var markers = [
  '← Back to buildings',
  'isStaff ?',
  'unitFilter',
  'data-prop-id',
  'edit-unit',
  'buildingUnits',
  'showBuildingDetail'
];

markers.forEach(function(m) {
  var idx = content.indexOf(m);
  if (idx >= 0) {
    var lineStart = content.lastIndexOf('\n', idx) + 1;
    var lineEnd = content.indexOf('\n', idx);
    if (lineEnd < 0) lineEnd = content.length;
    var line = content.substring(lineStart, lineEnd);
    console.log('=== ' + m + ' at position ' + idx + ' ===');
    console.log(line.substring(0, 500));
    console.log('');
  }
});
