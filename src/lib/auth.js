import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import { prisma } from './prisma';
import bcrypt from 'bcryptjs';

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        console.log('🔍 NextAuth authorize called with:', { 
          email: credentials?.email,
          hasPassword: !!credentials?.password 
        });

        if (!credentials?.email || !credentials?.password) {
          console.log('❌ Missing credentials');
          return null;
        }

        try {
          const user = await prisma.user.findUnique({
            where: { email: credentials.email }
          });

          console.log('🔍 User lookup result:', user ? 'Found' : 'Not found');

          if (!user) {
            console.log('❌ User not found for email:', credentials.email);
            return null;
          }

          const isPasswordValid = await bcrypt.compare(credentials.password, user.password);
          console.log('🔍 Password validation:', isPasswordValid ? 'Valid' : 'Invalid');

          if (!isPasswordValid) {
            console.log('❌ Invalid password for user:', credentials.email);
            return null;
          }

          console.log('✅ Authentication successful for:', user.email);
          
          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role
          };
        } catch (error) {
          console.error('❌ Auth error:', error);
          return null;
        }
      }
    })
  ],
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === 'google') {
        try {
          // Check if user already exists
          const existingUser = await prisma.user.findUnique({
            where: { email: user.email }
          });

          if (!existingUser) {
            // Create new user with Google data
            await prisma.user.create({
              data: {
                name: user.name || profile?.name || 'Google User',
                email: user.email,
                password: '', // Empty password for Google users
                role: 'CASHIER' ,
                provider : 'google',// Default role
              }
            });
          }
          return true;
        } catch (error) {
          console.error('Error creating Google user:', error);
          return false;
        }
      }
      return true;
    },
    async jwt({ token, user, account }) {
      if (user) {
        console.log('🔍 JWT callback - Adding user to token:', user.email);
        
        // For Google users, get user data from database
        if (account?.provider === 'google') {
          const dbUser = await prisma.user.findUnique({
            where: { email: user.email }
          });
          if (dbUser) {
            token.role = dbUser.role;
            token.id = dbUser.id;
          }
        } else {
          // For credential users
          token.role = user.role;
          token.id = user.id;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        console.log('🔍 Session callback - Adding token data to session');
        session.user.id = token.id;
        session.user.role = token.role;
      }
      return session;
    }
  },
  pages: {
    signIn: '/auth/signin',
    signOut: '/auth/signin',
    error: '/auth/signin',
  },
  // events: {
  //   async signOut(message) {
  //     console.log('🔍 SignOut event triggered:', message);
  //   }
  // },
  secret: process.env.NEXTAUTH_SECRET,
  debug: true
};