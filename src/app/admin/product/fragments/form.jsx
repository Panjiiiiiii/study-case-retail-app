"use client";

import { createProduct } from "@/app/action/product";
import { getAllCategories } from "@/app/action/category";
import { Button } from "@/components/ui/Button";
import { EnumInput, FileInput, NumberInput, OptionInput, QtyInput, TextInput } from "@/components/ui/Input";
import { H1 } from "@/components/ui/Text";
import { useEffect, useState } from "react";
import { getAllUnits } from "@/app/action/unit";

export default function FormProduct({id = null}) {
    const [categories, setCategories] = useState([]);
    const [units, setUnits] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const result = await getAllCategories();
                if (result.success) {
                    const categoryOptions = result.data.map(category => ({
                        value: category.id,
                        label: category.name
                    }));
                    setCategories(categoryOptions);
                } else {
                    console.error('Failed to fetch categories:', result.error);
                }
            } catch (error) {
                console.error('Error fetching categories:', error);
            } finally {
                setLoading(false);
            }
        };

        const fetchUnits = async () => {
            try {
                const result = await getAllUnits();
                if (result.success) {
                    const unitOptions = result.data.map(unit => ({
                        value: unit.id,
                        label: unit.unit_type
                    }));
                    setUnits(unitOptions);
                } else {
                    console.error('Failed to fetch units:', result.error);
                }
            } catch (error) {
                console.error('Error fetching units:', error);
            }
        };

        fetchCategories();
        fetchUnits();
    }, []);

    return (
    <div className="bg-white rounded-lg p-12 w-[1200px] h-[760px] mx-auto flex items-center">
        <div className="w-full">
            <H1 className={`text-4xl mb-8`}>Add product</H1>
            <form className="flex flex-col gap-8" action={createProduct}>
                <div className="flex flex-row justify-between gap-8">
                    <div className="flex flex-col gap-12 w-[400px]">
                        <div className="flex flex-col gap-4">
                            <label className="text-sky-950 text-xl font-bold">Product Name</label>
                            <TextInput placeholder={`Enter product name`} inputClassName={`h-[60px] rounded-4xl`} name={`name`}/>
                        </div>
                        <div className="flex flex-col gap-4">
                            <label className="text-sky-950 text-xl font-bold">Product Category</label>
                            {loading ? (
                                <div className="h-[60px] border-2 border-sky-950 rounded-full bg-gray-100 flex items-center justify-center">
                                    <span className="text-gray-500">Loading categories...</span>
                                </div>
                            ) : (
                                <EnumInput 
                                    placeholder="Select category" 
                                    inputClassName="h-[60px]" 
                                    name="categoryId"
                                    options={categories}
                                />
                            )}
                        </div>
                        <div className="flex flex-col gap-4">
                            <label className="text-sky-950 text-xl font-bold">Unit Category</label>
                            {loading ? (
                                <div className="h-[60px] border-2 border-sky-950 rounded-full bg-gray-100 flex items-center justify-center">
                                    <span className="text-gray-500">Loading units...</span>
                                </div>
                            ) : (
                                <EnumInput 
                                    placeholder="Select unit" 
                                    inputClassName="h-[60px]" 
                                    name="unitId"
                                    options={units}
                                />
                            )}                        
                        </div>
                    </div>
                    <div className="flex flex-col gap-12 w-[400px]">
                        <div className="flex flex-col gap-4">
                            <label className="text-sky-950 text-xl font-bold">Price</label>
                            <NumberInput placeholder="Enter price" inputClassName="h-[60px] rounded-4xl" name="price" />
                        </div>
                        <div className="flex flex-col gap-4">
                            <label className="text-sky-950 text-xl font-bold">Quantity</label>
                            <QtyInput inputClassName="h-[60px]" name="stock" />
                        </div>
                        <div className="flex flex-col gap-4">
                            <label className="text-sky-950 text-xl font-bold">Product Image</label>
                            <FileInput name="image" inputClassName="h-[60px]" file={`image/*`}/>
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
