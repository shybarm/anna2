# ד"ר אנה ברמלי - מערכת ניהול מרפאה מלאה

## 📦 מה כלול בחבילה?

### 🌐 אתר פונה לקוח (Frontend)
- **index.html** - עמוד ראשי עם כל התוכן
- **style.css** - עיצוב ראשי
- **theme-doctreat.css** - ערכת נושא רפואית
- **script.js** - פונקציונליות אתר
- **chatbot.js** - צ'אטבוט וירטואלי
- **assets/** - תמונות (doctor-anna.jpg, hero.jpg)

### 👨‍⚕️ מערכת ניהול (Admin Panel)
- **admin.html** - פאנל ניהול ראשי
- **patients.html** - רשימת מטופלים
- **patient.html** - פרופיל מטופל
- **settings.html** - הגדרות מערכת
- **admin.js** - לוגיקת ניהול
- **patients.js** - ניהול מטופלים
- **patient.js** - עריכת פרופיל
- **settings.js** - הגדרות

### 🔧 תשתית
- **supabase-client.js** - חיבור לבסיס נתונים
- **supabase/functions/** - Edge Functions
- **robots.txt** + **sitemap.xml** - SEO

## 🚀 התקנה - 3 שלבים פשוטים

### שלב 1: הגדרת Supabase (5 דקות)

1. צור חשבון ב-[Supabase](https://supabase.com)
2. צור פרויקט חדש
3. עבור ל-SQL Editor והרץ:

```sql
-- טבלת מטופלים
CREATE TABLE patients (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  date_of_birth DATE,
  phone TEXT,
  email TEXT,
  address TEXT,
  health_fund TEXT CHECK (health_fund IN ('clalit', 'maccabi', 'meuhedet', 'leumit')),
  allergies TEXT[],
  medications TEXT[],
  medical_history TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- טבלת תורים
CREATE TABLE appointments (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
  child_first_name TEXT,
  child_last_name TEXT,
  child_birth_date DATE,
  parent_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  health_fund TEXT,
  reason TEXT,
  symptoms TEXT,
  preferred_date DATE,
  preferred_time TEXT,
  appointment_date TIMESTAMP WITH TIME ZONE,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- טבלת קבצים רפואיים
CREATE TABLE medical_files (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_type TEXT,
  file_size INTEGER,
  uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  uploaded_by UUID
);

-- אינדקסים לביצועים
CREATE INDEX idx_patients_name ON patients(last_name, first_name);
CREATE INDEX idx_patients_phone ON patients(phone);
CREATE INDEX idx_appointments_date ON appointments(appointment_date);
CREATE INDEX idx_appointments_status ON appointments(status);
CREATE INDEX idx_appointments_patient ON appointments(patient_id);
CREATE INDEX idx_medical_files_patient ON medical_files(patient_id);

-- Trigger לעדכון updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_patients_updated_at BEFORE UPDATE ON patients
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_appointments_updated_at BEFORE UPDATE ON appointments
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

4. צור Storage Bucket:
   - עבור ל-Storage
   - לחץ "Create Bucket"
   - שם: `medical-files`
   - Public: לא
   - לחץ Create

5. הגדר Storage Policies:
```sql
-- Policy לקריאת קבצים (למשתמשים מאומתים בלבד)
CREATE POLICY "Authenticated users can read files"
ON storage.objects FOR SELECT
USING (auth.role() = 'authenticated');

-- Policy להעלאת קבצים
CREATE POLICY "Authenticated users can upload files"
ON storage.objects FOR INSERT
WITH CHECK (auth.role() = 'authenticated');

-- Policy למחיקת קבצים
CREATE POLICY "Authenticated users can delete files"
ON storage.objects FOR DELETE
USING (auth.role() = 'authenticated');
```

### שלב 2: עדכון Credentials

עדכן את הקובץ **supabase-client.js**:

```javascript
const SUPABASE_URL = 'YOUR_PROJECT_URL'; // מ-Settings -> API
const SUPABASE_ANON_KEY = 'YOUR_ANON_KEY'; // מ-Settings -> API
```

### שלב 3: פריסה

#### אופציה א' - Vercel (מומלץ, חינם)

```bash
# התקן Vercel CLI
npm install -g vercel

# התחבר
vercel login

# פרוס את כל התיקייה
vercel --prod
```

#### אופציה ב' - Netlify (חינם)

```bash
# התקן Netlify CLI
npm install -g netlify-cli

# התחבר
netlify login

# פרוס
netlify deploy --prod --dir .
```

#### אופציה ג' - אירוח משותף

1. העלה את **כל הקבצים** ל-`public_html`
2. וודא ש-`.htaccess` מוגדר נכון
3. וודא SSL (HTTPS) מופעל

## 🔐 כניסה למערכת

### יצירת משתמש Admin

1. עבור ל-Supabase Dashboard
2. לחץ על Authentication -> Users
3. לחץ "Add User"
4. מלא:
   - Email: `admin@dr-anna-brameli.co.il`
   - Password: (סיסמה חזקה)
   - Confirm Email: כן

### כניסה לפאנל הניהול

1. גש ל-`https://your-domain.com/admin.html`
2. התחבר עם האימייל והסיסמה
3. **חשוב:** שנה את הסיסמה בכניסה הראשונה!

## 📚 מדריך שימוש

### הוספת מטופל חדש

1. כנס לפאנל ניהול
2. לחץ "מטופלים" בתפריט
3. לחץ "הוסף מטופל חדש"
4. מלא את הפרטים:
   - שם פרטי + משפחה
   - תאריך לידה
   - טלפון + אימייל
   - קופת חולים
   - אלרגיות ידועות
   - תרופות נוכחיות
5. לחץ "שמור"

### ניהול תורים

#### תורים חדשים
- בקשות תור חדשות מופיעות אוטומטית בדף הבית של האדמין
- סטטוס: "ממתין לאישור"

#### אישור תור
1. לחץ על התור
2. בדוק פרטים
3. שנה סטטוס ל-"אושר"
4. הוסף תאריך ושעה סופיים
5. הוסף הערות (אם צריך)
6. לחץ "שמור"

#### ביטול תור
1. פתח את התור
2. שנה סטטוס ל-"בוטל"
3. הוסף סיבה בהערות
4. שמור

### העלאת קבצים רפואיים

1. היכנס לפרופיל המטופל
2. גלול ל-"קבצים רפואיים"
3. לחץ "העלה קובץ"
4. בחר קובץ (PDF, JPG, PNG, DOCX)
5. הקובץ יישמר אוטומטית ב-Supabase Storage

### חיפוש מטופל

- השתמש בשדה החיפוש בראש הדף
- ניתן לחפש לפי: שם, טלפון, קופת חולים
- התוצאות מסתננות בזמן אמת

## 🎨 התאמה אישית

### שינוי צבעים

ערוך את **style.css**:

```css
:root {
  --primary: #0066cc;      /* כחול ראשי */
  --secondary: #00a651;    /* ירוק משני */
  --accent: #ff6b35;       /* כתום הדגשה */
  --text-primary: #1a1a1a; /* טקסט ראשי */
  --text-secondary: #666;  /* טקסט משני */
}
```

### שינוי לוגו

החלף את התמונה:
```
assets/doctor-anna.jpg
```

### עדכון טקסטים

ערוך את **index.html** - כל הטקסטים שם

## 🔧 פתרון בעיות

### הטופס לא שולח

1. פתח Console בדפדפן (F12)
2. בדוק שגיאות
3. וודא Supabase credentials נכונים
4. בדוק CORS settings ב-Supabase

### לא מצליח להיכנס לאדמין

1. וודא שהמשתמש נוצר ב-Authentication
2. בדוק שה-Email מאושר
3. נסה לאפס סיסמה
4. נקה Cache ונסה שוב

### קבצים לא מועלים

1. וודא Storage Bucket קיים (`medical-files`)
2. בדוק Storage Policies
3. וודא גודל קובץ < 5MB
4. בדוק פורמט קובץ (PDF, JPG, PNG, DOCX)

### דף לא נטען נכון

1. וודא כל הקבצים הועלו
2. בדוק שהתיקייה `assets` קיימת
3. בדוק `supabase-client.js` מוגדר
4. נקה Cache הדפדפן

## 📊 מבנה הקבצים

```
dr-anna-brameli/
│
├── index.html              # 🏠 עמוד ראשי
├── admin.html              # 👨‍⚕️ פאנל ניהול
├── patients.html           # 📋 רשימת מטופלים
├── patient.html            # 👤 פרופיל מטופל
├── settings.html           # ⚙️ הגדרות
│
├── style.css               # 🎨 עיצוב ראשי
├── theme-doctreat.css      # 🏥 ערכת נושא רפואית
├── admin.css               # 💼 עיצוב אדמין
│
├── script.js               # ⚡ פונקציונליות אתר
├── admin.js                # 🔧 לוגיקת ניהול
├── patients.js             # 📝 ניהול מטופלים
├── patient.js              # 👤 עריכת פרופיל
├── settings.js             # ⚙️ הגדרות
├── chatbot.js              # 💬 צ'אטבוט
├── cleanup.js              # 🧹 ניקוי
│
├── supabase-client.js      # 🔌 חיבור DB
├── supabase/               # 📦 Edge Functions
│   └── functions/
│       └── send-invoice/
│           └── index.ts    # 📧 שליחת מיילים
│
├── assets/                 # 🖼️ תמונות
│   ├── doctor-anna.jpg     # תמונת הרופאה
│   ├── doctor-anna.png
│   ├── hero.jpg            # תמונת רקע
│   └── hero-spine.jpg
│
├── robots.txt              # 🤖 SEO
└── sitemap.xml             # 🗺️ מפת אתר
```

## 🔒 אבטחה

### חובה

- ✅ HTTPS (SSL Certificate)
- ✅ סיסמאות חזקות (8+ תווים, אותיות גדולות/קטנות, מספרים)
- ✅ Row Level Security ב-Supabase (כבר מוגדר)
- ✅ גיבויים שבועיים

### מומלץ

- 🔐 Two-Factor Authentication (2FA)
- 🔑 החלפת סיסמאות כל 3 חודשים
- 📝 לוג פעילות משתמשים
- 🛡️ Web Application Firewall (WAF)

## 📈 SEO ואנליטיקס

### Google Analytics

הוסף ב-`<head>` של **index.html**:

```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

### Google Search Console

1. גש ל-[Google Search Console](https://search.google.com/search-console)
2. הוסף נכס (Property)
3. אמת בעלות (DNS או HTML)
4. העלה את `sitemap.xml`

### Meta Tags מוגדרים

- ✅ Title tags
- ✅ Meta descriptions
- ✅ Open Graph (Facebook/WhatsApp)
- ✅ Twitter Cards
- ✅ JSON-LD Schema
- ✅ Canonical URLs

## 📞 תמיכה

### פרטי קשר

- 📧 Email: info@dr-anna-brameli.co.il
- 📱 Phone: 054-580-8008
- 🏥 מרכז שניידר, קפלן 14, פתח תקווה

### שאלות נפוצות

**ש: איך מוסיפים שדה חדש לטופס?**  
ת: ערוך את `index.html` ו-`script.js`, הוסף column ב-Supabase

**ש: איך משנים את שעות הפעילות?**  
ת: ערוך את `index.html` בסקשן Contact

**ש: איך מוסיפים שירות חדש?**  
ת: ערוך את `index.html` בסקשן Services

## 📝 רישיון

כל הזכויות שמורות © 2024 ד"ר אנה ברמלי

---

**בנוי בגאווה לקידום בריאות ילדי ישראל** ❤️🇮🇱
