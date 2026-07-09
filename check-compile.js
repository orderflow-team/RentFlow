var fs = require('fs');
var d = fs.readFileSync('/tmp/tsc-test/test-compile.js', 'utf8');
console.log('Compiled JS:', JSON.stringify(d));

// Now run the JS
var vm = require('vm');
try {
  var script = new vm.Script(d);
  var ctx = vm.createContext({ p: { id: '123' }, h: function(s) { return String(s); } });
  script.runInContext(ctx);
} catch(e) {
  console.log('Runtime error:', e.message);
}
