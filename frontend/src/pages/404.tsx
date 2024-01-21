import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
    const navigate = useNavigate();

    return (
        <div className="flex flex-col items-center justify-center">
            <div className="flex flex-col items-center space-y-4">
                <h1 className="text-4xl font-bold">Page Not Found</h1>
                <p className="text-lg text-center">
                    The page you are looking for does not exist.
                </p>
                <div>
                    <Button
                        className="w-36 font-semibold text-lg"
                        onClick={() => navigate("/")}
                    >
                        Go back home
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default NotFound;
