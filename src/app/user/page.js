import { FaMagnifyingGlass } from "react-icons/fa6";
import CardList from "./fragments/card-list";
import { Button } from "@/components/ui/Button";
import { IoIosArrowDown } from "react-icons/io";
import { IoFilter } from "react-icons/io5";

export default function page(params) {
    return (
        <div className="flex flex-col justify-start h-full ml-[72px] py-8">
            <div className="flex flex-row items-center mb-5 gap-4">
                <div className="relative w-[520px]">
                    <input
                        type="text"
                        placeholder="Search"
                        className="w-full p-4 pr-12 rounded-full border-none focus:outline-sky-950 placeholder:text-sky-950 bg-white"
                    />
                    <FaMagnifyingGlass
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-sky-950"
                        size={20}
                    />
                </div>
                <Button className={`p-4 rounded-4xl text-sky-950 bg-white`}>
                    <div className="flex flex-row items-center gap-3">
                        <span>Category</span>
                        <IoIosArrowDown size={16}/>
                    </div>
                </Button>
                <Button className={`p-4 rounded-4xl text-sky-950 bg-white`}>
                    <div className="flex flex-row items-center gap-3">
                        <span>Filter</span>
                        <IoFilter size={16}/>
                    </div>
                </Button>
            </div>
            <CardList />
        </div>
    );
};
