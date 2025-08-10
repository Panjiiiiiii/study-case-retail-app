"use client";
import { H1, P } from "@/components/ui/Text";

export default function CartList() {
  return (
    <aside className="w-[350px] bg-[#F5F7FA] p-8 flex flex-col justify-between h-screen shadow-lg animate-slideIn">
      <div>
        <H1 className="mb-6">Detail Transaction</H1>
        <div className="space-y-4">
          {/* Contoh item */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img src="/kecap-bango.png" alt="Kecap Bango" className="w-12 h-12" />
              <div>
                <P className="font-medium">Kecap Bango 180 ML</P>
                <P className="text-sm text-gray-500">Rp. 2.000,00</P>
              </div>
            </div>
            <P className="font-semibold">X1</P>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div>
        <div className="flex justify-between items-center py-4 border-t border-gray-300">
          <P className="font-medium">Total</P>
          <P className="font-bold text-lg">Rp. 200.000,00</P>
        </div>
        <div className="flex gap-3 mt-4">
          <button className="flex-1 bg-blue-600 text-white py-2 rounded-lg">Payment</button>
          <button className="flex-1 bg-red-600 text-white py-2 rounded-lg">Clear</button>
        </div>
      </div>
    </aside>
  );
}
