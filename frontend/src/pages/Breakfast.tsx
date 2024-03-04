import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import MenuCard from "@/components/MenuCard";
import Loading from "@/components/Loading";

const baseUrl =
    process.env.NODE_ENV === "production" ? "" : "http://localhost:5000";

type BreakfastList = {
    Name: string;
    Price: number;
};

const Breakfast = () => {
    const [breakfastList, setBreakfastList] = useState<BreakfastList[]>([]);
    const navigate = useNavigate();
    const token = Cookies.get("token");
    const [loading, isLoading] = useState(true);

    useEffect(() => {
        console.log(token);
        if (!token) {
            navigate("/not-authorized");
        }
    });

    useEffect(() => {
        fetch(`${baseUrl}/api/dataBreakfast`)
            .then((response) => response.json())
            .then((data: { name: string; price: number }[]) => {
                const formattedData: BreakfastList[] = data.map((item) => ({
                    Name: item.name,
                    Price: item.price,
                }));
                isLoading(false);
                setBreakfastList(formattedData);
            })
            .catch((error) => {
                throw new Error(error);
            });
    }, []);

    function renderMenuCard() {
        return breakfastList.map((breakfastItem, index) => {
            const price = breakfastItem.Price;
            const largePrice = price + 3;

            return (
                <MenuCard
                    className="basis-11/12 lg:basis-1/4 md:basis-1/4 whitespace-nowrap"
                    key={`menucard-${index}`}
                    item={breakfastItem.Name}
                    mediumPrice={price}
                    largePrice={largePrice}
                />
            );
        });
    }

    return (
        <div className="w-full h-full mt-8 lg:h-3/4 lg:mt-0 md:h-3/4 md:mt-0 flex flex-col items-center">
            {loading ? (
                <Loading message="Fetching breakfasts..." />
            ) : (
                <div className="lg:w-5/6 flex flex-wrap gap-4 justify-center">
                    {renderMenuCard()}
                </div>
            )}
        </div>
    );
};

export default Breakfast;
