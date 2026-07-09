var fs = require('fs');
var content = fs.readFileSync('src/app.service.ts', 'utf8');

// The TS source has: + '\") + '\\')\">  (leftover from bad replacement)
// Should be: + '\">
// In the compiled JS, this would be: + ' + h(buildingName) + ' + '\">  ... wait

// Actually, let me just find the exact leftover pattern in the file
// After data-name=\"' + h(buildingName) + '\', there's leftover: " + '\\')\"
// But the file actually has the characters from the TS template literal:
// The \ in the template is for escaping double-quotes in the HTML
// The \\ is for backslash in the template output

// Let me search for the specific known-bad pattern
// In the JSON output, the TS source line shows:
// ...h(buildingName) + '\") + '\\\\')\">
// The leftover: '\") + '\\')\" should just be '\"

// Find the pattern: ) + '\\')\" (closing paren + space + plus + space + escaped quote)
// In the TS source, after the back-link replacement, there should be this pattern
// but only if the fix failed.

// Search for the specifically wrong pattern
var search1 = ") + '\\\\')\\\"";
var idx = content.indexOf(search1);
if (idx >= 0) {
  // Found the leftover. Check if there's a data-name before it
  var before = content.substring(Math.max(0, idx - 80), idx);
  if (before.includes('data-name')) {
    // Replace ) + '\\')\" with just )\"
    // But actually, the ) is wrong too. The data-name value should end with '
    // So we need to go back to the ' before ) + and keep everything from there
    // The correct end is '\" (close attribute value)
    content = content.substring(0, idx) + '\"' + content.substring(idx + search1.length);
    console.log('Fixed back-link - removed leftover ) + escaped quote');
  }
}

// Also search for just the end sequence if it has different escaping
// Try with different backslash counts
if (idx < 0) {
  var search2 = ") + '";
  // Look for the pattern after data-name with h(buildingName)
  var idx2 = content.indexOf("h(buildingName)");
  if (idx2 >= 0) {
    var rest = content.substring(idx2);
    // Find the end of the data-name tag (should be '>←)
    var endIdx = rest.indexOf('>←');
    if (endIdx >= 0) {
      console.log('Found h(buildingName) at', idx2);
      console.log('Rest up to >←: ' + JSON.stringify(rest.substring(0, endIdx + 5)));
    }
  }
}

fs.writeFileSync('src/app.service.ts', content, 'utf8');
console.log('File written');
