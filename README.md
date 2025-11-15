# Vue.js + Express.js Authentication App

This project has been refactored from Next.js to use **Vue.js** as the frontend and **Express.js** as the backend, with custom authentication instead of Supabase Auth.

## 🏗️ Architecture

- **Frontend**: Vue.js 3 + TypeScript + Vite + Tailwind CSS
- **Backend**: Express.js + Node.js + Custom JWT Authentication
- **Database**: Supabase PostgreSQL (direct database access, no Supabase Auth)
- **State Management**: Pinia
- **Routing**: Vue Router

## 📁 Project Structure

```
loginAPI/
├── frontend/                 # Vue.js frontend
│   ├── src/
│   │   ├── components/       # Reusable components
│   │   ├── views/           # Page components
│   │   ├── stores/          # Pinia stores
│   │   ├── services/        # API services
│   │   ├── router/          # Vue Router config
│   │   └── main.ts          # App entry point
│   ├── index.html
│   ├── package.json
│   └── vite.config.ts
├── backend/                  # Express.js backend
│   ├── src/
│   │   ├── config/          # Database config
│   │   ├── controllers/     # Route controllers
│   │   ├── middleware/      # Custom middleware
│   │   ├── routes/          # API routes
│   │   ├── scripts/         # Database scripts
│   │   └── server.js        # Server entry point
│   ├── .env                 # Environment variables
│   └── package.json
└── README.md
```

## 🚀 Setup Instructions

### Prerequisites

- Node.js 16+ and npm/pnpm
- Supabase account and project
- Git

### 1. Database Setup

1. Go to your Supabase project dashboard
2. Go to SQL Editor and run the following script:

```sql
-- Create custom users table for custom authentication (not using Supabase auth)
CREATE TABLE IF NOT EXISTS public.custom_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Drop the old RLS policies if they exist and disable RLS for custom auth
ALTER TABLE public.custom_users DISABLE ROW LEVEL SECURITY;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_custom_users_email ON public.custom_users(email);

-- Optional: Create a trigger to update the updated_at column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_custom_users_updated_at ON public.custom_users;

CREATE TRIGGER update_custom_users_updated_at
    BEFORE UPDATE ON public.custom_users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
```

### 2. Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables:**
   Edit `backend/.env` and add your Supabase credentials:
   ```env
   # Backend Environment Variables
   PORT=3001
   NODE_ENV=development

   # JWT Secret (generate a strong secret in production)
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   JWT_EXPIRES_IN=7d

   # Supabase Configuration (for database connection only, not auth)
   SUPABASE_URL=your-supabase-project-url
   SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key

   # CORS Origin (your Vue frontend URL)
   CORS_ORIGIN=http://localhost:5173
   ```

4. **Start the backend server:**
   ```bash
   npm run dev
   ```

   The backend will run on `http://localhost:3001`

### 3. Frontend Setup

1. **Open a new terminal and navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the frontend development server:**
   ```bash
   npm run dev
   ```

   The frontend will run on `http://localhost:5173`

## 🧪 Testing the Application

1. **Access the application:** Open `http://localhost:5173` in your browser

2. **Test Registration:**
   - Click "Registrarse"
   - Fill in email and password (minimum 6 characters)
   - Submit the form
   - Should redirect to dashboard after successful registration

3. **Test Login:**
   - Go back to home or click "Iniciar Sesión"
   - Use the credentials you just created
   - Should redirect to dashboard after successful login

4. **Test Dashboard:**
   - Verify user information is displayed
   - Test "Actualizar Perfil" button
   - Test logout functionality

5. **Test Navigation:**
   - Verify protected routes redirect to login when not authenticated
   - Verify login/register routes redirect to dashboard when authenticated

## 📚 API Endpoints

### Authentication Routes
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/profile` - Get user profile (protected)

### Health Check
- `GET /health` - Server health check
- `GET /` - API information

## 🔑 Key Features

### Security
- **JWT Authentication**: Custom JWT-based authentication
- **Password Hashing**: bcryptjs with salt rounds
- **Rate Limiting**: Protection against brute force attacks
- **CORS Protection**: Configured for cross-origin requests
- **Input Validation**: Server-side validation with express-validator

### Frontend Features
- **Reactive UI**: Vue 3 Composition API
- **Type Safety**: Full TypeScript support
- **State Management**: Pinia for global state
- **Route Protection**: Authentication guards
- **Responsive Design**: Tailwind CSS
- **Error Handling**: User-friendly error messages

### Backend Features
- **RESTful API**: Clean REST endpoints
- **Middleware**: Authentication and validation
- **Error Handling**: Comprehensive error responses
- **Database**: Direct PostgreSQL queries via Supabase client

## 🔧 Development Scripts

### Backend
```bash
npm run dev     # Start development server with nodemon
npm start       # Start production server
```

### Frontend
```bash
npm run dev     # Start development server
npm run build   # Build for production
npm run preview # Preview production build
```

## 🚨 Important Notes

1. **Environment Variables**: Never commit your `.env` file with real credentials
2. **JWT Secret**: Use a strong, randomly generated secret in production
3. **Database**: This setup uses direct database access, not Supabase Auth
4. **CORS**: Update CORS_ORIGIN for production deployment
5. **Rate Limiting**: Adjust rate limits based on your needs

## 🐛 Troubleshooting

### Common Issues

1. **CORS Errors**: Ensure backend CORS_ORIGIN matches frontend URL
2. **Database Connection**: Verify Supabase URL and service key
3. **JWT Errors**: Check JWT_SECRET is set and consistent
4. **Port Conflicts**: Ensure ports 3001 and 5173 are available

### Development Tips

- Check browser console for frontend errors
- Check terminal output for backend errors
- Use browser dev tools Network tab to debug API calls
- Verify database table creation in Supabase dashboard

## 📝 Migration Notes

This project was migrated from:
- **Next.js** → **Vue.js + Express.js**
- **Supabase Auth** → **Custom JWT Authentication**
- **App Router** → **Vue Router**
- **React State** → **Pinia Store**

The custom authentication provides more control over the login flow and user management while maintaining the same database structure.
