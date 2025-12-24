# Supabase Backend Configuration Guide

## תוכן עניינים
1. [יצירת פרויקט](#יצירת-פרויקט)
2. [הגדרת טבלאות](#הגדרת-טבלאות)
3. [הגדרת אחסון קבצים](#הגדרת-אחסון-קבצים)
4. [Edge Functions](#edge-functions)
5. [חיבור לאתר](#חיבור-לאתר)

## יצירת פרויקט

1. היכנס ל-[Supabase Dashboard](https://app.supabase.com)
2. לחץ על "New Project"
3. מלא את הפרטים:
   - שם הפרויקט: `dr-anna-brameli`
   - Database Password: סיסמה חזקה (שמור אותה!)
   - Region: `eu-central-1` (Frankfurt - הכי קרוב לישראל)

## הגדרת טבלאות

### טבלת Appointments

```sql
-- Create appointments table
CREATE TABLE appointments (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  
  -- Patient Information
  child_first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  birth_date DATE NOT NULL,
  age TEXT NOT NULL,
  
  -- Parent Information
  parent_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  health_fund TEXT NOT NULL,
  
  -- Appointment Details
  reason TEXT NOT NULL,
  symptoms TEXT,
  preferred_date DATE,
  preferred_time TEXT,
  
  -- Files
  files TEXT[],
  
  -- Status
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')),
  source TEXT DEFAULT 'website',
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  notes TEXT
);

-- Create index for faster queries
CREATE INDEX idx_appointments_status ON appointments(status);
CREATE INDEX idx_appointments_created_at ON appointments(created_at DESC);
CREATE INDEX idx_appointments_phone ON appointments(phone);

-- Enable Row Level Security (RLS)
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;

-- Create policy for inserting new appointments (public)
CREATE POLICY "Anyone can insert appointments" ON appointments
  FOR INSERT WITH CHECK (true);

-- Create policy for viewing appointments (authenticated users only)
CREATE POLICY "Only authenticated users can view appointments" ON appointments
  FOR SELECT USING (auth.role() = 'authenticated');

-- Create policy for updating appointments (authenticated users only)
CREATE POLICY "Only authenticated users can update appointments" ON appointments
  FOR UPDATE USING (auth.role() = 'authenticated');
```

### טבלת Patients (אופציונלי - לניהול מטופלים)

```sql
CREATE TABLE patients (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  
  -- Personal Information
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  birth_date DATE NOT NULL,
  id_number TEXT UNIQUE,
  
  -- Parent Information
  parent_name TEXT NOT NULL,
  parent_phone TEXT NOT NULL,
  parent_email TEXT,
  
  -- Medical Information
  health_fund TEXT NOT NULL,
  allergies TEXT[],
  chronic_conditions TEXT[],
  medications TEXT[],
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  notes TEXT
);

-- Enable RLS
ALTER TABLE patients ENABLE ROW LEVEL SECURITY;

-- Only authenticated users can access patients
CREATE POLICY "Only authenticated users can manage patients" ON patients
  USING (auth.role() = 'authenticated');
```

### טבלת Medical Records (אופציונלי)

```sql
CREATE TABLE medical_records (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
  
  -- Visit Information
  visit_date DATE NOT NULL,
  visit_type TEXT NOT NULL,
  diagnosis TEXT,
  treatment TEXT,
  
  -- Files
  files TEXT[],
  
  -- Metadata
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE medical_records ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Only authenticated users can manage records" ON medical_records
  USING (auth.role() = 'authenticated');
```

## הגדרת אחסון קבצים

### יצירת Storage Bucket

1. עבור ל-Storage בתפריט הצד
2. לחץ על "Create a new bucket"
3. שם: `medical-documents`
4. Public: `false` (פרטי)
5. לחץ על "Create bucket"

### הגדרת מדיניות אחסון

```sql
-- Allow public uploads to appointments folder
CREATE POLICY "Public can upload to appointments folder"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'medical-documents' AND (storage.foldername(name))[1] = 'appointments');

-- Only authenticated users can view files
CREATE POLICY "Authenticated users can view files"
ON storage.objects FOR SELECT
USING (bucket_id = 'medical-documents' AND auth.role() = 'authenticated');

-- Only authenticated users can delete files
CREATE POLICY "Authenticated users can delete files"
ON storage.objects FOR DELETE
USING (bucket_id = 'medical-documents' AND auth.role() = 'authenticated');
```

## Edge Functions

### פונקציה לשליחת הודעות דוא"ל

צור קובץ `supabase/functions/send-appointment-notification/index.ts`:

```typescript
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')

serve(async (req) => {
  try {
    const appointment = await req.json()

    // Send email using Resend
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RESEND_API_KEY}`
      },
      body: JSON.stringify({
        from: 'מרפאת ד"ר אנה ברמלי <noreply@dr-anna-brameli.co.il>',
        to: 'info@dr-anna-brameli.co.il',
        subject: `בקשת תור חדשה - ${appointment.child_first_name} ${appointment.last_name}`,
        html: `
          <div dir="rtl" style="font-family: Arial, sans-serif;">
            <h2>בקשת תור חדשה</h2>
            
            <h3>פרטי הילד/ה:</h3>
            <p><strong>שם:</strong> ${appointment.child_first_name} ${appointment.last_name}</p>
            <p><strong>תאריך לידה:</strong> ${appointment.birth_date}</p>
            <p><strong>גיל:</strong> ${appointment.age}</p>
            
            <h3>פרטי ההורה:</h3>
            <p><strong>שם:</strong> ${appointment.parent_name}</p>
            <p><strong>טלפון:</strong> ${appointment.phone}</p>
            <p><strong>דוא"ל:</strong> ${appointment.email || 'לא צוין'}</p>
            <p><strong>קופת חולים:</strong> ${appointment.health_fund}</p>
            
            <h3>פרטי הפנייה:</h3>
            <p><strong>סיבה:</strong> ${appointment.reason}</p>
            <p><strong>תסמינים:</strong> ${appointment.symptoms || 'לא צוינו'}</p>
            <p><strong>תאריך מועדף:</strong> ${appointment.preferred_date || 'לא צוין'}</p>
            <p><strong>שעה מועדפת:</strong> ${appointment.preferred_time || 'לא צוינה'}</p>
            
            <p><strong>תאריך יצירה:</strong> ${new Date(appointment.created_at).toLocaleString('he-IL')}</p>
          </div>
        `
      })
    })

    if (!res.ok) {
      throw new Error('Failed to send email')
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
})
```

### Deploy Edge Function

```bash
# Install Supabase CLI
npm install -g supabase

# Login
supabase login

# Link to your project
supabase link --project-ref YOUR_PROJECT_REF

# Deploy function
supabase functions deploy send-appointment-notification

# Set environment variable
supabase secrets set RESEND_API_KEY=your_resend_api_key
```

## חיבור לאתר

עדכן את הקוד ב-`index.html`:

```javascript
// Replace these with your actual values
window.SUPABASE_URL = "https://YOUR-PROJECT-REF.supabase.co";
window.SUPABASE_ANON_KEY = "YOUR-ANON-KEY";
```

איפה למצוא את הערכים האלו:
1. פתח את ה-Dashboard של הפרויקט שלך
2. עבור ל-Settings > API
3. העתק את:
   - Project URL → `SUPABASE_URL`
   - anon/public key → `SUPABASE_ANON_KEY`

## בדיקת החיבור

1. פתח את האתר
2. מלא את טופס קביעת התור
3. שלח את הטופס
4. בדוק ב-Supabase Dashboard:
   - Table Editor > appointments - האם הרשומה נוצרה?
   - Storage > medical-documents - האם הקבצים הועלו?

## אבטחה

### מומלץ להוסיף:

1. **Rate Limiting** - הגבלת מספר בקשות:
```sql
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Clean old pending appointments after 7 days
SELECT cron.schedule(
  'clean-old-pending-appointments',
  '0 0 * * *',  -- Run daily at midnight
  $$
  UPDATE appointments 
  SET status = 'cancelled'
  WHERE status = 'pending' 
    AND created_at < NOW() - INTERVAL '7 days'
  $$
);
```

2. **Email Verification** - אימות דוא"ל למנהלים
3. **Backup** - גיבוי אוטומטי של הנתונים

## Troubleshooting

### בעיות נפוצות:

1. **"Failed to fetch"**:
   - בדוק את ה-CORS settings ב-Supabase
   - וודא שה-URL נכון

2. **"Row Level Security policy violation"**:
   - בדוק את ה-RLS policies
   - וודא שהמשתמש מאומת

3. **"Storage error"**:
   - בדוק את ה-bucket policies
   - וודא שה-bucket קיים

## תמיכה נוספת

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase Discord](https://discord.supabase.com)
- [GitHub Issues](https://github.com/supabase/supabase/issues)
