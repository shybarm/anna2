# Deployment Guide - ד"ר אנה ברמלי

מדריך פריסה מלא לאתר עבור פלטפורמות אירוח שונות.

## תוכן עניינים
1. [Vercel (מומלץ)](#vercel)
2. [Netlify](#netlify)
3. [Firebase Hosting](#firebase-hosting)
4. [GitHub Pages](#github-pages)
5. [אירוח משותף (Shared Hosting)](#אירוח-משותף)

---

## Vercel (מומלץ) ⚡

### יתרונות
- ✅ אירוח חינמי
- ✅ HTTPS אוטומטי
- ✅ CDN גלובלי
- ✅ פריסה אוטומטית מ-Git
- ✅ דומיין מותאם אישית

### שלבי הפריסה

#### 1. הכנת הקבצים
```bash
# צור תיקיית פרויקט
mkdir dr-anna-brameli-website
cd dr-anna-brameli-website

# העתק את כל הקבצים
```

#### 2. צור Git Repository
```bash
git init
git add .
git commit -m "Initial commit - Dr. Anna Brameli website"

# צור repository ב-GitHub ועלה את הקוד
git remote add origin https://github.com/YOUR-USERNAME/dr-anna-brameli.git
git branch -M main
git push -u origin main
```

#### 3. פריסה ב-Vercel
1. עבור ל-[Vercel](https://vercel.com)
2. לחץ על "Import Project"
3. בחר את ה-repository שיצרת
4. הגדרות:
   - Framework Preset: Other
   - Root Directory: ./
   - Build Command: (השאר ריק)
   - Output Directory: ./
5. לחץ על "Deploy"

#### 4. הגדרת דומיין מותאם
1. ב-Vercel Dashboard, עבור לפרויקט
2. Settings > Domains
3. הוסף את הדומיין שלך: `dr-anna-brameli.co.il`
4. עקוב אחר ההוראות להוספת DNS records

### Environment Variables (Vercel)
Settings > Environment Variables:
```
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_key
```

---

## Netlify 🎯

### שלבי הפריסה

#### 1. הכנת הקבצים
צור קובץ `netlify.toml`:
```toml
[build]
  publish = "."
  
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

#### 2. פריסה דרך Netlify CLI
```bash
# התקן Netlify CLI
npm install -g netlify-cli

# התחבר
netlify login

# אתחל את הפרויקט
netlify init

# פרוס
netlify deploy --prod
```

#### או דרך הממשק:
1. עבור ל-[Netlify](https://netlify.com)
2. לחץ על "Add new site" > "Import an existing project"
3. חבר את ה-Git repository
4. הגדרות:
   - Build command: (ריק)
   - Publish directory: .
5. לחץ על "Deploy site"

### הגדרת דומיין
1. Domain settings > Add custom domain
2. הוסף: `dr-anna-brameli.co.il`
3. עדכן DNS records

---

## Firebase Hosting 🔥

### שלבי הפריסה

#### 1. התקנת Firebase CLI
```bash
npm install -g firebase-tools
```

#### 2. התחברות ואתחול
```bash
# התחבר
firebase login

# אתחל פרויקט
firebase init hosting

# בחר באפשרויות:
# - What do you want to use as your public directory? (.) הקש Enter
# - Configure as a single-page app? Yes
# - Set up automatic builds? No
```

#### 3. פריסה
```bash
firebase deploy
```

### הגדרת דומיין מותאם
```bash
firebase hosting:channel:create live
firebase hosting:channel:deploy live --domain dr-anna-brameli.co.il
```

---

## GitHub Pages 📄

### שלבי הפריסה

#### 1. צור Repository
1. צור repository ציבורי ב-GitHub
2. העלה את הקבצים

#### 2. הפעל GitHub Pages
1. Repository Settings > Pages
2. Source: Deploy from a branch
3. Branch: main
4. Folder: / (root)
5. Save

#### 3. דומיין מותאם
1. צור קובץ `CNAME` עם התוכן:
```
dr-anna-brameli.co.il
```
2. בהגדרות DNS, הוסף CNAME record:
```
CNAME dr-anna-brameli.co.il YOUR-USERNAME.github.io
```

---

## אירוח משותף (Shared Hosting) 🌐

### דרישות מינימליות
- PHP 7.4+ (אופציונלי)
- HTTPS
- .htaccess support

### שלבי הפריסה

#### 1. הכן את הקבצים
העלה את כל הקבצים לתיקיית `public_html`

#### 2. צור קובץ `.htaccess`
```apache
# Enable HTTPS
RewriteEngine On
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]

# Enable compression
<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html text/plain text/xml text/css text/javascript application/javascript
</IfModule>

# Browser caching
<IfModule mod_expires.c>
  ExpiresActive On
  ExpiresByType image/jpg "access plus 1 year"
  ExpiresByType image/jpeg "access plus 1 year"
  ExpiresByType image/gif "access plus 1 year"
  ExpiresByType image/png "access plus 1 year"
  ExpiresByType text/css "access plus 1 month"
  ExpiresByType application/javascript "access plus 1 month"
</IfModule>

# Security headers
<IfModule mod_headers.c>
  Header set X-Content-Type-Options "nosniff"
  Header set X-Frame-Options "SAMEORIGIN"
  Header set X-XSS-Protection "1; mode=block"
</IfModule>
```

#### 3. וודא הרשאות
```bash
chmod 755 -R *
chmod 644 *.html *.css *.js
```

---

## עדכון משתני סביבה

לאחר הפריסה, עדכן את הקוד ב-`index.html`:

```javascript
// החלף עם הערכים האמיתיים שלך
window.SUPABASE_URL = "YOUR_ACTUAL_SUPABASE_URL";
window.SUPABASE_ANON_KEY = "YOUR_ACTUAL_SUPABASE_KEY";
```

ועדכן גם:
```html
<link rel="canonical" href="https://dr-anna-brameli.co.il" />
<meta property="og:url" content="https://dr-anna-brameli.co.il" />
```

---

## אופטימיזציה אחרי הפריסה

### 1. בדוק ביצועים
- [Google PageSpeed Insights](https://pagespeed.web.dev/)
- [GTmetrix](https://gtmetrix.com/)

### 2. בדוק SEO
- [Google Search Console](https://search.google.com/search-console)
- הוסף את sitemap.xml
- בדוק robots.txt

### 3. הגדר Analytics
הוסף Google Analytics:
```html
<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

### 4. בדוק אבטחה
- SSL Certificate (HTTPS)
- Security headers
- CORS configuration

---

## בעיות נפוצות ופתרונות

### בעיה: הקבצים לא נטענים
**פתרון:**
- בדוק נתיבים יחסיים
- וודא שכל הקבצים הועלו
- בדוק הרשאות קבצים

### בעיה: הטופס לא עובד
**פתרון:**
- בדוק את משתני Supabase
- בדוק CORS settings
- בדוק את ה-console לשגיאות

### בעיה: האתר לא מוצג נכון במובייל
**פתרון:**
- בדוק viewport meta tag
- בדוק responsive CSS
- נסה על מכשירים שונים

---

## גיבוי ושחזור

### גיבוי אוטומטי (Vercel)
Vercel שומר את כל ההיסטוריה של הפריסות.

### גיבוי ידני
```bash
# צור גיבוי
tar -czf backup-$(date +%Y%m%d).tar.gz /path/to/website

# שחזר מגיבוי
tar -xzf backup-20241224.tar.gz
```

---

## תמיכה

לבעיות טכניות:
- 📧 Email: support@your-company.com
- 📱 Phone: 050-123-4567

## משאבים נוספים

- [Vercel Documentation](https://vercel.com/docs)
- [Netlify Documentation](https://docs.netlify.com)
- [Firebase Hosting Documentation](https://firebase.google.com/docs/hosting)
- [GitHub Pages Documentation](https://docs.github.com/pages)

---

**הערה:** לאחר הפריסה, וודא שהאתר עובד בכל הדפדפנים המובילים ובמכשירים שונים.
