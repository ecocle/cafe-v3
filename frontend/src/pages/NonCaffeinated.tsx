import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import MenuCard from "@/components/MenuCard";
import Loading from "@/components/Loading";

const baseUrl =
    process.env.NODE_ENV === "production" ? "" : "http://localhost:5000";

type NonCaffeinatedList = {
    Name: string;
    Price: number;
};

const NonCaffeinated = () => {
    const [nonCaffeinatedList, setNonCaffeinatedList] = useState<
        NonCaffeinatedList[]
    >([]);
    const navigate = useNavigate();
    const token = Cookies.get("token");
    const [loading, isLoading] = useState(true);

    useEffect(() => {
        if (!token) {
            navigate("/not-authorized");
        }
    });

    useEffect(() => {
        fetch(`${baseUrl}/api/dataNonCaffeinated`)
            .then((response) => response.json())
            .then((data: { name: string; price: number }[]) => {
                const formattedData: NonCaffeinatedList[] = data.map(
                    (item) => ({
                        Name: item.name,
                        Price: item.price,
                    }),
                );
                isLoading(false);
                setNonCaffeinatedList(formattedData);
            })
            .catch((error) => {
                throw new Error(error);
            });
    }, []);

    function renderMenuCard() {
        return nonCaffeinatedList.map((nonCaffeinatedItem, index) => {
            const price = nonCaffeinatedItem.Price;
            const largePrice = price + 3;

            return (
                <MenuCard
                    className="basis-11/12 lg:basis-1/6 md:basis-1/4 whitespace-nowrap"
                    key={`menucard-${index}`}
                    item={nonCaffeinatedItem.Name}
                    mediumPrice={price}
                    largePrice={largePrice}
                />
            );
        });
    }

    return (
        <div className="w-full h-full lg:h-2/3 mt-8 lg:mt-0 md:mt-0 md:h-5/6 flex flex-col items-center">
            {loading ? (
                <Loading message="Fetching non caffeinated drinks..." />
            ) : (
                <div className="lg:w-5/6 flex flex-wrap gap-4 justify-center">
                    {renderMenuCard()}
                </div>
            )}
        </div>
    );
};

export default NonCaffeinated;
