// Test how TypeScript compiles escape sequences in template literals
const x = `showPropertyDetail(\\'' + p.id + '\\',\\'' + h(p.name) + '\\')`;
console.log(JSON.stringify(x));
