# Deployment Guide

Follow these steps to deploy your Student Management System to the cloud.

## 1. Cloud Database (PostgreSQL)
We recommend using **Supabase** or **Neon.tech** for a free managed PostgreSQL database.

1. Create a project on [Supabase](https://supabase.com) or [Neon](https://neon.tech).
2. Get your Connection String (JDBC format). It will look something like:
   `jdbc:postgresql://ep-lucky-art-123456.us-east-2.aws.neon.tech/neondb`
3. Note down the **DB_URL**, **DB_USERNAME**, and **DB_PASSWORD**.

## 2. Backend Deployment (Render)
[Render](https://render.com) is excellent for Spring Boot apps.

1. Create a new **Web Service** and connect your GitHub repository.
2. Select the `sms` directory as the **Root Directory**.
3. **Build Command**: `./mvnw clean install -DskipTests`
4. **Start Command**: `java -jar target/sms-0.0.1-SNAPSHOT.jar`
5. Go to the **Environment** tab and add these variables:
   - `DB_URL`: your_jdbc_connection_string
   - `DB_USERNAME`: your_db_user
   - `DB_PASSWORD`: your_db_password
   - `JWT_SECRET`: a_long_random_string_at_least_32_chars
   - `PORT`: 8080

## 3. Frontend Deployment (Vercel)
[Vercel](https://vercel.com) is the best for React apps.

1. Connect your GitHub repository to Vercel.
2. Select the `sms-frontend` directory.
3. In **Environment Variables**, add:
   - `REACT_APP_API_URL`: Your deployed Render backend URL (e.g., `https://sms-backend.onrender.com`)
4. Deploy!

## 4. Connecting the Two
Ensure your backend `SecurityConfig` allows the Vercel URL in its CORS configuration if you want to be more secure (currently it allows `*`).

---

### Local Testing with Environment Variables
To test locally using the production-ready configuration:
```powershell
$env:DB_URL="jdbc:postgresql://localhost:5432/student_management"
$env:DB_USERNAME="postgres"
$env:DB_PASSWORD="your_password"
$env:JWT_SECRET="your_secret"
mvn spring-boot:run
```
