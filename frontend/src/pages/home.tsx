import { ModeToggle } from "@/components/ModeToggle";
import { Button } from "@/components/ui/button";

type OrderButtonProps = {
    children: React.ReactNode;
};

const OrderButton: React.FC<OrderButtonProps> = ({ children }) => {
    return (
        <Button className="text-2xl mt-12 p-10 w-64 lg:w-auto md:w-auto lg:text-4xl md:text-3xl">
            {children}
        </Button>
    );
};

const Home = () => {
    return (
        <div className="flex flex-col h-full w-full">
            <div className="flex flex-row justify-end m-2">
                <ModeToggle />
            </div>
            <div className="flex flex-col items-center space-y-6 mt-32 w-full">
                <h1 className="font-pacifico text-8xl font-bold">MY Cafe</h1>
                <div className="flex flex-row space-x-12">
                    <OrderButton>Coffee</OrderButton>
                    <OrderButton>Non-caffenated Drinks</OrderButton>
                    <OrderButton>Breakfast</OrderButton>
                </div>
            </div>
        </div>
    );
};

export default Home;
