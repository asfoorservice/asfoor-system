# asfoor-system

نظام إدارة مركز عصفور لصيانة السيارات — ASFOOR AUTO SERVICES

- `index.html` — النظام كله (واجهة + منطق).
- البيانات محفوظة في Firebase Firestore (مشروع `asfour-auto`)، والدخول بـ Firebase Authentication.
- `sw.js` + `manifest.webmanifest` — تشغيل بدون إنترنت وتثبيت على الموبايل.
- الموقع بيتنشر تلقائياً على GitHub Pages مع كل تحديث على فرع `main`: https://asfoorservice.github.io/asfoor-system/

## إضافة مستخدم جديد
1. Firebase Console ← Authentication ← Users ← Add user.
2. Firestore ← Rules: ضيف الإيميل في قايمة `isStaff()` ودوس Publish.
