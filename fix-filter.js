var fs = require('fs');
var path = 'src/app.service.ts';
var content = fs.readFileSync(path, 'utf8');

// Fix unitFilter data-prop-id
// Find 'data-prop-id="' and look for the leftover after the concatenation
var searchStr = 'data-prop-id="';
var idx = content.indexOf(searchStr);
if (idx >= 0) {
  // Find the anchor: + propId + 
  var afterPropId = content.indexOf('+ propId + ', idx + searchStr.length);
  if (afterPropId >= 0) {
    var before = content.substring(0, idx);
    var after = content.substring(idx);
    // Find the '"><option' or similar that should close the data-prop-id
    var gtIdx = after.indexOf('><option');
    if (gtIdx >= 0) {
      var replacement = 'data-prop-id="\' + propId + \'">';
      content = before + replacement + after.substring(gtIdx);
      fs.writeFileSync(path, content, 'utf8');
      console.log('Fix applied');
      console.log('Replaced from idx ' + idx + ' to ' + (idx + gtIdx));
    }
  }
}
