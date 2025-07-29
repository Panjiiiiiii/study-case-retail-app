"use client";
import { Button } from "@/components/ui/Button";

export default function Pagination({ currentPage, totalItems, itemsPerPage, onPageChange }) {
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  return (
    <div className="flex items-center justify-center gap-4 mt-8">
      <Button
        variant="default"
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        className="rounded-full px-6"
      >
        Prev
      </Button>
      <span className="text-sky-900 font-medium">
        Page {currentPage} of {totalPages} ({totalItems} items)
      </span>
      <Button
        variant="default"
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        className="rounded-full px-6"
      >
        Next
      </Button>
    </div>
  );
}
