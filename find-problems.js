var fs = require('fs');
var path = 'src/app.service.ts';
var buf = fs.readFileSync(path);
var content = buf.toString('utf8');

function findAll(content, substr) {
  var result = [];
  var idx = 0;
  while (true) {
    idx = content.indexOf(substr, idx);
    if (idx === -1) break;
    result.push(idx);
    idx += 1;
  }
  return result;
}

// Show all back-link occurrences in templates (not CSS)
var bl = findAll(content, 'back-link');
console.log('All back-link occurrences:');
bl.forEach(function(pos) {
  var snippet = content.substring(Math.max(0, pos - 30), Math.min(content.length, pos + 150));
  var lineNum = content.substring(0, pos).split('\n').length;
  console.log('  Position ' + pos + ' (line ~' + lineNum + '): ' + JSON.stringify(snippet));
});

// Show all penUnitModal occurrences
var pu = findAll(content, 'penUnitModal');
console.log('\nAll penUnitModal occurrences:');
pu.forEach(function(pos) {
  var snippet = content.substring(Math.max(0, pos - 30), Math.min(content.length, pos + 80));
  var lineNum = content.substring(0, pos).split('\n').length;
  console.log('  Position ' + pos + ' (line ~' + lineNum + '): ' + JSON.stringify(snippet));
});

// Show all add-unit data-action occurrences (not in event delegation)
var au = findAll(content, 'add-unit');
console.log('\nAll add-unit occurrences:');
au.forEach(function(pos) {
  var snippet = content.substring(Math.max(0, pos - 60), Math.min(content.length, pos + 100));
  var lineNum = content.substring(0, pos).split('\n').length;
  console.log('  Position ' + pos + ' (line ~' + lineNum + '): ' + JSON.stringify(snippet));
});
