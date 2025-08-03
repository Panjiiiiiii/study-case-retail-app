import { Button } from "@/components/ui/Button";
import { EnumInput, FileInput, NumberInput, OptionInput, QtyInput, TextInput } from "@/components/ui/Input";
import { H1, P } from "@/components/ui/Text";
import { FaPlus, FaTrash } from "react-icons/fa6";

export default function FormLogistic() {
    // Helper to format date as dd/mm/yyyy
    function formatDate(date) {
        const d = new Date(date);
        const day = String(d.getDate()).padStart(2, '0');
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const year = d.getFullYear();
        return `${day}/${month}/${year}`;
    }

    return (
    <div className="bg-white rounded-lg p-12 w-[1200px] h-[760px] mx-auto flex items-center">
        <div className="w-full">
            <H1 className={`text-4xl mb-8`}>Load In Stuff</H1>
            <form className="flex flex-col gap-8 mb-8">
                <div className="flex flex-row justify-between gap-4 items-center">
                    <div className="flex flex-col gap-4">
                        <label className="text-sky-950 text-xl font-bold">Product Name</label>
                        <EnumInput inputClassName={`h-[60px] w-[280px] rounded-4xl`} />
                    </div>
                    <div className="flex flex-col gap-4">
                        <label className="text-sky-950 text-xl font-bold">Stock</label>
                        <QtyInput inputClassName={`h-[60px] w-[280px] rounded-4xl`}/>
                    </div>
                    <div className="flex flex-col gap-4">
                        <label className="text-sky-950 text-xl font-bold">Wholesale Price</label>
                        <NumberInput placeholder={`Enter wholesale price`} inputClassName={`h-[60px] w-[280px] rounded-4xl`} />
                    </div>
                    <Button variant="success" className={`rounded-4xl p-4 h-[60px] mt-10`}>
                        <div className="flex flex-row gap-4 items-center align-middle">
                            <span><FaPlus/></span>
                            <P>Add Item</P>
                        </div>
                    </Button>
                </div>
            </form>
            <div className="flex flex-col gap-4">
                <H1 className={`text-2xl mb-4`}>Listed Product At {formatDate(Date.now())}</H1>
                <table className="w-full mb-8">
                    <thead>
                        <tr>
                            <th className="text-center bg-sky-950 p-4"><P className={`text-white`}>Product Name</P></th>
                            <th className="text-center bg-sky-950 p-4"><P className={`text-white`}>Stock</P></th>
                            <th className="text-center bg-sky-950 p-4"><P className={`text-white`}>Wholesale Price</P></th>
                            <th className="text-center bg-sky-950 p-4"><P className={`text-white`}>Actions</P></th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td className="text-center p-4">Product A</td>
                            <td className="text-center p-4">100</td>
                            <td className="text-center p-4">Rp 50.000</td>
                            <td className="text-center p-4">
                                <Button variant="danger" className={`rounded-4xl p-2`}><span><FaTrash size={16}/></span></Button>
                            </td>
                        </tr>
                        <tr>
                            <td className="text-center p-4">Product A</td>
                            <td className="text-center p-4">100</td>
                            <td className="text-center p-4">Rp 50.000</td>
                            <td className="text-center p-4">
                                <Button variant="danger" className={`rounded-4xl p-2`}><span><FaTrash size={16}/></span></Button>
                            </td>
                        </tr>
                        <tr>
                            <td className="text-center p-4">Product A</td>
                            <td className="text-center p-4">100</td>
                            <td className="text-center p-4">Rp 50.000</td>
                            <td className="text-center p-4">
                                <Button variant="danger" className={`rounded-4xl p-2`}><span><FaTrash size={16}/></span></Button>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <div className="flex justify-end">
                    <Button variant="success" className={`rounded-4xl py-2`}><P className={`text-lg`}>Submit</P></Button>
                </div>
            </div>
        </div>
    </div>
    );
};
