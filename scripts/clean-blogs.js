const fs = require('fs');
const path = require('path');

const blogDir = path.join(process.cwd(), 'content', 'blog');
const files = fs.readdirSync(blogDir).filter(f => f.endsWith('.md'));

files.forEach(file => {
  const filePath = path.join(blogDir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Remove gravatar images
  content = content.replace(/!\[.*?\]\(https:\/\/secure\.gravatar\.com[^\)]+\)/g, '');
  
  // Remove author section (everything from author heading to comments)
  content = content.replace(/###.*?ফাহিম.*?\n[\s\S]*?### Comments[\s\S]*?comments/g, '');
  content = content.replace(/###.*?Author.*?\n[\s\S]*?### Comments[\s\S]*?comments/g, '');
  
  // Remove standalone author links and social media sections
  content = content.replace(/\[More Posts\][^\n]*\n/g, '');
  content = content.replace(/Follow Me:[\s\S]*?\[!\[Twitter\][^\]]+\][^\n]*\n/g, '');
  
  // Remove any remaining author references
  content = content.replace(/###.*?ফাহিম.*?\n[\s\S]*?(?=\n\n|$)/g, '');
  
  // Remove comments section if still present
  content = content.replace(/### Comments\s*comments?/gi, '');
  
  // Clean up multiple blank lines
  content = content.replace(/\n{3,}/g, '\n\n');
  
  fs.writeFileSync(filePath, content.trim() + '\n', 'utf8');
  console.log(`Cleaned: ${file}`);
});

console.log('Done cleaning blog posts!');

