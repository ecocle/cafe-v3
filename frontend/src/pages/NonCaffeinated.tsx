import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import MenuCard from "@/components/MenuCard";
import Loading from "@/components/Loading";

const baseUrl =
    process.env.NODE_ENV === "production" ? "" : "http://localhost:5000";

type NonCaffeinatedList = {
    name: string;
    price: number;
    large: boolean;
    disabled: boolean;
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
            .then((data: NonCaffeinatedList[]) => {
                const formattedData: NonCaffeinatedList[] = data.map(
                    (item) => ({
                        name: item.name,
                        price: item.price,
                        large: !!item.large,
                        disabled: !!item.disabled,
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
            const price = nonCaffeinatedItem.price;
            const largePrice = nonCaffeinatedItem.large ? price + 3 : undefined;

            return (
                <MenuCard
                    className="basis-11/12 lg:basis-1/6 md:basis-1/4 whitespace-nowrap"
                    key={`menucard-${index}`}
                    item={nonCaffeinatedItem.name}
                    mediumPrice={price}
                    largePrice={largePrice}
                    disabled={nonCaffeinatedItem.disabled}
                />
            );
        });
    }

    return (
        <div className="w-full h-full mt-8 lg:h-3/4 lg:mt-0 md:h-3/4 md:mt-0 flex flex-col items-center">
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
