const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');
const { URL } = require('url');
const TurndownService = require('turndown');

const turndownService = new TurndownService({
  headingStyle: 'atx',
  codeBlockStyle: 'fenced',
});

// Blog post URLs from the live site
const blogUrls = [
  {
    url: 'https://shoumik.me/2018/08/28/%e0%a6%ae%e0%a6%be%e0%a6%87%e0%a6%95%e0%a7%8d%e0%a6%b0%e0%a7%8b%e0%a6%b8%e0%a6%be%e0%a6%b0%e0%a7%8d%e0%a6%ad%e0%a6%bf%e0%a6%b8-%e0%a6%95%e0%a7%87%e0%a6%a8-%e0%a6%95%e0%a6%96%e0%a6%a8-%e0%a6%95/',
    slug: 'microservices-ken-kokhon-kibhabe-part-2',
    date: '2018-08-28',
  },
  {
    url: 'https://shoumik.me/2018/02/22/continuous-integration-of-golang-with-gitlab-pipeline-%e0%a6%aa%e0%a6%b0%e0%a7%8d%e0%a6%ac-%e0%a7%a7/',
    slug: 'continuous-integration-of-golang-with-gitlab-pipeline-part-1',
    date: '2018-02-22',
  },
  {
    url: 'https://shoumik.me/2018/02/03/nosql-%e0%a6%a1%e0%a6%be%e0%a6%9f%e0%a6%be%e0%a6%ac%e0%a7%87%e0%a6%b8-%e0%a6%aa%e0%a6%b0%e0%a7%8d%e0%a6%ac-%e0%a7%a7/',
    slug: 'nosql-database-part-1',
    date: '2018-02-03',
  },
  {
    url: 'https://shoumik.me/2017/07/03/%e0%a6%93%e0%a7%9f%e0%a7%87%e0%a6%ac-%e0%a6%a1%e0%a7%87%e0%a6%ad%e0%a7%87%e0%a6%b2%e0%a6%aa%e0%a6%ae%e0%a7%87%e0%a6%a8%e0%a7%8d%e0%a6%9f%e0%a7%87%e0%a6%b0-%e0%a6%9c%e0%a6%a8%e0%a7%8d%e0%a6%af/',
    slug: 'web-development-docker-php-oracle-part-2-1',
    date: '2017-07-03',
  },
  {
    url: 'https://shoumik.me/2017/06/25/%e0%a6%ae%e0%a6%be%e0%a6%87%e0%a6%95%e0%a7%8d%e0%a6%b0%e0%a7%8b%e0%a6%b8%e0%a6%be%e0%a6%b0%e0%a7%8d%e0%a6%ad%e0%a6%bf%e0%a6%b8-%e0%a6%86%e0%a6%b0%e0%a7%8d%e0%a6%95%e0%a6%bf%e0%a6%9f%e0%a7%87%e0%a6%95/',
    slug: 'microservices-architecture-part-1',
    date: '2017-06-25',
  },
  {
    url: 'https://shoumik.me/2017/04/04/%e0%a6%a1%e0%a6%95%e0%a6%be%e0%a6%b0-%e0%a6%95%e0%a6%bf/',
    slug: 'docker-ki-part-1',
    date: '2017-04-04',
  },
];

function downloadFile(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    const protocol = url.startsWith('https') ? https : http;
    
    protocol.get(url, (response) => {
      if (response.statusCode === 301 || response.statusCode === 302) {
        file.close();
        fs.unlinkSync(dest);
        return downloadFile(response.headers.location, dest).then(resolve).catch(reject);
      }
      
      if (response.statusCode !== 200) {
        file.close();
        fs.unlinkSync(dest);
        return reject(new Error(`Failed to download: ${response.statusCode}`));
      }
      
      response.pipe(file);
      file.on('finish', () => {
        file.close();
        resolve();
      });
    }).on('error', (err) => {
      if (fs.existsSync(dest)) {
        fs.unlinkSync(dest);
      }
      reject(err);
    });
  });
}

async function scrapeBlogPost(browser, blogInfo) {
  const page = await browser.newPage();
  try {
    console.log(`Scraping: ${blogInfo.url}`);
    await page.goto(blogInfo.url, { waitUntil: 'networkidle' });
    
    // Extract title
    const title = await page.locator('h1').first().textContent() || 
                  await page.title() || 
                  'Untitled';
    
    // Extract date
    const dateText = await page.locator('time').first().textContent().catch(() => null) ||
                     blogInfo.date;
    
    // Extract article content - get only the main content, exclude author bio and comments
    const articleContent = await page.evaluate(() => {
      const article = document.querySelector('article');
      if (!article) return '';
      
      // Clone the article to avoid modifying the original
      const clone = article.cloneNode(true);
      
      // Remove unwanted sections
      const unwantedSelectors = [
        '.author-bio', '.post-author', '.author-info',
        '.comments', '#comments', '.comment-section',
        '.post-tags', '.tags', '.entry-tags',
        'h3:contains("Comments")', 'h3:contains("Leave a Reply")'
      ];
      
      unwantedSelectors.forEach(selector => {
        const elements = clone.querySelectorAll(selector);
        elements.forEach(el => el.remove());
      });
      
      // Remove author heading and bio
      const headings = clone.querySelectorAll('h3');
      headings.forEach(h3 => {
        const text = h3.textContent || '';
        if (text.includes('ফাহিম') || text.includes('Comments') || text.includes('Leave') || text.includes('Author')) {
          let next = h3.nextElementSibling;
          while (next && next.tagName !== 'H3' && next.tagName !== 'H2') {
            const toRemove = next;
            next = next.nextElementSibling;
            toRemove.remove();
          }
          h3.remove();
        }
      });
      
      // Remove any remaining author/social links
      const authorLinks = clone.querySelectorAll('a[href*="author"], a[href*="twitter.com"], a[href*="facebook.com"], a[href*="linkedin.com"]');
      authorLinks.forEach(link => {
        const parent = link.parentElement;
        if (parent && (parent.tagName === 'P' || parent.tagName === 'DIV')) {
          const text = parent.textContent || '';
          if (text.includes('Follow') || text.includes('More Posts')) {
            parent.remove();
          }
        }
      });
      
      // Remove gravatar images
      const gravatars = clone.querySelectorAll('img[src*="gravatar"]');
      gravatars.forEach(img => {
        const parent = img.parentElement;
        if (parent) parent.remove();
      });
      
      return clone.innerHTML;
    }).catch(() => {
      // Fallback to simple extraction
      return page.locator('article').first().innerHTML().catch(() => null) ||
             page.locator('.entry-content').first().innerHTML().catch(() => null) ||
             '';
    });
    
    // Extract all images from the article
    const images = await page.locator('article img').all();
    const imageUrls = [];
    for (const img of images) {
      let src = await img.getAttribute('src').catch(() => null);
      if (src) {
        // Fix relative URLs
        if (src.startsWith('//')) {
          src = 'https:' + src;
        } else if (src.startsWith('/')) {
          src = 'https://shoumik.me' + src;
        }
        if (src.startsWith('http') && !src.includes('avatar') && !src.includes('logo') && !src.includes('icon') && !src.includes('gravatar')) {
          imageUrls.push(src);
        }
      }
    }
    
    // Convert HTML to markdown
    let markdown = `# ${title.trim()}\n\n`;
    
    // Process images and download them
    const imageMap = {};
    for (let i = 0; i < imageUrls.length; i++) {
      const imgUrl = imageUrls[i];
      const urlObj = new URL(imgUrl);
      const ext = path.extname(urlObj.pathname) || '.jpg';
      const filename = `${blogInfo.slug}-image-${i + 1}${ext}`;
      imageMap[imgUrl] = filename;
      
      // Download image
      try {
        const imagePath = path.join(process.cwd(), 'public', 'blog', filename);
        await downloadFile(imgUrl, imagePath);
        console.log(`  Downloaded: ${filename}`);
      } catch (err) {
        console.error(`  Failed to download ${imgUrl}:`, err.message);
      }
    }
    
    // Replace image URLs in HTML with local paths
    let processedHTML = articleContent;
    for (const [originalUrl, filename] of Object.entries(imageMap)) {
      processedHTML = processedHTML.replace(new RegExp(originalUrl.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), `/blog/${filename}`);
    }
    
    // Convert to markdown
    const markdownContent = turndownService.turndown(processedHTML);
    markdown += markdownContent;
    
    return { markdown, title: title.trim(), date: dateText };
    
  } catch (error) {
    console.error(`Error scraping ${blogInfo.url}:`, error.message);
    return null;
  } finally {
    await page.close();
  }
}

async function main() {
  const blogDir = path.join(process.cwd(), 'src', 'app', 'blog', 'content');
  const imageDir = path.join(process.cwd(), 'public', 'blog');
  
  fs.mkdirSync(blogDir, { recursive: true });
  fs.mkdirSync(imageDir, { recursive: true });
  
  const browser = await chromium.launch({ headless: true });
  
  try {
    for (const blogInfo of blogUrls) {
      const result = await scrapeBlogPost(browser, blogInfo);
      if (result) {
        const mdPath = path.join(blogDir, `${blogInfo.slug}.md`);
        fs.writeFileSync(mdPath, result.markdown, 'utf8');
        console.log(`Saved: ${blogInfo.slug}.md\n`);
      }
    }
  } finally {
    await browser.close();
  }
  
  console.log('Done!');
}

main().catch(console.error);
