import FormProduct from "../../fragments/form";

export default function Page({ params }) {
    const { id } = params;
    return (
        <div className="flex justify-center items-center h-screen py-12">
            <FormProduct id={id} />
        </div>
    );
}
