import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import MenuCard from "@/components/MenuCard";
import Loading from "@/components/Loading";

const baseUrl =
    process.env.NODE_ENV === "production" ? "" : "http://localhost:5000";

type BreakfastList = {
    Name: string;
    Price: string;
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
            .then((data: { Name: string; Price: number }[]) => {
                const formattedData: BreakfastList[] = data.map((item) => ({
                    Name: item.Name,
                    Price: item.Price.toString(),
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
            const price = parseFloat(breakfastItem.Price);
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
        <div className="w-full h-full lg:h-2/3 mt-8 lg:mt-0 md:mt-0 md:h-2/3 flex flex-col items-center">
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
