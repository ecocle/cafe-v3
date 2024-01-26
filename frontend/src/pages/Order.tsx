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
};

const Order = ({ itemType }: { itemType: string }) => {
    const hashParams = new URLSearchParams(window.location.hash.substr(1));
    const itemName = hashParams.get("name") ?? "";
    const [itemPrice, setItemPrice] = useState(0);
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
    const noLargeItems = [
        "Crispy cereal in milk(classic)",
        "Crispy cereal in milk(honey)",
        "Crispy cereal in milk(choco)",
        "Classic flavoured Porridge",
        "Chocolate flavoured Porridge",
    ];
    const toppings = [
        { name: "Oat Milk Substitution", price: 1.0, isDisabled: false },
        { name: "Boba", price: 1.0, isDisabled: false },
        { name: "Extra Espresso Shot", price: 2.0, isDisabled: true },
        { name: "Red Bean", price: 1.0, isDisabled: false },
    ];
    const noToppingsItems = [
        "Crispy cereal in milk(classic)",
        "Crispy cereal in milk(honey)",
        "Crispy cereal in milk(choco)",
        "Classic flavoured Porridge",
        "Chocolate flavoured Porridge",
    ];
    const noHotItems = [
        "Crispy cereal in milk(classic)",
        "Crispy cereal in milk(honey)",
        "Crispy cereal in milk(choco)",
        "Cocoa",
        "Matcha milk",
        "Matcha boba",
        "Tai Red Tea",
        "Coconut Water",
        "Milk tea",
        "Jasmine Milktea",
        "Boba",
        "Refreshing babyblue drink",
        "Pure milk",
        "Black currant oolang tea",
    ];
    const noColdItems = [
        "Classic flavoured Porridge",
        "Chocolate flavoured Porridge",
    ];
    const noNormalItems = [
        "Crispy cereal in milk(classic)",
        "Crispy cereal in milk(honey)",
        "Crispy cereal in milk(choco)",
        "Classic flavoured Porridge",
        "Chocolate flavoured Porridge",
    ];
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
                    setItemPrice(data[0].price);
                } else {
                    console.error("Error fetching drink details:", data.error);
                    setIsInvalidDrink(true);
                }
            } catch (error) {
                console.error("Error fetching drink details:", error);
                setIsInvalidDrink(true);
            }
        };

        fetchItemDetails().then(() => setIsLoadingBack(false));
    }, [itemName, itemType, setItemPrice]);

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
    });

    useEffect(() => {
        setOptions((prevOptions) => ({ ...prevOptions, total: itemPrice }));
    }, [itemPrice]);

    const handleSizeChange = (newValue: string | undefined, field: any) => {
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
            balance: userData.balance - finalTotal,
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
                                                        disabled={noLargeItems.includes(
                                                            itemName,
                                                        )}
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
                                                        disabled={noHotItems.includes(
                                                            itemName,
                                                        )}
                                                    >
                                                        Hot
                                                    </SelectItem>
                                                    <SelectItem
                                                        value="Normal"
                                                        disabled={noNormalItems.includes(
                                                            itemName,
                                                        )}
                                                    >
                                                        Normal
                                                    </SelectItem>
                                                    <SelectItem
                                                        value="Cold"
                                                        disabled={noColdItems.includes(
                                                            itemName,
                                                        )}
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
                                                    noToppingsItems.includes(
                                                        itemName,
                                                    )
                                                        ? "text-opacity-50 text-muted-foreground"
                                                        : ""
                                                }`}
                                            >
                                                Toppings
                                            </CardTitle>
                                            <FormDescription>
                                                Select the toppings you want.
                                            </FormDescription>
                                            {toppings.map((topping) => (
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
                                                                            topping.isDisabled ||
                                                                            (noToppingsItems.includes(
                                                                                itemName,
                                                                            ) &&
                                                                                topping.name !==
                                                                                    "Extra Espresso Shot")
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
                                            ))}
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
