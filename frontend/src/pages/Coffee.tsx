import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import MenuCard from "@/components/MenuCard";
import Loading from "@/components/Loading";

const baseUrl =
    process.env.NODE_ENV === "production" ? "" : "http://localhost:5000";

type CoffeeList = {
    name: string;
    price: number;
    large: boolean;
    disabled: boolean;
};

const Coffee = () => {
    const [coffeeList, setCoffeeList] = useState<CoffeeList[]>([]);
    const navigate = useNavigate();
    const token = Cookies.get("token");
    const [loading, isLoading] = useState(true);

    useEffect(() => {
        if (!token) {
            navigate("/not-authorized");
        }
    });

    useEffect(() => {
        fetch(`${baseUrl}/api/dataCoffee`)
            .then((response) => response.json())
            .then((data: CoffeeList[]) => {
                const formattedData: CoffeeList[] = data.map((item) => ({
                    name: item.name,
                    price: item.price,
                    large: !!item.large,
                    disabled: !!item.disabled,
                }));
                isLoading(false);
                setCoffeeList(formattedData);
            })
            .catch((error) => {
                throw new Error(error);
            });
    }, []);

    function renderMenuCard() {
        return coffeeList.map((coffeeItem, index) => {
            const price = coffeeItem.price;
            const largePrice = coffeeItem.large ? price + 3 : undefined;
            return (
                <MenuCard
                    className="basis-11/12 lg:basis-1/5 md:basis-1/4 whitespace-nowrap"
                    key={`menucard-${index}`}
                    item={coffeeItem.name}
                    mediumPrice={price}
                    largePrice={largePrice}
                    disabled={coffeeItem.disabled}
                />
            );
        });
    }

    return (
        <div className="w-full h-full mt-8 lg:h-3/4 lg:mt-0 md:h-3/4 md:mt-0 flex flex-col items-center">
            {loading ? (
                <Loading message="Fetching coffee..." />
            ) : (
                <div className="lg:w-5/6 flex flex-wrap gap-4 justify-center">
                    {renderMenuCard()}
                </div>
            )}
        </div>
    );
};

export default Coffee;
