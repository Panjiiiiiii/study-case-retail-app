import { getServerSession } from 'next-auth/next';
import { authOptions } from './auth';

/**
 * Get current user session (server-side)
 * @returns {Promise<Object|null>} User session or null
 */
export async function getCurrentUser() {
  const session = await getServerSession(authOptions);
  return session?.user || null;
}

/**
 * Check if user is authenticated (server-side)
 * @returns {Promise<boolean>} True if authenticated
 */
export async function isAuthenticated() {
  const session = await getServerSession(authOptions);
  return !!session;
}

/**
 * Check if user has specific role (server-side)
 * @param {string} role - Role to check
 * @returns {Promise<boolean>} True if user has role
 */
export async function hasRole(role) {
  const session = await getServerSession(authOptions);
  return session?.user?.role === role;
}

/**
 * Check if user is admin (server-side)
 * @returns {Promise<boolean>} True if user is admin
 */
export async function isAdmin() {
  return await hasRole('ADMIN');
}

/**
 * Check if user is cashier (server-side)
 * @returns {Promise<boolean>} True if user is cashier
 */
export async function isCashier() {
  return await hasRole('CASHIER');
}

/**
 * Require authentication - throws error if not authenticated
 * @returns {Promise<Object>} User session
 * @throws {Error} If not authenticated
 */
export async function requireAuth() {
  const session = await getServerSession(authOptions);
  if (!session) {
    throw new Error('Authentication required');
  }
  return session;
}

/**
 * Require specific role - throws error if user doesn't have role
 * @param {string} role - Required role
 * @returns {Promise<Object>} User session
 * @throws {Error} If user doesn't have required role
 */
export async function requireRole(role) {
  const session = await requireAuth();
  if (session.user.role !== role) {
    throw new Error(`Role ${role} required`);
  }
  return session;
}

/**
 * Require admin role - throws error if user is not admin
 * @returns {Promise<Object>} User session
 * @throws {Error} If user is not admin
 */
export async function requireAdmin() {
  return await requireRole('ADMIN');
} 