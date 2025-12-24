# ד"ר אנה ברמלי - מערכת ניהול מרפאה מלאה

אתר מקצועי עם מערכת CRM מלאה לניהול מרפאת אלרגיה ואימונולוגיה ילדים.

## 🎯 תכונות המערכת

### 🌐 אתר פונה לקוח
- עיצוב רפואי מקצועי ונקי
- אופטימיזציה מלאה ל-SEO
- רספונסיבי לכל המכשירים
- טופס קביעת תור עם העלאת קבצים
- צ'אטבוט וירטואלי
- אינטגרציה Waze + Google Maps

### 👨‍⚕️ פאנל ניהול (Admin)
- **ניהול מטופלים**: הוספה, עריכה, מחיקה, פרופיל מלא
- **ניהול תורים**: מעקב בקשות, עדכון סטטוסים
- **קבצים רפואיים**: העלאה, צפייה, ניהול מסמכים
- **הגדרות**: התאמה אישית של המערכת

## 🚀 התקנה מהירה

### 1. הגדרת Supabase

יצירת הטבלאות:
```sql
-- מטופלים
CREATE TABLE patients (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  date_of_birth DATE,
  phone TEXT,
  email TEXT,
  health_fund TEXT,
  allergies TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- תורים  
CREATE TABLE appointments (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  patient_id UUID REFERENCES patients(id),
  appointment_date DATE NOT NULL,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 2. עדכון Credentials

עדכן ב-`supabase-client.js`:
```javascript
const SUPABASE_URL = 'YOUR_URL';
const SUPABASE_ANON_KEY = 'YOUR_KEY';
```

### 3. פריסה

**Vercel (מומלץ):**
```bash
vercel
```

**Netlify:**
```bash
netlify deploy --prod
```

## 📂 מבנה הקבצים

```
├── index.html          # עמוד ראשי
├── admin.html          # ממשק ניהול
├── patients.html       # רשימת מטופלים
├── patient.html        # פרופיל מטופל
├── settings.html       # הגדרות
├── style.css           # עיצוב
├── admin.js            # לוגיקת ניהול
└── supabase-client.js  # חיבור DB
```

## 🔐 כניסה לאדמין

URL: `https://your-domain.com/admin.html`

צור משתמש ב-Supabase Authentication

## 💡 שימוש יומיומי

### הוספת מטופל
1. Admin → מטופלים → הוסף חדש
2. מלא פרטים → שמור

### ניהול תור
1. בקשות חדשות מופיעות באדמין
2. לחץ לעריכה → עדכן סטטוס

### העלאת קובץ
1. פרופיל מטופל → קבצים
2. בחר קובץ → העלה

## 🎨 התאמה אישית

צבעים ב-`style.css`:
```css
:root {
  --primary: #0066cc;
  --secondary: #00a651;
}
```

## 🔒 אבטחה

- ✅ HTTPS חובה
- ✅ Row Level Security
- ✅ גיבויים שבועיים
- ✅ סיסמאות חזקות

## 📞 תמיכה

Email: info@dr-anna-brameli.co.il  
Phone: 054-580-8008

---

© 2024 ד"ר אנה ברמלי | כל הזכויות שמורות
