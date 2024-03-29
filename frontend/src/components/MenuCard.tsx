import { useNavigate } from "react-router-dom";

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type MenuCardProps = {
    item: string;
    mediumPrice: number;
    disabled?: boolean;
    largePrice?: number;
    className?: string;
};

const MenuCard = ({
    item,
    mediumPrice,
    largePrice,
    className,
    disabled,
}: MenuCardProps) => {
    const navigate = useNavigate();

    return (
        <Card className={className}>
            <CardHeader>
                <CardTitle>{item}</CardTitle>
            </CardHeader>
            <CardContent>
                <CardDescription>Medium Price: ¥{mediumPrice}</CardDescription>
                {largePrice && (
                    <CardDescription>
                        Large Price: ¥{largePrice}
                    </CardDescription>
                )}
            </CardContent>
            <CardFooter>
                <Button
                    variant="default"
                    disabled={disabled}
                    onClick={() => navigate(`./order#name=${item}`)}
                >
                    Order
                </Button>
            </CardFooter>
        </Card>
    );
};

export default MenuCard;
