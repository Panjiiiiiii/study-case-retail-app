"use client";

import { useActionState } from "react";
import { updateProduct } from "@/app/action/product";
import { getAllCategories } from "@/app/action/category";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/Button";
import { EnumInput, FileInput, NumberInput, QtyInput, TextInput } from "@/components/ui/Input";
import { H1 } from "@/components/ui/Text";

import { useEffect, useRef, useState, useTransition } from "react";
import { toast } from "react-hot-toast";

export default function FormProduct({ id, initialData = {} }) {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const formRef = useRef(null);
  const fileRef = useRef(null);

  const initialState = { success: null, message: "" };
  const [state, formAction] = useActionState(updateProduct, initialState);

  // controlled states for form inputs
  const [name, setName] = useState("");
  const [price, setPrice] = useState(0);
  const [stock, setStock] = useState(0);
  const [categoryId, setCategoryId] = useState("");

  // load input values from initialData
  useEffect(() => {
    if (initialData) {
      setName(initialData.name || "");
      setPrice(initialData.price || 0);
      setStock(initialData.stock || 0);
      setCategoryId(initialData.categoryId || "");
    }
  }, [initialData]);

  // fetch categories
  useEffect(() => {
    const fetchOptions = async () => {
      const res = await getAllCategories();
      if (res.success) {
        setCategories(res.data.map((c) => ({ value: c.id, label: c.name })));
      } else {
        toast.error(res.message || "Failed to load categories");
      }
      setLoading(false);
    };
    fetchOptions();
  }, []);

  // handle form result
  useEffect(() => {
    if (state.success === true) {
      toast.success(state.message || "Product successfully saved");
      handleClear();
      router.push("/admin/product");
    } else if (state.success === false) {
      toast.error(state.message || "Failed to save product");
    }
  }, [state]);

  // clear all input
  const handleClear = () => {
    setName("");
    setPrice(0);
    setStock(0);
    setCategoryId("");
    if (formRef.current) formRef.current.reset();
    if (fileRef.current) fileRef.current.value = null;
  };

  const handleCategoryChange = (val) => {
    setCategoryId(val);
  };

  return (
    <div className="bg-white rounded-lg p-12 w-[1200px] h-[760px] mx-auto flex items-center">
      <div className="w-full">
        <H1 className="text-4xl mb-8">{id ? "Edit Product" : "Add Product"}</H1>

        <form
          ref={formRef}
          className="flex flex-col gap-8"
          action={formAction}
        >
          <div className="flex flex-row justify-between gap-8">
            {/* Column 1 */}
            <div className="flex flex-col gap-12 w-[400px]">
              {/* Name */}
              <div className="flex flex-col gap-4">
                <label className="text-sky-950 text-xl font-bold">Product Name</label>
                <TextInput
                  name="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter product name"
                  inputClassName="h-[60px] rounded-4xl"
                />
              </div>

              {/* Category */}
              <div className="flex flex-col gap-4">
                <label className="text-sky-950 text-xl font-bold">Product Category</label>
                {loading ? (
                  <div className="h-[60px] bg-gray-100 flex items-center justify-center rounded-full border-2 border-sky-950">
                    Loading categories...
                  </div>
                ) : (
                  <EnumInput
                    name="categoryId"
                    options={categories}
                    value={categoryId}
                    onChange={handleCategoryChange}
                    inputClassName="h-[60px]"
                    placeholder="Select category"
                  />
                )}
              </div>

              {/* Price */}
              <div className="flex flex-col gap-4">
                <label className="text-sky-950 text-xl font-bold">Price</label>
                <NumberInput
                  name="price"
                  value={price}
                  onChange={(e) => setPrice(Number(e.target.value))}
                  placeholder="Enter price"
                  inputClassName="h-[60px] rounded-4xl"
                />
              </div>

              {/* Hidden id */}
              {id && <input type="hidden" name="id" value={id} />}
            </div>

            {/* Column 2 */}
            <div className="flex flex-col gap-12 w-[400px]">
              {/* Stock */}
              <div className="flex flex-col gap-4">
                <label className="text-sky-950 text-xl font-bold">Stock</label>
                <QtyInput
                  name="stock"
                  value={stock}
                  onChange={(e) => setStock(Number(e.target.value))}
                  inputClassName="h-[60px]"
                />
              </div>

              {/* Image */}
              <div className="flex flex-col gap-4">
                <label className="text-sky-950 text-xl font-bold">Image</label>

                {/* Kirim nama file dari Cloudinary ke server (jika user tidak upload baru) */}
                {initialData?.imageUrl && (
                  <input
                    type="hidden"
                    name="imageFilename"
                    value={initialData.imageUrl.split("/").pop()}
                  />
                )}

                {/* Input file (boleh diisi atau tidak) */}
                <FileInput
                  name="image"
                  accept="image/*"
                  inputRef={fileRef}
                  inputClassName="h-[60px]"
                />
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-row gap-4 justify-end pt-4">
            <Button
              type="button"
              variant="danger"
              onClick={handleClear}
              disabled={isPending}
              className="rounded-4xl text-lg font-thin"
            >
              Clear
            </Button>
            <Button
              type="submit"
              variant="success"
              disabled={isPending}
              className="rounded-4xl text-lg font-thin"
            >
              {isPending ? "Submitting..." : "Submit"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
