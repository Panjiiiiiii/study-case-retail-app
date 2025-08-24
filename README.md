# ERP Retail App - Complete Setup Guide

A modern, full-stack ERP (Enterprise Resource Planning) system designed specifically for retail businesses. Built with Next.js 15, featuring comprehensive inventory management, sales tracking, and role-based access control.

## 🚀 Features

- **👥 Multi-Role Authentication**: Admin and Cashier roles with secure authentication
- **🔒 Google OAuth Integration**: Sign in/up with Google account support
- **📦 Inventory Management**: Complete product catalog with categories and stock tracking
- **💰 Transaction Management**: POS system with payment processing
- **📊 Analytics Dashboard**: Real-time sales charts and business insights
- **📱 Responsive Design**: Works perfectly on desktop, tablet, and mobile
- **🔒 Protected Routes**: Middleware-based route protection with unauthorized access alerts
- **☁️ Cloud Integration**: Cloudinary for image management
- **📄 Report Generation**: PDF and Excel export capabilities

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React 19, TailwindCSS
- **Backend**: Next.js API Routes, NextAuth.js
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js with JWT + Google OAuth Provider
- **File Storage**: Cloudinary
- **UI Components**: Custom components with Tailwind
- **Charts**: Recharts
- **Icons**: React Icons
- **Notifications**: React Hot Toast

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (version 18 or higher)
- npm or yarn package manager
- PostgreSQL database
- Git

## 🔧 Installation & Setup

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/erp-retail-app.git
cd erp-retail-app
```

### 2. Install Dependencies
```bash
npm install
# or
yarn install
```

### 3. Environment Configuration
Create a `.env.local` file in the root directory:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/erp_retail_db"

# NextAuth
NEXTAUTH_SECRET="your-nextauth-secret-key"
NEXTAUTH_URL="http://localhost:3000"

# Google OAuth (Required for Google Sign-in)
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# Admin User Setup
ADMIN_NAME="Admin User"
ADMIN_EMAIL="admin@example.com"
ADMIN_PASSWORD="admin123"

# Cloudinary (Optional - for image uploads)
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"
```

### 3.1. Google OAuth Setup
To enable Google authentication, you need to:

1. **Create Google OAuth Credentials**:
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select existing one
   - Enable Google+ API
   - Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client IDs"
   - Set application type to "Web application"
   - Add authorized redirect URIs:
     - `http://localhost:3000/api/auth/callback/google` (development)
     - `https://yourdomain.com/api/auth/callback/google` (production)

2. **Configure Environment Variables**:
   - Copy the Client ID to `GOOGLE_CLIENT_ID`
   - Copy the Client Secret to `GOOGLE_CLIENT_SECRET`

### 4. Database Setup
```bash
# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma migrate dev

# (Optional) Seed the database
npx prisma db seed
```

### 5. Create Admin User
```bash
npm run create-admin
```
Follow the prompts to create your first admin user.

### 6. Start Development Server
```bash
npm run dev
```

Visit `http://localhost:3000` to see your application running!

## 📁 Project Structure

```
erp-retail-app/
├── src/
│   ├── app/
│   │   ├── admin/           # Admin dashboard pages
│   │   ├── user/            # Cashier dashboard pages
│   │   ├── auth/            # Authentication pages
│   │   ├── api/             # API routes
│   │   └── globals.css      # Global styles
│   ├── components/
│   │   └── ui/              # Reusable UI components
│   ├── lib/                 # Utility functions and configurations
│   └── hooks/               # Custom React hooks
├── prisma/
│   ├── schema.prisma        # Database schema
│   └── migrations/          # Database migrations
├── public/                  # Static assets
├── scripts/                 # Utility scripts
└── middleware.js            # Route protection middleware
```

## 🔐 User Roles & Access

### Authentication Methods
- **Email/Password**: Traditional registration and login
- **Google OAuth**: Sign in/up with Google account (automatically creates account with CASHIER role)

### Admin Role
- Full system access
- Inventory management (add/edit/delete products)
- Category management
- Sales analytics and reports
- User management
- Financial overview

### Cashier Role
- Point of sale (POS) system
- Transaction processing
- Inventory viewing (read-only)
- Sales history
- Customer interaction
- Available for both manual registration and Google OAuth users

## 🚀 Deployment

### Production Build
```bash
npm run build
npm start
```

### Environment Variables for Production
Make sure to set all environment variables in your production environment:
- `DATABASE_URL` - Your production database URL
- `NEXTAUTH_SECRET` - A secure secret for NextAuth
- `NEXTAUTH_URL` - Your production domain
- `GOOGLE_CLIENT_ID` - Google OAuth Client ID
- `GOOGLE_CLIENT_SECRET` - Google OAuth Client Secret
- `ADMIN_NAME`, `ADMIN_EMAIL`, `ADMIN_PASSWORD` - Admin user credentials
- Cloudinary credentials (if using image uploads)

### Recommended Deployment Platforms
- **Vercel** (Recommended for Next.js apps)
- **Netlify**
- **Railway**
- **DigitalOcean App Platform**

## 📊 Database Schema

The application uses the following main entities:
- **Users**: Admin and Cashier accounts
- **Products**: Inventory items with categories
- **Categories**: Product categorization
- **Transactions**: Sales records
- **TransactionItems**: Individual items in transactions

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

**Happy coding! 🎉**

For more information, visit our [documentation](https://github.com/Panjiiiiiii/study-case-retail-app) or contact us.
