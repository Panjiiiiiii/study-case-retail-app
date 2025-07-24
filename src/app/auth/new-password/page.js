"use client";

import { Button } from "@/components/ui/Button";
import { PasswordInput, TextInput } from "@/components/ui/Input";
import { H1, P } from "@/components/ui/Text";

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
          <H1 className="text-start text-sky-950">Forgot Password</H1>
          <P className="text-start mb-4 font-light text-sky-950">Confirm your new password here</P>

          <div className="flex flex-col gap-4 mb-4">
            <TextInput placeholder="Email" />
            <PasswordInput placeholder="Password" />
            <PasswordInput placeholder="Confirm new password" />
          </div>

          <div className="flex justify-center mb-4">
            <Button
              children="Change Password"
              className="rounded-3xl w-auto font-semibold border border-transparent hover:bg-white hover:text-sky-950 hover:border-sky-950 transition"
            />
          </div>

          <P className="text-[12px] text-center text-sky-950">
            Back to login?{" "}
            <a href="/auth/signin" className="font-semibold cursor-pointer hover:underline">Click Here</a>
          </P>
        </div>
      </div>
    </div>
  );
}
