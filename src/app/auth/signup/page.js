"use client";

import { Button } from "@/components/ui/Button";
import { PasswordInput, TextInput } from "@/components/ui/Input";
import { H1, P } from "@/components/ui/Text";
import { IoLogoGoogle } from "react-icons/io";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import toast from "react-hot-toast";

export default function SignUpPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleGoogleSignUp = async () => {
    try {
      setIsLoading(true);
      await signIn('google', {
        callbackUrl: '/user',
        redirect: true
      });
    } catch (error) {
      console.error('Google sign up error:', error);
      toast.error("Terjadi kesalahan saat daftar dengan Google");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!name || !email || !password) {
      toast.error("Semua field harus diisi");
      return;
    }

    if (password.length < 6) {
      toast.error("Password minimal 6 karakter");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          password
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Registrasi berhasil! Silakan login.");
        router.push('/auth/signin');
      } else {
        toast.error(data.message || "Registrasi gagal");
      }
    } catch (error) {
      console.error('Registration error:', error);
      toast.error("Terjadi kesalahan saat registrasi");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#E5E7EB] px-4">
      <div className="flex flex-row gap-4 overflow-hidden">
        {/* Image */}
        <div className="w-[400px] h-full">
          <img
            src="/cover-login.svg"
            alt="Login Cover"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Form */}
        <div className="w-[400px] px-12 bg-white flex flex-col justify-center rounded-2xl">
          <H1 className="text-start text-sky-950">Welcome New User</H1>
          <P className="text-start mb-4 font-light text-sky-950">Register here</P>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4 mb-4">
            <TextInput 
              placeholder="Username" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={isLoading}
            />
            <TextInput 
              placeholder="Email" 
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
            />
            <PasswordInput 
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
            />
            <div className="flex justify-center mt-4">
              <Button
                type="submit"
                disabled={isLoading}
                className="rounded-3xl w-[90px] font-semibold border border-transparent hover:bg-white hover:text-sky-950 hover:border-sky-950 transition disabled:opacity-50"
              >
                {isLoading ? "Loading..." : "Register"}
              </Button>
            </div>
          </form>

          <P className={`text-center text-[12px] mb-4`}>
            Already have an account?{" "}
            <a href="/auth/signin" className="font-semibold cursor-pointer hover:underline">Sign In</a>
          </P>

          <div className="flex items-center my-4">
            <hr className="flex-grow border-t border-gray-300" />
            <P className="mx-2 text-gray-400 text-sm">OR</P>
            <hr className="flex-grow border-t border-gray-300" />
          </div>

          <Button 
            onClick={handleGoogleSignUp}
            disabled={isLoading}
            className={`flex items-center justify-center gap-2 border border-sky-950 text-sky-950 bg-transparent rounded-3xl py-2 text-sm hover:bg-sky-950 hover:text-white transition disabled:opacity-50`}
          >
            <span className="text-lg font-bold"><IoLogoGoogle /></span>
            {isLoading ? "Loading..." : "Sign up with Google"}
          </Button>

          <P className="text-[12px] text-center mt-4 text-sky-950">
            Back to login?{" "}
            <a href="/auth/signin" className="font-semibold cursor-pointer hover:underline">Click Here</a>
          </P>
        </div>
      </div>
    </div>
  );
}
