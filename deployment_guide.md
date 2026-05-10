# Deployment Guide

Follow these steps to deploy your Student Management System to the cloud.

## 1. Cloud Database (Supabase)
Supabase provides a powerful PostgreSQL database.

1. Go to your [Supabase Dashboard](https://supabase.com/dashboard/projects).
2. Go to **Project Settings** -> **Database**.
3. Under **Connection String**, select **JDBC**.
4. Copy the URL. It will look like: `jdbc:postgresql://db.xxx.supabase.co:5432/postgres`
5. Note your **Database Password** (the one you set when creating the project).

## 2. Backend Deployment (Render / Railway)
You can deploy the Spring Boot app directly or using the `Dockerfile`.

### Environment Variables:
Add these in your hosting provider's "Environment" settings:
- `DB_URL`: `jdbc:postgresql://db.your-id.supabase.co:5432/postgres`
- `DB_USERNAME`: `postgres`
- `DB_PASSWORD`: `your_supabase_password`
- `JWT_SECRET`: `your_secure_random_string`
- `FRONTEND_URL`: `http://localhost:3000,https://your-frontend.vercel.app` (comma separated)
- `PORT`: `8080`

## 3. Frontend Deployment (Vercel / Netlify)
Connect your `sms-frontend` folder.

### Environment Variables:
- `REACT_APP_API_URL`: `https://your-backend-url.onrender.com`

---

## 4. Final Checklist
1. **CORS**: Ensure `FRONTEND_URL` in the backend environment variables includes your deployed frontend URL.
2. **Database Tables**: The backend is set to `spring.jpa.hibernate.ddl-auto=update`, so it will automatically create tables in Supabase on the first run.
3. **Admin User**: The first time you log in as `admin@sms.com` / `admin123`, the system handles it via hardcoded logic in `AuthService`.
