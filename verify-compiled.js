var fs = require('fs');
var d = fs.readFileSync('dist/src/app.service.js', 'utf8');
var gdp = d.indexOf('getDashboardPage()');
var si = d.indexOf('<script>', gdp);
var ei = d.indexOf('</script>', si + 10);
var js = d.substring(si + 8, ei);
fs.writeFileSync('dash_check.js', js, 'utf8');
console.log('Written:', js.length, 'bytes');
try {
  new Function(js);
  console.log('DASHBOARD JS: VALID');
} catch(e) {
  console.log('ERROR:', e.message.substring(0, 100));
}
