import { Button } from "@/components/ui/Button";
import { EnumInput, FileInput, NumberInput, OptionInput, QtyInput, TextInput } from "@/components/ui/Input";
import { H1 } from "@/components/ui/Text";

export default function FormProduct({id = null}) {
    return (
    <div className="bg-white rounded-lg p-12 w-[1200px] h-[760px] mx-auto flex items-center">
        <div className="w-full">
            <H1 className={`text-4xl mb-8`}>Add product</H1>
            <form className="flex flex-col gap-8">
                <div className="flex flex-row justify-between gap-8">
                    <div className="flex flex-col gap-12 w-[400px]">
                        <div className="flex flex-col gap-4">
                            <label className="text-sky-950 text-xl font-bold">Product Name</label>
                            <TextInput placeholder={`Enter product name`} inputClassName={`h-[60px] rounded-4xl`}/>
                        </div>
                        <div className="flex flex-col gap-4">
                            <label className="text-sky-950 text-xl font-bold">Product Category</label>
                            <OptionInput placeholder={`Select category`} inputClassName={`h-[60px]`} />
                        </div>
                        <div className="flex flex-col gap-4">
                            <label className="text-sky-950 text-xl font-bold">Unit Category</label>
                            <OptionInput placeholder={`Select unit`} inputClassName={`h-[60px]`} />
                        </div>
                    </div>
                    <div className="flex flex-col gap-12 w-[400px]">
                        <div className="flex flex-col gap-4">
                            <label className="text-sky-950 text-xl font-bold">Price</label>
                            <NumberInput placeholder={`Enter price`} inputClassName={`h-[60px] rounded-4xl`} />
                        </div>
                        <div className="flex flex-col gap-4">
                            <label className="text-sky-950 text-xl font-bold">Quantity</label>
                            <QtyInput inputClassName={`h-[60px]`} />
                        </div>
                        <div className="flex flex-col gap-4">
                            <label className="text-sky-950 text-xl font-bold">Product Image</label>
                            <FileInput name={`productImage`} inputClassName={`h-[60px]`} />
                        </div>
                    </div>
                </div>
                <div className="flex flex-row gap-4 justify-end pt-4">
                    <Button variant="danger" className="text-lg font-thin rounded-4xl px-6">Clear</Button>
                    <Button variant="success" className="text-lg font-thin rounded-4xl px-6">Submit</Button>
                </div>
            </form>
        </div>
    </div>
    );
};
