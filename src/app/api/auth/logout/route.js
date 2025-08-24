import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { successResponse } from "@/lib/response";

export async function POST(request) {
  try {
    // Clear session on server side if needed
    const session = await getServerSession(authOptions);
    
    return successResponse({
      message: "Logout berhasil"
    });
  } catch (error) {
    console.error('Logout error:', error);
    return successResponse({
      message: "Logout berhasil"
    });
  }
}
