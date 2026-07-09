const fs = require('fs');
const { execSync } = require('child_process');

const envContent = fs.readFileSync('.env', 'utf-8');
const lines = envContent.split(/\r?\n/);

for (const line of lines) {
  if (line.trim() && !line.trim().startsWith('#')) {
    const splitIndex = line.indexOf('=');
    if (splitIndex > 0) {
      const key = line.substring(0, splitIndex).trim();
      const value = line.substring(splitIndex + 1).trim();
      
      console.log(`Setting environment variable: ${key}`);
      
      try {
        // Try to remove it first just in case it already exists
        execSync(`npx vercel env rm ${key} production --yes`, { stdio: 'ignore' });
      } catch (e) {
        // Ignore error if it didn't exist
      }
      
      try {
        execSync(`npx vercel env add ${key} production`, {
          input: value,
          stdio: ['pipe', 'inherit', 'inherit']
        });
        console.log(`Successfully added ${key}`);
      } catch (e) {
        console.error(`Failed to add ${key}`);
      }
    }
  }
}

console.log('Finished pushing environment variables!');
