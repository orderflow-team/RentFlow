var fs = require('fs');
var path = 'src/app.service.ts';
var content = fs.readFileSync(path, 'utf8');

// Find HTML template strings in the dashboard page that have data-action attributes
var searchTerms = ['data-action="show-building"', 'data-action="show-property"', 'data-action="show-tenant"', 'data-action="edit-unit"', 'data-action="add-unit"', 'data-action="add-building"'];
searchTerms.forEach(function(term) {
  var idx = content.indexOf(term);
  if (idx >= 0) {
    // Skip event delegation code - look for template occurrences (inside string concatenation)
    var lineNum = content.substring(0, idx).split('\n').length;
    var lineStart = content.lastIndexOf('\n', idx) + 1;
    var lineEnd = content.indexOf('\n', idx);
    console.log('=== ' + term + ' at line ~' + lineNum + ' ===');
    var snippet = content.substring(Math.max(0, idx - 120), Math.min(content.length, idx + 200));
    console.log(JSON.stringify(snippet));
    console.log('');
  }
});
