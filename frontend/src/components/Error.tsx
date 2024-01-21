import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Loader2 } from "lucide-react";

type ErrorProps = {
    message: string;
    className?: string;
};

const Error = ({ message, className }: ErrorProps) => {
    const [isLoadingRetry, setIsLoadingRetry] = useState(false);

    const onRetry = () => {
        setIsLoadingRetry(true);
        window.location.reload();
    };

    return (
        <div className={`flex flex-col h-full justify-center ${className}`}>
            <p className="text-2xl font-semibold mt-4">{message}</p>
            <Button
                className="mt-4"
                onClick={onRetry}
                disabled={isLoadingRetry}
            >
                {isLoadingRetry ? (
                    <div>
                        <div className="animate-spin">
                            <Loader2 />
                        </div>
                    </div>
                ) : (
                    <span>Retry</span>
                )}
            </Button>
        </div>
    );
};

export default Error;
