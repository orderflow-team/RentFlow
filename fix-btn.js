var fs = require('fs');
var p = 'src/app.service.ts';
var c = fs.readFileSync(p, 'utf8');

// Find the broken add-unit button pattern
// Search for the unique marker
var idx = c.indexOf('data-action="add-unit" data-building-id="');
if (idx >= 0) {
  // Find the context: isStaff ? '<div class="btn-row">...</div>' : '') +
  var ctxStart = c.lastIndexOf("isStaff ? '", idx);
  var ctxEnd = c.indexOf("' : '') +", idx);
  if (ctxStart >= 0 && ctxEnd >= 0) {
    var fullExpr = c.substring(ctxStart, ctxEnd + 10);
    console.log('Found expression: ' + JSON.stringify(fullExpr.substring(0, 200)));
    
    // Build the replacement
    // Old: <data-action="add-unit" data-building-id="' + buildingId + '"penUnitModal(\' + buildingId + '\')">
    // New: <button class="btn btn-primary btn-sm" data-action="add-unit" data-building-id="' + buildingId + '">
    
    // Find the exact broken fragment
    var fragStart = fullExpr.indexOf('<data-action="add-unit"');
    if (fragStart >= 0) {
      var fragEnd = fullExpr.indexOf('">+ Add Unit', fragStart);
      if (fragEnd >= 0) {
        var oldFrag = fullExpr.substring(fragStart, fragEnd + 2);
        var newFrag = '<button class="btn btn-primary btn-sm" data-action="add-unit" data-building-id="\' + buildingId + \'">';
        
        var newExpr = fullExpr.split(oldFrag).join(newFrag);
        c = c.split(fullExpr).join(newExpr);
        
        fs.writeFileSync(p, c, 'utf8');
        console.log('Fix applied!');
        console.log('Old: ' + JSON.stringify(oldFrag));
        console.log('New: ' + JSON.stringify(newFrag));
      }
    }
  }
}
