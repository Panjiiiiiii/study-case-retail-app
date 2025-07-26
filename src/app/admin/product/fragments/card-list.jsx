import MenuCard from "../../components/card";

export default function CardList() {
    // Data dummy untuk sementara
    const products = [
        {
            id: 1,
            name: "Kecap Bango 180 ML",
            price: 20000,
            stock: 23,
            image: "/kecap.png"
        },
        {
            id: 2,
            name: "Minyak Goreng 1L",
            price: 15000,
            stock: 15,
            image: "/kecap.png"
        },
        {
            id: 3,
            name: "Gula Pasir 1KG",
            price: 12000,
            stock: 30,
            image: "/kecap.png"
        },
        {
            id: 4,
            name: "Beras Premium 5KG",
            price: 65000,
            stock: 8,
            image: "/kecap.png"
        },
        {
            id: 5,
            name: "Tepung Terigu 1KG",
            price: 8000,
            stock: 20,
            image: "/kecap.png"
        },
        {
            id: 6,
            name: "Susu UHT 1L",
            price: 18000,
            stock: 12,
            image: "/kecap.png"
        },
        {
            id: 7,
            name: "Kecap Manis 250 ML",
            price: 10000,
            stock: 25,
            image: "/kecap.png"
        },
        {
            id: 8,
            name: "Saus Sambal 200 ML",
            price: 12000,
            stock: 18,
            image: "/kecap.png"
        },
        {
            id: 9,
            name: "Bubuk Kopi 100G",
            price: 25000,
            stock: 10,
            image: "/kecap.png"
        },
        {
            id: 10,
            name: "Teh Celup 25 Sachet",
            price: 15000,
            stock: 22,
            image: "/kecap.png"
        }
    ];

    return (
        <>
        <section>
            <div className="grid grid-cols-5 gap-x-[56px] gap-y-[56px] pb-8">
                {products.map((product) => (
                    <MenuCard 
                        key={product.id}
                        product={product}
                    />
                ))}
            </div>
        </section>
        </>
    );
};
