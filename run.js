const fs = require('fs');

console.log('Reading dist file...');
let d = fs.readFileSync('dist/src/app.service.js', 'utf8');

// Helper to extract template literal from compiled JS
function extractTemplate(methodName) {
  let idx = d.indexOf(methodName + '(');
  if (idx < 0) idx = d.indexOf(methodName);
  if (idx < 0) return null;
  
  let retIdx = d.indexOf('return `', idx);
  if (retIdx < 0) return null;
  
  let start = retIdx + 8;
  let depth = 1;
  let pos = start;
  while (depth > 0 && pos < d.length) {
    pos = d.indexOf('`', pos + 1);
    if (pos < 0) break;
    if (pos > 0 && d[pos - 1] !== '\') depth--;
  }
  
  if (pos < 0) return null;
  return d.substring(start, pos);
}

console.log('Extracting templates...');
const land = extractTemplate('getLandingPage');
const login = extractTemplate('getLoginPage');
const signup = extractTemplate('getSignupPage');
const admin = extractTemplate('getAdminLoginPage');
const dash = extractTemplate('getDashboardPage');

console.log('Landing: ' + (land ? land.length : 'FAIL') + ' chars');
console.log('Login: ' + (login ? login.length : 'FAIL') + ' chars');
console.log('Signup: ' + (signup ? signup.length : 'FAIL') + ' chars');
console.log('Admin: ' + (admin ? admin.length : 'FAIL') + ' chars');
console.log('Dashboard: ' + (dash ? dash.length : 'FAIL') + ' chars');

if (!dash) { console.log('FATAL'); process.exit(1); }

// Save extracted templates for use in the next step
let result = JSON.stringify({land: land, login: login, signup: signup, admin: admin, dash: dash});
fs.writeFileSync('templates.json', result, 'utf8');
console.log('Templates saved to templates.json');
