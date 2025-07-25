"use client";

import { Button } from "@/components/ui/Button";
import { PasswordInput, TextInput } from "@/components/ui/Input";
import { H1, P } from "@/components/ui/Text";
import { IoLogoGoogle } from "react-icons/io";

// import { signIn } from "next-auth/react";

export default function SignInPage() {
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

          <div className="flex flex-col gap-4 mb-4">
            <TextInput placeholder="Username" />
            <TextInput placeholder="Email" />
            <PasswordInput placeholder="Password" />
          </div>

          <div className="flex justify-center mb-4">
            <Button
              children="Register"
              className="rounded-3xl w-[90px] font-semibold border border-transparent hover:bg-white hover:text-sky-950 hover:border-sky-950 transition"
            />
          </div>

          <div className="flex items-center my-4">
            <hr className="flex-grow border-t border-gray-300" />
            <P className="mx-2 text-gray-400 text-sm">OR</P>
            <hr className="flex-grow border-t border-gray-300" />
          </div>

          <Button className={`flex items-center justify-center gap-2 border border-sky-950 text-sky-950 bg-transparent rounded-3xl py-2 text-sm hover:bg-sky-950 hover:text-white transition`}>
            <span className="text-lg font-bold"><IoLogoGoogle /></span>
            Sign up with Google
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
