var fs = require('fs');
var path = 'src/app.service.ts';
var content = fs.readFileSync(path, 'utf8');

// Fix 1: Line 2029 - add-building button merged with unitFilter options
// Current: ...data-prop-id="' + propId + '">><option value="">All status...
// Should:  ...data-prop-id="' + propId + '">+ Add Building</button></div>' : '') + NEW_STUFF_HERE + '<select id="unitFilter"...>
// But the BIG problem is that the showBuildingDetail setContent was DELETED
// What we need is to RESTORE the missing template text

// Step 1: Fix the immediate corruption on line 2029
// Replace the corrupted fragment with the correct add-building button
var corrupted1 = '">><option value="">All status</option><option value="VACANT">Vacant</option><option value="OCCUPIED">Occupied</option><option value="MAINTENANCE">Maintenance</option></select>';
var fixed1 = '">+ Add Building</button></div>\' : \'\') +';
if (content.indexOf(corrupted1) >= 0) {
  content = content.split(corrupted1).join(fixed1);
  console.log('Fix 1 applied');
} else {
  console.log('Fix 1 NOT found');
}

// Now we need to restore the showBuildingDetail template
// The original template (with proper escaping for template literal) should be:
// Back to buildings link + header + add-unit button + filter bar + building units div
// Let me check what lines follow the fix we just made

fs.writeFileSync(path, content, 'utf8');
console.log('File saved');
console.log('Done');
