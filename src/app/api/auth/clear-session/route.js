import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { successResponse } from "@/lib/response";

export async function POST(request) {
  try {
    // Clear session on server side if needed
    const session = await getServerSession(authOptions);
    console.log('🔍 Clearing session for user:', session?.user?.email);
    
    const response = successResponse({
      message: "Session cleared successfully"
    });

    // Clear NextAuth cookies
    response.cookies.set('next-auth.session-token', '', {
      expires: new Date(0),
      path: '/'
    });
    
    response.cookies.set('next-auth.csrf-token', '', {
      expires: new Date(0),
      path: '/'
    });

    response.cookies.set('__Secure-next-auth.session-token', '', {
      expires: new Date(0),
      path: '/',
      secure: true
    });

    return response;
  } catch (error) {
    console.error('Clear session error:', error);
    return successResponse({
      message: "Session cleared"
    });
  }
}
