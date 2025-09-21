# بات هوشمند زیمر - Persian Chatbot

یک سیستم چت‌بات کامل با قابلیت‌های پیشرفته برای پاسخ‌دهی به سؤالات به زبان فارسی.

## ویژگی‌ها

### Backend (FastAPI + LangChain)
- **تشخیص نیت**: طبقه‌بندی خودکار پیام‌های کاربر
- **جستجوی معنایی**: استفاده از FAISS برای یافتن بهترین پاسخ‌ها
- **پایگاه داده**: SQLite با SQLAlchemy برای ذخیره FAQ و لاگ‌ها
- **مدیریت FAQ**: CRUD کامل برای سؤالات و دسته‌بندی‌ها
- **لاگ‌گیری**: ثبت کامل گفت‌وگوها با جزئیات عملکرد

### Frontend (Next.js + Tailwind)
- **رابط کاربری فارسی**: طراحی RTL با فونت Vazirmatn
- **تم بنفش/خاکستری**: طراحی مدرن و زیبا
- **ویجت چت**: چت‌بات شناور با پنل دیباگ
- **صفحات مدیریت**: مدیریت FAQ و مشاهده لاگ‌ها
- **فیلتر و جستجو**: قابلیت‌های پیشرفته فیلترسازی

## نصب و راه‌اندازی

### پیش‌نیازها
- Python 3.8+
- Node.js 18+
- OpenAI API Key

### Backend

1. **نصب وابستگی‌ها**:
```bash
cd backend
pip install -r requirements.txt
```

2. **تنظیم متغیرهای محیطی**:
```bash
cp env.example .env
# فایل .env را ویرایش کنید و API Key خود را اضافه کنید
```

3. **ایجاد جداول دیتابیس**:
```bash
python seed.py
```

4. **اجرای سرور**:
```bash
python app.py
```

سرور روی `http://localhost:8000` اجرا می‌شود.

### Frontend

1. **نصب وابستگی‌ها**:
```bash
cd frontend
npm install
```

2. **تنظیم متغیرهای محیطی**:
```bash
# فایل .env.local ایجاد کنید
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

3. **اجرای برنامه**:
```bash
npm run dev
```

برنامه روی `http://localhost:3000` اجرا می‌شود.

## ساختار پروژه

```
├── backend/
│   ├── app.py                 # FastAPI entry point
│   ├── core/
│   │   ├── config.py          # تنظیمات
│   │   └── db.py             # دیتابیس
│   ├── models/
│   │   ├── faq.py            # مدل‌های FAQ و Category
│   │   └── log.py            # مدل ChatLog
│   ├── schemas/
│   │   ├── chat.py           # اسکیماهای چت
│   │   ├── faq.py            # اسکیماهای FAQ
│   │   └── log.py            # اسکیماهای لاگ
│   ├── services/
│   │   ├── chain.py          # زنجیره اصلی پردازش
│   │   ├── intent.py         # تشخیص نیت
│   │   ├── retriever.py      # جستجوی معنایی
│   │   └── answer.py         # تولید پاسخ
│   ├── routers/
│   │   ├── chat.py           # API چت
│   │   ├── faqs.py           # API FAQ
│   │   └── logs.py           # API لاگ‌ها
│   ├── seed.py               # داده‌های نمونه
│   └── requirements.txt
└── frontend/
    ├── app/
    │   ├── layout.tsx        # Layout اصلی
    │   ├── page.tsx          # صفحه اصلی
    │   └── admin/            # صفحات مدیریت
    ├── components/
    │   ├── ChatWidget.tsx    # ویجت چت
    │   ├── DebugPanel.tsx    # پنل دیباگ
    │   └── FAQModal.tsx      # مودال FAQ
    ├── lib/
    │   └── api.ts            # API helpers
    └── styles/
        └── globals.css       # استایل‌های کلی
```

## API Endpoints

### چت
- `POST /api/chat` - ارسال پیام و دریافت پاسخ

### FAQ
- `GET /api/faqs` - لیست سؤالات با فیلتر
- `POST /api/faqs` - ایجاد سؤال جدید
- `PUT /api/faqs/{id}` - ویرایش سؤال
- `DELETE /api/faqs/{id}` - حذف سؤال
- `POST /api/faqs/reindex` - بازسازی ایندکس

### دسته‌بندی‌ها
- `GET /api/categories` - لیست دسته‌بندی‌ها
- `POST /api/categories` - ایجاد دسته‌بندی
- `DELETE /api/categories/{id}` - حذف دسته‌بندی

### لاگ‌ها
- `GET /api/logs` - لیست لاگ‌ها با فیلتر
- `GET /api/logs/stats` - آمار کلی
- `DELETE /api/logs/{id}` - حذف لاگ

## تنظیمات

### متغیرهای محیطی Backend
```env
OPENAI_API_KEY=your_api_key
OPENAI_MODEL=gpt-4o-mini
EMBEDDING_MODEL=text-embedding-3-small
RETRIEVAL_TOP_K=4
RETRIEVAL_THRESHOLD=0.82
DATABASE_URL=sqlite:///./app.db
```

### متغیرهای محیطی Frontend
```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

## استفاده

1. **چت‌بات**: روی دکمه چت کلیک کنید و شروع به گفت‌وگو کنید
2. **حالت دیباگ**: برای مشاهده جزئیات فنی، دکمه تنظیمات را فعال کنید
3. **مدیریت FAQ**: از `/admin/faqs` برای مدیریت سؤالات استفاده کنید
4. **مشاهده لاگ‌ها**: از `/admin/logs` برای بررسی عملکرد سیستم استفاده کنید

## ویژگی‌های فنی

- **تشخیص نیت**: طبقه‌بندی خودکار با 7 دسته مختلف
- **جستجوی معنایی**: استفاده از FAISS برای یافتن بهترین پاسخ‌ها
- **کیفیت‌سنجی**: بررسی کیفیت پاسخ‌ها و استفاده از پاسخ پیش‌فرض در صورت نیاز
- **لاگ‌گیری کامل**: ثبت تمام جزئیات گفت‌وگو و عملکرد سیستم
- **رابط کاربری RTL**: طراحی مخصوص زبان فارسی

## توسعه

برای توسعه بیشتر:

1. **افزودن دسته‌بندی جدید**: در `services/intent.py` برچسب جدید اضافه کنید
2. **تغییر مدل**: در `core/config.py` مدل مورد نظر را تنظیم کنید
3. **افزودن فیلتر**: در `routers/logs.py` فیلتر جدید اضافه کنید
4. **تغییر UI**: در `frontend/components/` کامپوننت‌ها را ویرایش کنید

## مجوز

این پروژه تحت مجوز MIT منتشر شده است.
