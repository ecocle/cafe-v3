import { useEffect, useState } from "react";
import Loading from "@/components/Loading";
import Error from "@/components/Error";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { Loader2 } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { FieldValues, useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";

const baseUrl =
    process.env.NODE_ENV === "production" ? "" : "http://localhost:5000";

const FormSchema = z.object({
    size: z.string().min(1, {
        message: "Size is required.",
    }),
    temperature: z.string().min(1, {
        message: "Temperature is required.",
    }),
    toppings: z.array(z.string()).optional(),
    useCup: z.boolean().optional(),
    comments: z.string().optional(),
});

type Topping = {
    name: string;
    price: number;
    disabled: boolean;
};

type ItemDetails = {
    price: number;
    hot: boolean;
    normal: boolean;
    cold: boolean;
    large: boolean;
    toppings: boolean;
};

const Order = ({ itemType }: { itemType: string }) => {
    const hashParams = new URLSearchParams(window.location.hash.substr(1));
    const itemName = hashParams.get("name") ?? "";
    const [itemDetails, setItemDetails] = useState<ItemDetails>({
        price: 0,
        hot: false,
        normal: false,
        cold: false,
        large: false,
        toppings: false,
    });
    const [toppings, setToppings] = useState<Topping[]>([
        { name: "", price: 0, disabled: false },
    ]);
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingBack, setIsLoadingBack] = useState(true);
    const token = Cookies.get("token");
    const [hasPriceError, setHasPriceError] = useState(false);
    const [isInvalidDrink, setIsInvalidDrink] = useState(false);
    const form = useForm({
        resolver: zodResolver(FormSchema),
    });
    const [options, setOptions] = useState({
        size: "",
        total: 0,
    });
    const [userData, setUserData] = useState({
        balance: 0,
        id: 0,
        username: "",
        firstName: "",
        lastName: "",
    });

    const navigate = useNavigate();

    useEffect(() => {
        if (!token) {
            navigate("/not-authorized");
        }
    });

    useEffect(() => {
        const fetchItemDetails = async () => {
            try {
                const response = await fetch(
                    `${baseUrl}/api/itemData/${itemType}/${itemName}`,
                );
                const data = await response.json();

                if (response.ok) {
                    const convertedData = {
                        price: data[0].price,
                        hot: !!data[0].hot,
                        normal: !!data[0].normal,
                        cold: !!data[0].cold,
                        large: !!data[0].large,
                        toppings: !!data[0].toppings,
                    };

                    setItemDetails(convertedData);
                } else {
                    console.error("Error fetching drink details:", data.error);
                    setIsInvalidDrink(true);
                }
            } catch (error) {
                console.error("Error fetching drink details:", error);
                setIsInvalidDrink(true);
            }
        };

        fetchItemDetails();
    }, [itemName, itemType]);

    useEffect(() => {
        const fetchToppings = async () => {
            try {
                const response = await fetch(`${baseUrl}/api/toppings`);
                const data = await response.json();

                if (response.ok) {
                    const convertedData = data.map((topping: Topping) => ({
                        name: topping.name,
                        price: topping.price,
                        disabled: !!topping.disabled,
                    }));

                    setToppings(convertedData);
                } else {
                    console.error("Error fetching toppings:", data.error);
                }
            } catch (error) {
                console.error("Error fetching toppings:", error);
            }
        };

        fetchToppings().then(() => setIsLoadingBack(false));
    }, []);

    useEffect(() => {
        fetch(`${baseUrl}/api/userData`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            credentials: "include",
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.username) {
                    setUserData(data);
                }
            })
            .catch((error) => console.error("Error:", error));
    }, [token]);

    useEffect(() => {
        setOptions((prevOptions) => ({
            ...prevOptions,
            total: itemDetails.price,
        }));
    }, [itemDetails]);

    const handleSizeChange = (newValue: string, field: any) => {
        field.onChange(newValue);

        setOptions((prevOptions) => {
            const currentSize = prevOptions.size;
            const newSize = newValue ?? undefined;

            let newTotal = prevOptions.total;

            if (currentSize === "Medium" && newSize === "Large") {
                newTotal += 3;
            } else if (!currentSize && newSize === "Large") {
                newTotal += 3;
            } else if (currentSize === "Large" && newSize === "Medium") {
                newTotal -= 3;
            }

            return {
                ...prevOptions,
                total: newTotal,
                size: newSize,
            };
        });
    };

    const handleToppingChange = (
        checked: boolean,
        field: any,
        topping: Topping,
    ) => {
        const fieldValue = Array.isArray(field.value) ? field.value : [];
        let newPrice = options.total;

        if (checked) {
            field.onChange([...fieldValue, topping.name]);
            newPrice += topping.price;
        } else {
            field.onChange(
                fieldValue.filter((value: string) => value !== topping.name),
            );
            newPrice -= topping.price;
        }

        setOptions((prevOptions) => ({ ...prevOptions, total: newPrice }));
    };

    const handleUseCupChange = (checked: boolean, field: any) => {
        field.onChange(checked);

        let newPrice = options.total;

        if (checked) {
            newPrice -= 1;
        } else {
            newPrice += 1;
        }

        setOptions((prevOptions) => ({ ...prevOptions, total: newPrice }));
    };

    const onSubmit = async (value: FieldValues) => {
        const finalTotal = options.total;

        if (userData.balance < finalTotal) {
            setHasPriceError(true);
            return;
        }

        setIsLoading(true);

        const orderDetails = {
            firstName: userData.firstName,
            lastName: userData.lastName,
            name: itemName,
            temperature: value.temperature,
            selectedSize: value.size,
            selectedToppings: value.toppings,
            price: finalTotal,
            comments: value.comments,
            useCup: value.useCup,
        };

        try {
            const response = await fetch(`${baseUrl}/api/order`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(orderDetails),
            });

            if (!response.ok) {
                console.error("Error placing order");
                setIsLoading(false);
            }

            navigate("/");
            setIsLoading(false);
        } catch (error) {
            console.error("Error placing order:", error);
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-full w-full justify-center items-center">
            {isLoadingBack ? (
                <Loading message="Fetching drink details..." />
            ) : isInvalidDrink ? (
                <Error message="Timed out while fetching drink details" />
            ) : (
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-4 flex flex-col w-full max-w-md p-8"
                    >
                        <Card>
                            <CardHeader>
                                <CardTitle>Order Details</CardTitle>
                                <CardDescription>
                                    Select the size and temperature of your
                                    drink.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-2 md:space-y-3 lg:space-y-4">
                                <FormField
                                    control={form.control}
                                    name="size"
                                    render={({ field }) => (
                                        <FormItem>
                                            <Select
                                                {...field}
                                                onValueChange={(newValue) =>
                                                    handleSizeChange(
                                                        newValue,
                                                        field,
                                                    )
                                                }
                                            >
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select a size" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="Medium">
                                                        Medium
                                                    </SelectItem>
                                                    <SelectItem
                                                        value="Large"
                                                        disabled={
                                                            !itemDetails.large
                                                        }
                                                    >
                                                        Large
                                                    </SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="temperature"
                                    render={({ field }) => (
                                        <FormItem>
                                            <Select
                                                {...field}
                                                onValueChange={(newValue) =>
                                                    field.onChange(newValue)
                                                }
                                            >
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select a temperature" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem
                                                        value="Hot"
                                                        disabled={
                                                            !itemDetails.hot
                                                        }
                                                    >
                                                        Hot
                                                    </SelectItem>
                                                    <SelectItem
                                                        value="Normal"
                                                        disabled={
                                                            !itemDetails.normal
                                                        }
                                                    >
                                                        Normal
                                                    </SelectItem>
                                                    <SelectItem
                                                        value="Cold"
                                                        disabled={
                                                            !itemDetails.cold
                                                        }
                                                    >
                                                        Cold
                                                    </SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="toppings"
                                    render={() => (
                                        <FormItem>
                                            <CardTitle
                                                className={`${
                                                    !itemDetails.toppings
                                                        ? "text-opacity-50 text-muted-foreground"
                                                        : ""
                                                }`}
                                            >
                                                Toppings
                                            </CardTitle>
                                            <FormDescription>
                                                Select the toppings you want.
                                            </FormDescription>
                                            {toppings.map(
                                                (topping: Topping) => (
                                                    <FormField
                                                        key={topping.name}
                                                        control={form.control}
                                                        name="toppings"
                                                        render={({ field }) => {
                                                            return (
                                                                <FormItem
                                                                    key={
                                                                        topping.name
                                                                    }
                                                                    className="flex flex-row items-start space-x-3 space-y-0"
                                                                >
                                                                    <FormControl>
                                                                        <Checkbox
                                                                            id={
                                                                                topping.name
                                                                            }
                                                                            disabled={
                                                                                topping.disabled ||
                                                                                !itemDetails.toppings
                                                                            }
                                                                            checked={
                                                                                !!(
                                                                                    field.value as string[]
                                                                                )?.includes(
                                                                                    topping.name,
                                                                                )
                                                                            }
                                                                            onCheckedChange={(
                                                                                checked,
                                                                            ) =>
                                                                                handleToppingChange(
                                                                                    typeof checked ===
                                                                                        "boolean"
                                                                                        ? checked
                                                                                        : false,
                                                                                    field,
                                                                                    topping,
                                                                                )
                                                                            }
                                                                        />
                                                                    </FormControl>
                                                                    <FormLabel
                                                                        htmlFor={
                                                                            topping.name
                                                                        }
                                                                        className="text-sm font-base leading-4 cursor-pointer peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                                                    >
                                                                        {
                                                                            topping.name
                                                                        }
                                                                        {" ¥"}
                                                                        {
                                                                            topping.price
                                                                        }
                                                                    </FormLabel>
                                                                </FormItem>
                                                            );
                                                        }}
                                                    />
                                                ),
                                            )}
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <div className="space-y-2">
                                    <CardTitle>Information</CardTitle>
                                    <CardDescription>
                                        Enter any additional information for
                                        your order.
                                    </CardDescription>
                                </div>
                                <FormField
                                    control={form.control}
                                    name="comments"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Comments</FormLabel>
                                            <FormControl>
                                                <Textarea {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="useCup"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormControl>
                                                <Checkbox
                                                    id="useCup"
                                                    onCheckedChange={(
                                                        checked,
                                                    ) =>
                                                        handleUseCupChange(
                                                            typeof checked ===
                                                                "boolean"
                                                                ? checked
                                                                : false,
                                                            field,
                                                        )
                                                    }
                                                />
                                            </FormControl>
                                            <FormLabel className="text-base leading-4 ml-2">
                                                Use own cup
                                            </FormLabel>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </CardContent>
                            <CardFooter className="space-x-4">
                                <CardTitle>Total: ¥{options.total}</CardTitle>
                                <Button disabled={isLoading} type="submit">
                                    {isLoading ? (
                                        <div className="animate-spin">
                                            <Loader2 />
                                        </div>
                                    ) : (
                                        <span>Place Order</span>
                                    )}
                                </Button>
                                {hasPriceError && (
                                    <p className="text-destructive">
                                        Not enough fund in account
                                    </p>
                                )}
                            </CardFooter>
                        </Card>
                    </form>
                </Form>
            )}
        </div>
    );
};

export default Order;
