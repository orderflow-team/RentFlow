var fs = require('fs');
var content = fs.readFileSync('src/app.service.ts', 'utf8');

// Find and fix the back-link line: leftover ) + '\')" after data-name
// The pattern is: h(buildingName) + '") + '\')"
// Should be: h(buildingName) + '"

// Search for the unique pattern
var idx = content.indexOf('h(buildingName) + ');
if (idx >= 0) {
  var after = content.substring(idx);
  // Find the ) + '\')" pattern
  var closeIdx = after.indexOf(") + '");
  if (closeIdx >= 0 && closeIdx < 50) {
    // Check if this is the wrong closing paren (followed by + '\'))
    var leftover = after.substring(closeIdx, Math.min(closeIdx + 15, after.length));
    if (leftover.startsWith(") + '\\\\')") || leftover.startsWith(") + '\\')")) {
      // Replace from the ) to the " with just "
      var beforeContent = content.substring(0, idx + closeIdx);
      var afterContent = content.substring(idx + closeIdx + leftover.length);
      content = beforeContent + afterContent;
      console.log('Fixed back-link leftover');
    }
  }
}

// Also check for any other similar leftover patterns
// Search for '\')" which indicates leftover escape sequences
var re = /\)\s*\+\s*'\\\\'\)\s*"/g;
var match;
while ((match = re.exec(content)) !== null) {
  console.log('Found leftover pattern at', match.index);
}

fs.writeFileSync('src/app.service.ts', content, 'utf8');
console.log('File written');
