"use client";
import { Button } from "@/components/ui/Button";
import { H1, P } from "@/components/ui/Text";
import { FaCartShopping, FaTrash } from "react-icons/fa6";

export default function CartList({ onClose }) {
  return (
    <aside className="w-[400px] bg-[#E5E7EB] flex flex-col justify-between h-screen shadow-lg">
      <div className="flex flex-col align-middle justify-center p-8">
        <H1 className="mb-8 text-3xl text-center">Detail Transaction</H1>
        <div className="space-y-4">
          {/* Contoh item */}
          <div className="flex items-center justify-between bg-white p-4 rounded-lg">
            <div className="flex items-center gap-8">
              <img
                src="/kecap-bango.png"
                alt="Kecap Bango"
                className="w-12 h-12"
              />
              <div>
                <P className="font-medium text-[16px] text-sky-950">Kecap Bango 180 ML</P>
                <P className="text-[12px] text-gray-500">Rp. 2.000,00</P>
              </div>
            </div>
            <P className="text-[16px] text-sky-950 font-semibold">X1</P>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="p-8">
        <div className="flex justify-between items-center py-4 border-t border-gray-300">
          <P className="font-medium text-sky-950">Total</P>
          <P className="font-bold text-lg text-sky-950">Rp. 200.000,00</P>
        </div>
        <div className="flex flex-row justify-between gap-8 mt-4">
          <Button variant="default" className={`flex flex-row items-center gap-2 px-4 py-2 rounded-4xl text-lg font-medium`}><FaCartShopping/>Payment</Button>
          <Button variant="danger" className={`flex flex-row items-center gap-2 px-4 py-2 rounded-4xl text-lg font-medium`}><FaTrash/>Clear</Button>
        </div>
      </div>
    </aside>
  );
}
