import FormProduct from "./fragments/form";
import { getProductById } from "@/app/action/product";

export default async function Page({ params }) {
    const { id } = await params;

    const productData = await getProductById(id);
    console.log("Product Data:", productData);
        
    return (
        <div className="flex justify-center items-center h-screen py-12">
            <FormProduct id={id} initialData={productData.data} />
        </div>
    );
}
