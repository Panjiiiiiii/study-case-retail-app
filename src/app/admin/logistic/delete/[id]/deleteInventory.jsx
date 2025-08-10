import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { P } from "@/components/ui/Text";
import toast from "react-hot-toast";
import { deleteInventory } from "@/app/action/inventory";

export default function DeleteInventory({ id, onDelete, onCancel }) {
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async () => {
        try {
            setIsDeleting(true);
            await deleteInventory(id); // Server Action
            toast.success("Inventory successfully deleted");
            if (onDelete) onDelete(); // Update list & tutup modal
        } catch (error) {
            toast.error("Failed to delete inventory");
        } finally {
            setIsDeleting(false);
        }
    };

    const handleCancel = () => {
        if (onCancel) onCancel(); // Tutup modal tanpa delete
    };

    return (
        <div className="flex flex-col gap-8 w-full h-full justify-center items-center">
            <P className="font-semibold">
                Are you sure you want to delete this inventory?
            </P>
            <div className="flex flex-row gap-4">
                <Button
                    variant="default"
                    className="rounded-4xl px-6 py-2"
                    onClick={handleCancel}
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
