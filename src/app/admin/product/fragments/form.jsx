"use client";

import { useActionState } from "react";
import { createProduct } from "@/app/action/product";
import { getAllCategories } from "@/app/action/category";
import { getAllUnits } from "@/app/action/unit";

import { Button } from "@/components/ui/Button";
import { EnumInput, FileInput, NumberInput, QtyInput, TextInput } from "@/components/ui/Input";
import { H1 } from "@/components/ui/Text";

import { useEffect, useRef, useState, useTransition } from "react";
import { toast } from "react-hot-toast";

export default function FormProduct() {
  const [categories, setCategories] = useState([]);
  const [units, setUnits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isPending, startTransition] = useTransition();

  const formRef = useRef(null);
  const fileRef = useRef(null);

  const initialState = { success: null, message: "" };
  const [state, formAction] = useActionState(createProduct, initialState);

  useEffect(() => {
    const fetchOptions = async () => {
      const [catRes, unitRes] = await Promise.all([getAllCategories(), getAllUnits()]);
      if (catRes.success) {
        setCategories(catRes.data.map((c) => ({ value: c.id, label: c.name })));
      }
      if (unitRes.success) {
        setUnits(unitRes.data.map((u) => ({ value: u.id, label: u.unit_type })));
      }
      setLoading(false);
    };
    fetchOptions();
  }, []);

  useEffect(() => {
    if (state.success === true) {
      toast.success(state.message || "Product successfully added");
      if (formRef.current) formRef.current.reset();
      if (fileRef.current) fileRef.current.value = null;
    } else if (state.success === false) {
      toast.error(state.message || "Failed to add product");
    }
  }, [state]);
  
  const handleClear = () => {
    if (formRef.current) formRef.current.reset();
    if (fileRef.current) fileRef.current.value = null;
  };

  return (
    <div className="bg-white rounded-lg p-12 w-[1200px] h-[760px] mx-auto flex items-center">
      <div className="w-full">
        <H1 className="text-4xl mb-8">Add product</H1>
        <form
          ref={formRef}
          className="flex flex-col gap-8"
          action={(formData) => startTransition(() => formAction(formData))}
        >
          <div className="flex flex-row justify-between gap-8">
            <div className="flex flex-col gap-12 w-[400px]">
              <div className="flex flex-col gap-4">
                <label className="text-sky-950 text-xl font-bold">Product Name</label>
                <TextInput name="name" placeholder="Enter product name" inputClassName="h-[60px] rounded-4xl" />
              </div>
              <div className="flex flex-col gap-4">
                <label className="text-sky-950 text-xl font-bold">Product Category</label>
                {loading ? (
                  <div className="h-[60px] bg-gray-100 flex items-center justify-center rounded-full border-2 border-sky-950">
                    Loading categories...
                  </div>
                ) : (
                  <EnumInput name="categoryId" inputClassName="h-[60px]" options={categories} />
                )}
              </div>
              <div className="flex flex-col gap-4">
                <label className="text-sky-950 text-xl font-bold">Unit</label>
                {loading ? (
                  <div className="h-[60px] bg-gray-100 flex items-center justify-center rounded-full border-2 border-sky-950">
                    Loading units...
                  </div>
                ) : (
                  <EnumInput name="unitId" inputClassName="h-[60px]" options={units} />
                )}
              </div>
            </div>

            <div className="flex flex-col gap-12 w-[400px]">
              <div className="flex flex-col gap-4">
                <label className="text-sky-950 text-xl font-bold">Price</label>
                <NumberInput name="price" placeholder="Enter price" inputClassName="h-[60px] rounded-4xl" />
              </div>
              <div className="flex flex-col gap-4">
                <label className="text-sky-950 text-xl font-bold">Stock</label>
                <QtyInput name="stock" inputClassName="h-[60px]" />
              </div>
              <div className="flex flex-col gap-4">
                <label className="text-sky-950 text-xl font-bold">Image</label>
                <FileInput name="image" file="image/*" inputRef={fileRef} inputClassName="h-[60px]" />
              </div>
            </div>
          </div>

          <div className="flex flex-row gap-4 justify-end pt-4">
            <Button type="button" variant="danger" onClick={handleClear} disabled={isPending} className={`rounded-4xl text-lg font-thin`}>
              Clear
            </Button>
            <Button type="submit" variant="success" disabled={isPending} className={`rounded-4xl text-lg font-thin`}>
              {isPending ? "Submitting..." : "Submit"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
