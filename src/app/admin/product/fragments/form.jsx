import { Button } from "@/components/ui/Button";
import { EnumInput, FileInput, NumberInput, OptionInput, QtyInput, TextInput } from "@/components/ui/Input";
import { H1 } from "@/components/ui/Text";

export default function FormProduct({id = null}) {
    return (
        <div className="h-full bg-white rounded-lg p-12">
            <H1 className={`text-4xl mb-8`}>Add product</H1>
            <form className="flex flex-col mb-4">
                <div className="flex flex-row justify-between mb-8 gap-8">
                    <div className="flex flex-col gap-8 justify-start w-xl">
                        <TextInput label={`Product name`} placeholder={`Enter product name`} className={`w-[400px]`}/>
                        <OptionInput label={`Product Category`} placeholder={`Select category`} className={`w-[400px]`}/>
                        <OptionInput label={`Unit Category`} placeholder={`Select category`} className={`w-[400px]`}/>
                    </div>
                    <div className="flex flex-col gap-8 justify-start w-xl">
                        <NumberInput label={`Price`} placeholder={`Enter price`} className={`w-[400px]`} />
                        <QtyInput label={`Quantity`} className={`w-[240px]`} />
                        <FileInput label={`Product Image`} name={`productImage`} className={`w-[400px]`} />
                    </div>
                </div>
                <div className="flex flex-row gap-4 justify-end">
                    <Button variant="danger" className={`text-lg font-thin rounded-4xl`}>Clear</Button>
                    <Button variant="success" className={`text-lg font-thin rounded-4xl`}>Submit</Button>
                </div>
            </form>

        </div>
    );
};
