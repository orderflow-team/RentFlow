var fs = require('fs');
var path = 'src/app.service.ts';
var content = fs.readFileSync(path, 'utf8');

// Find show-building in template area (not event delegation)
var idx = content.indexOf('show-building');
console.log('show-building occurrences:');
while (idx >= 0) {
  var lineNum = content.substring(0, idx).split('\n').length;
  if (lineNum > 1350) { // Only in template generation area
    var lineStart = content.lastIndexOf('\n', idx) + 1;
    var lineEnd = content.indexOf('\n', idx);
    console.log('  Line ~' + lineNum + ': ' + JSON.stringify(content.substring(idx, Math.min(content.length, idx + 200))));
  }
  idx = content.indexOf('show-building', idx + 1);
}

console.log('\nadd-unit occurrences:');
var idx2 = content.indexOf('add-unit');
while (idx2 >= 0) {
  var lineNum2 = content.substring(0, idx2).split('\n').length;
  if (lineNum2 > 1350) { // Only in template generation area
    var lineStart2 = content.lastIndexOf('\n', idx2) + 1;
    var lineEnd2 = content.indexOf('\n', idx2);
    console.log('  Line ~' + lineNum2 + ': ' + JSON.stringify(content.substring(idx2, Math.min(content.length, idx2 + 200))));
  }
  idx2 = content.indexOf('add-unit', idx2 + 1);
}
