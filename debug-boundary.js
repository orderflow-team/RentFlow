var fs = require('fs');
var content = fs.readFileSync('src/app.service.ts', 'utf8');
var lines = content.split('\n');

for (var i = 0; i < lines.length; i++) {
  var line = lines[i];
  if (!line.includes('showPropertyDetail') && !line.includes('showBuildingDetail') && !line.includes('openBuildingModal') && !line.includes('openUnitModal') && !line.includes('showTenantDetail')) continue;
  if (line.includes('addEventListener') || line.includes('getAttribute') || line.includes('function ')) continue;
  
  // Check if the onclick=\" search works
  var idx = line.indexOf('onclick=\\"');
  console.log('LINE ' + (i+1) + ': has onclick=\\":', idx);
  
  // If onclick=\" not found, search for the text around the function call
  var fnIdx = line.indexOf('showPropertyDetail');
  if (fnIdx < 0) fnIdx = line.indexOf('showBuildingDetail');
  if (fnIdx < 0) fnIdx = line.indexOf('openBuildingModal');
  if (fnIdx < 0) fnIdx = line.indexOf('openUnitModal');
  if (fnIdx < 0) fnIdx = line.indexOf('showTenantDetail');
  
  if (fnIdx >= 0) {
    // Show 40 chars before the function name
    var before = line.substring(Math.max(0, fnIdx - 40), fnIdx);
    console.log('  40 chars before function:', JSON.stringify(before));
    
    // Check for lastIndexOf onclick=\"
    var loi = line.lastIndexOf('onclick=\\"', fnIdx);
    console.log('  lastIndexOf onclick=\\":', loi);
    
    // Check for lastIndexOf onchange=\"
    var loci = line.lastIndexOf('onchange=\\"', fnIdx);
    console.log('  lastIndexOf onchange=\\":', loci);
    
    // Show char codes around the function
    var snippet = line.substring(Math.max(0, fnIdx - 30), Math.min(line.length, fnIdx + 80));
    console.log('  Snippet:', JSON.stringify(snippet));
    
    // Find )\" pattern
    var searchFn = line.indexOf('showPropertyDetail', fnIdx);
    if (searchFn < 0) searchFn = line.indexOf('showBuildingDetail', fnIdx);
    if (searchFn < 0) searchFn = line.indexOf('openBuildingModal', fnIdx);
    if (searchFn < 0) searchFn = line.indexOf('openUnitModal', fnIdx);
    if (searchFn < 0) searchFn = line.indexOf('showTenantDetail', fnIdx);
    
    if (searchFn >= 0) {
      var fnEnd = searchFn + 20;
      var endIdx = line.indexOf(')', fnEnd);
      var attempts = 0;
      while (endIdx >= 0 && endIdx < fnEnd + 200 && attempts < 10) {
        attempts++;
        var ch1 = line.charAt(endIdx + 1);
        var ch2 = line.charAt(endIdx + 2);
        var ch1Code = endIdx + 1 < line.length ? line.charCodeAt(endIdx + 1) : -1;
        var ch2Code = endIdx + 2 < line.length ? line.charCodeAt(endIdx + 2) : -1;
        if (ch1Code === 92 && ch2Code === 34) {
          console.log('  FOUND )\\" at:', endIdx, 'with chars:', JSON.stringify(ch1), JSON.stringify(ch2), 'codes:', ch1Code, ch2Code);
          console.log('  Full onclick:', JSON.stringify(line.substring(loi >= 0 ? loi : loci, endIdx + 3)));
          break;
        }
        endIdx = line.indexOf(')', endIdx + 1);
      }
      if (attempts >= 10 || endIdx < 0) {
        console.log('  DID NOT FIND )\\" boundary');
        // Show characters around the parentheses
        var pIdx = line.indexOf(')', fnEnd);
        if (pIdx >= 0) {
          console.log('  First ) at:', pIdx, 'next 5 codes:', 
            line.charCodeAt(pIdx+1), line.charCodeAt(pIdx+2), 
            line.charCodeAt(pIdx+3), line.charCodeAt(pIdx+4), line.charCodeAt(pIdx+5));
        }
      }
    }
  }
}
