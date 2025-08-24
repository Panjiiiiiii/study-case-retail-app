"use client";

import { Button } from "../Button";
import { Modal } from "../Modal";
import { P } from "../Text";
import { signOut } from "next-auth/react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function Logout({ open, setOpen }) {
  const router = useRouter();

  const handleClose = () => setOpen(false);

  const handleLogout = async () => {
    try {
      handleClose();
      toast.success("Logout berhasil!", { duration: 1000 });

      await signOut({ callbackUrl: "/auth/signin" });

    } catch (error) {
      console.error("❌ Logout error:", error);
      toast.error("Terjadi kesalahan saat logout");
    }
  };

  return (
    <Modal title="Logout Confirmation" isOpen={open} onClose={handleClose}>
      <div className="flex flex-col gap-4">
        <P>Are you sure you want to logout?</P>
        <div className="flex flex-row justify-center gap-4">
          <Button onClick={handleLogout} variant="danger">
            Logout
          </Button>
          <Button onClick={handleClose}>Cancel</Button>
        </div>
      </div>
    </Modal>
  );
}
