import { Button } from "@/components/ui/Button";
import { H1, H2, P } from "@/components/ui/Text";
import { FaMinus, FaPlus } from "react-icons/fa6";


export default function MenuCard(params) {
    return (
        <>
            <div className="flex-row p-2 bg-white w-[240px] h-[360px] rounded-xl shadow-md">
                <div className="flex flex-col items-center justify-center h-full">
                    <img src="/kecap.png" alt="Menu Image" className="w- h-auto object-cover rounded-t-xl mb-4"/>
                    <H2 className="text-[18px] font-bold text-sky-950 mb-1">Kecap Bango 180 ML</H2>
                    <P className="text-[12px] font-medium text-gray-400 mb-1">Rp. 20.000,00</P>
                    <P className="text-[12px] font-medium text-sky-950 mb-2">Stock: 23</P>
                    <div className="flex flex-row justify-between items-center p-4 gap-4">
                        <Button className={`w-auto h-auto text-[24px] p-[4px] rounded-4xl`}><span><FaMinus/></span></Button>
                        <P className={`text-16`}>0</P>
                        <Button className={`w-auto h-auto text-[24px] p-[4px] rounded-4xl`}><span><FaPlus/></span></Button>
                    </div>
                </div>
            </div>
        </>
    )
};