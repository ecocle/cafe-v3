import { Loader2 } from "lucide-react";

type LoadingProps = {
    message: string;
    className?: string;
};

const Loading = ({ message, className }: LoadingProps) => {
    return (
        <div
            className={`flex flex-col justify-center items-center h-full ${className}`}
        >
            <div className="animate-spin">
                <Loader2 className="h-8 w-8" />
            </div>
            <p className="text-2xl font-semibold mt-4">{message}</p>
        </div>
    );
};

export default Loading;
