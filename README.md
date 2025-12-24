# ד"ר אנה ברמלי - אתר מומחית לאלרגיה ואימונולוגיה ילדים

אתר מקצועי ומותאם SEO עבור ד"ר אנה ברמלי, מומחית לאלרגיה ואימונולוגיה ילדים במרכז הרפואי שניידר.

## 🎯 תכונות עיקריות

### אופטימיזציה למנועי חיפוש (SEO)
- ✅ Meta tags מלאים בעברית ובאנגלית
- ✅ Structured Data (JSON-LD) לרופאים ומרפאות
- ✅ Open Graph tags לשיתוף ברשתות חברתיות
- ✅ Sitemap.xml ו-robots.txt
- ✅ תוכן עשיר במילות מפתח רלוונטיות
- ✅ כותרות סמנטיות מובנות היטב
- ✅ תיאורי ALT לתמונות
- ✅ קישורים פנימיים אופטימליים

### עיצוב ונגישות
- 🎨 עיצוב רספונסיבי מלא (Mobile-First)
- 🎨 פלטת צבעים רפואית מקצועית
- 🎨 אנימציות וטרנזישנים חלקים
- ♿ נגישות WCAG 2.1 level AA
- 📱 תמיכה בכל הדפדפנים המודרניים

### פונקציונליות
- 📅 טופס קביעת תור מתקדם
- 💬 צ'אטבוט וירטואלי
- 📁 העלאת קבצים רפואיים
- 📞 אינטגרציה עם Waze ו-Google Maps
- 📧 שליחת הודעות אוטומטיות (עם Supabase)
- 📊 מעקב אנליטיקס (Google Analytics ready)

## 📁 מבנה הקבצים

```
dr-anna-brameli/
├── index.html              # עמוד ראשי
├── style.css              # עיצוב ראשי
├── script.js              # פונקציונליות JavaScript
├── chatbot.js             # צ'אטבוט וירטואלי
├── cleanup.js             # סקריפט עזר
├── robots.txt             # הנחיות לרובוטים של מנועי חיפוש
├── sitemap.xml            # מפת האתר
├── assets/
│   └── doctor-anna.jpg    # תמונת הרופאה
└── README.md              # מסמך זה
```

## 🚀 התקנה והפעלה

### דרישות מקדימות
- שרת אירוח (או שירות כמו Vercel, Netlify, Firebase)
- (אופציונלי) חשבון Supabase לניהול נתונים

### התקנה בסיסית

1. העלה את כל הקבצים לשרת האירוח שלך
2. וודא שהקובץ `index.html` נמצא בתיקיית השורש
3. עדכן את כתובת ה-URL הקנונית ב-`index.html`:
   ```html
   <link rel="canonical" href="https://YOUR-DOMAIN.co.il" />
   ```

### התקנת Supabase (אופציונלי)

1. צור פרויקט ב-[Supabase](https://supabase.com)
2. צור טבלה `appointments`:
   ```sql
   CREATE TABLE appointments (
     id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
     child_first_name TEXT NOT NULL,
     last_name TEXT NOT NULL,
     birth_date DATE NOT NULL,
     age TEXT NOT NULL,
     parent_name TEXT NOT NULL,
     phone TEXT NOT NULL,
     email TEXT,
     health_fund TEXT NOT NULL,
     reason TEXT NOT NULL,
     symptoms TEXT,
     preferred_date DATE,
     preferred_time TEXT,
     files TEXT[],
     status TEXT DEFAULT 'pending',
     source TEXT DEFAULT 'website',
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );
   ```

3. עדכן את פרטי ההתחברות ב-`index.html`:
   ```javascript
   window.SUPABASE_URL = "YOUR_SUPABASE_URL";
   window.SUPABASE_ANON_KEY = "YOUR_SUPABASE_ANON_KEY";
   ```

## 🔧 התאמה אישית

### שינוי צבעים
ערוך את משתני ה-CSS ב-`style.css`:
```css
:root {
  --primary-color: #0066cc;
  --secondary-color: #00a651;
  --accent-color: #ff6b35;
}
```

### שינוי תוכן
כל התוכן נמצא ב-`index.html` וניתן לעריכה קלה:
- כותרות וטקסטים
- שירותים
- מחלות מטופלות
- שאלות נפוצות

### הוספת Google Analytics
הוסף את קוד המעקב ב-`<head>`:
```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=YOUR-GA-ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'YOUR-GA-ID');
</script>
```

## 📱 תכונות נוספות

### צ'אטבוט
הצ'אטבוט מופעל אוטומטית ויכול לענות על:
- שאלות כלליות
- קביעת תור
- פרטי שירותים
- מיקום המרפאה
- יצירת קשר

להשבתת הצ'אטבוט, ערוך את `chatbot.js`:
```javascript
const CHATBOT_CONFIG = {
  enabled: false  // שנה ל-false
};
```

### העלאת קבצים
המערכת תומכת בהעלאת:
- תמונות (JPG, PNG)
- מסמכי PDF
- מסמכי Word (DOC, DOCX)

## 🎨 עיצוב רספונסיבי

האתר מותאם באופן מלא למכשירים:
- 📱 מובייל (עד 480px)
- 📱 טאבלט (481px - 968px)
- 💻 דסקטופ (969px ומעלה)

## 🔒 אבטחה

- ✅ HTTPS מומלץ
- ✅ הגנה מפני XSS
- ✅ אימות קלטים בצד לקוח
- ✅ הגבלת גודל קבצים

## 📊 ביצועים

האתר מותאם לביצועים:
- ⚡ טעינה מהירה
- ⚡ אופטימיזציית תמונות
- ⚡ Lazy loading
- ⚡ CSS מינימלי
- ⚡ JavaScript יעיל

## 🌐 תאימות דפדפנים

- ✅ Chrome (אחרון)
- ✅ Firefox (אחרון)
- ✅ Safari (אחרון)
- ✅ Edge (אחרון)
- ✅ Chrome Mobile
- ✅ Safari Mobile

## 📧 תמיכה

לשאלות נוספות או תמיכה טכנית:
- 📞 טלפון: 054-580-8008
- 📧 דוא"ל: info@dr-anna-brameli.co.il

## 📄 רישיון

כל הזכויות שמורות © 2024 ד"ר אנה ברמלי

---

**פותח עם ❤️ לקידום הבריאות של ילדי ישראל**
