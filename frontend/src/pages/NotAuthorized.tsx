import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const NotAuthorized = () => {
    const navigate = useNavigate();

    return (
        <div className="flex flex-col items-center justify-center">
            <div className="flex flex-col items-center space-y-4">
                <h1 className="text-4xl font-bold">Not Authorized</h1>
                <p className="text-lg text-center">
                    You are not authorized to view this page.
                </p>
                <div className="space-x-4">
                    <Button
                        className="w-36 font-semibold text-lg"
                        onClick={() => navigate("/")}
                    >
                        Go back home
                    </Button>
                    <Button
                        className="w-36 font-semibold text-lg"
                        onClick={() => navigate("/sign-in")}
                    >
                        Sign In
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default NotAuthorized;
