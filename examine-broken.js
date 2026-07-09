var fs = require('fs');
var path = 'src/app.service.ts';
var content = fs.readFileSync(path, 'utf8');

// Position 95805: Back to buildings link
console.log('=== Position 95805 (back-link template) ===');
var snip1 = content.substring(95800, 95980);
console.log(JSON.stringify(snip1));

// Position 96099: add-unit in template
console.log('\n=== Position 96099 (add-unit template) ===');
var snip2 = content.substring(96080, 96250);
console.log(JSON.stringify(snip2));

// Find unitFilter in template (not in CSS or event delegation)
var uf = content.indexOf('unitFilter');
while (uf >= 0) {
  var before = content.substring(Math.max(0, uf - 5), uf);
  if (before.indexOf('"') >= 0 || before.indexOf("'") >= 0) {
    // This is in a string
    console.log('\n=== unitFilter in template at ' + uf + ' ===');
    var snip3 = content.substring(uf - 50, uf + 200);
    console.log(JSON.stringify(snip3));
    break;
  }
  uf = content.indexOf('unitFilter', uf + 1);
}

// Find edit-unit button template 
var editUnit = content.indexOf('edit-unit');
while (editUnit >= 0) {
  var after = content.substring(editUnit, editUnit + 30);
  if (after.indexOf('data-desc') >= 0) {
    console.log('\n=== edit-unit with data-desc at ' + editUnit + ' ===');
    var lineStart = content.lastIndexOf('\n', editUnit);
    var lineEnd = content.indexOf('\n', editUnit);
    console.log(JSON.stringify(content.substring(lineStart + 1, lineEnd)));
    break;
  }
  editUnit = content.indexOf('edit-unit', editUnit + 1);
}
