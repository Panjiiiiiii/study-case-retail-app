import { signOut } from "next-auth/react";

export async function POST() {
  try {
    await signOut({ 
      redirect: false,
      callbackUrl: "/auth/signin" 
    });
    
    return Response.json({ 
      success: true, 
      message: "Successfully signed out" 
    }, { status: 200 });
  } catch (error) {
    console.error("Sign out error:", error);
    return Response.json({ 
      success: false, 
      error: "Failed to sign out" 
    }, { status: 500 });
  }
}
