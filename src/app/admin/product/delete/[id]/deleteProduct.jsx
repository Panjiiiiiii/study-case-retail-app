import { useState } from "react";
import { deleteProduct } from "@/app/action/product";
import { Button } from "@/components/ui/Button";
import { P } from "@/components/ui/Text";
import toast from "react-hot-toast";

export default function DeleteProduct({ id, onDelete }) {
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async () => {
        try {
            setIsDeleting(true);
            await deleteProduct(id); // Server Action
            toast.success("Product successfully deleted");

            if (onDelete) onDelete(); // Tutup modal & update list
        } catch (error) {
            toast.error("Failed to delete product");
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <div className="flex flex-col gap-8 w-full h-full justify-center items-center">
            <P className="font-semibold">
                Are you sure you want to delete this product?
            </P>
            <div className="flex flex-row gap-4">
                <Button
                    variant="default"
                    className="rounded-4xl px-6 py-2"
                    onClick={onDelete}
                    disabled={isDeleting}
                >
                    Cancel
                </Button>
                <Button
                    variant="danger"
                    className="bg-red-600 rounded-4xl px-6 py-2"
                    onClick={handleDelete}
                    disabled={isDeleting}
                >
                    {isDeleting ? "Deleting..." : "Delete"}
                </Button>
            </div>
        </div>
    );
}
