import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import dayjs from "dayjs";
import Error from "@/components/Error";
import Loading from "@/components/Loading";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
    Table,
    TableBody,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

const baseUrl =
    process.env.NODE_ENV === "production" ? "" : "http://localhost:5000";

type Order = {
    order_time: string;
    first_name: string;
    last_name: string;
    coffee_type: string;
    temperature: string;
    toppings: string | null;
    size: string;
    price: number;
    comments: string | null;
    cup: string | null;
};

type TableCellComponentProps = {
    data: string;
    children: React.ReactNode;
    className?: string;
};

type TableHeadComponentProps = {
    children: React.ReactNode;
};

type DatePickerProps = {
    date: Date | undefined;
    onDateChange: (date: Date | undefined) => void;
};

const DatePicker = ({ date, onDateChange }: DatePickerProps) => {
    const handleDateSelect = (selectedDate: Date | undefined) => {
        if (
            selectedDate &&
            date &&
            format(selectedDate, "PPP") === format(date, "PPP")
        ) {
            onDateChange(undefined);
        } else if (selectedDate) {
            onDateChange(selectedDate);
        }
    };

    const handleClearClick = () => {
        onDateChange(undefined);
    };

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    variant={"outline"}
                    className={cn(
                        "w-[280px] justify-start text-left font-normal",
                        !date && "text-muted-foreground",
                    )}
                >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : <span>Pick a date</span>}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="flex w-auto flex-col space-y-2 p-2">
                <div className="rounded-md border">
                    <Calendar
                        mode="single"
                        selected={date}
                        onSelect={handleDateSelect}
                        disabled={(date) =>
                            date > new Date() || date < new Date("2023-09-19")
                        }
                        defaultMonth={date || new Date()}
                        initialFocus
                    />
                </div>
                {date && (
                    <Button onClick={handleClearClick} className="mt-2">
                        Clear
                    </Button>
                )}
            </PopoverContent>
        </Popover>
    );
};

const ViewOrders = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const token = Cookies.get("token");
    const [isEmpty, setIsEmpty] = useState(false);
    const [date, setDate] = useState<string>("");
    const [selectedDate, setSelectedDate] = useState<Date | undefined>();
    const [id, setId] = useState("");
    const totalPrice = orders.reduce((total, order) => total + order.price, 0);

    const handleDateChange = (selectedDate: Date | undefined) => {
        setSelectedDate(selectedDate);
        if (selectedDate) {
            const formattedDate = dayjs(selectedDate).format("YYYY-MM-DD");
            setDate(formattedDate);
        } else {
            setDate("");
        }
    };

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await fetch(`${baseUrl}/api/userData`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                const data = await response.json();
                setId(data.id);
                await fetchOrderData(data.id, date);
            } catch (error: any) {
                setError(error.message);
                setLoading(false);
            }
        };

        fetchUserData();
    });

    const fetchOrderData = async (id: string, selectedDate = "") => {
        try {
            const endpoint = `${baseUrl}/api/orders`;
            const fullUrl = createFullUrl(selectedDate, endpoint);
            const rawData = await fetchData(id, fullUrl);
            setOrderData(rawData);
        } catch (error: any) {
            setError(error.message);
            console.error("Error fetching order data:", error);
        }
    };

    useEffect(() => {
        setLoading(true);
        fetchOrderData(id, date);
    }, [date, id]);

    const createFullUrl = (selectedDate: string, endpoint: string): string => {
        const params = new URLSearchParams();
        if (selectedDate) {
            params.append("date", dayjs(selectedDate).format("YYYY-MM-DD"));
        }
        return `${endpoint}?${params.toString()}`;
    };

    const fetchData = async (id: string, fullUrl: string): Promise<any> => {
        const response = await fetch(fullUrl, {
            headers: {
                Authorization: `Bearer ${token}`,
                userInformation: id,
            },
            credentials: "include",
        });
        if (!response.ok) {
            console.error("Failed to fetch data");
        }
        return await response.json();
    };

    const setOrderData = (rawData: any) => {
        const transformedData = rawData.data.map((order: any) => ({
            id: order.ID,
            order_time: order.Order_time,
            first_name: order.First_name,
            last_name: order.Last_name,
            coffee_type: order.Coffee_type,
            temperature: order.Temperature,
            toppings: order.Toppings,
            size: order.Size,
            price: parseFloat(order.Price),
            comments: order.Comments,
            cup: order.Cup,
        }));
        setIsEmpty(transformedData.length === 0);
        setOrders(transformedData);
        setLoading(false);
    };

    const TableCellComponent: React.FunctionComponent<
        TableCellComponentProps
    > = ({ data, children, className = "" }) => (
        <TableCell
            data-cell={data}
            className={`lg:table-cell md:table-cell lg:before:content-none md:before:content-none text-left before:content-[attr(data-cell)_':_'] before:font-bold block ${className}`}
        >
            {children}
        </TableCell>
    );

    const TableHeadComponent: React.FunctionComponent<
        TableHeadComponentProps
    > = ({ children }) => (
        <TableHead className="hidden lg:table-cell md:table-cell">
            {children}
        </TableHead>
    );

    return (
        <div className="flex flex-col h-full">
            {loading ? (
                <Loading message="Fetching order data..." />
            ) : error ? (
                <Error message={error} />
            ) : (
                <div>
                    <div className="flex justify-center space-x-4 m-4">
                        <DatePicker
                            date={selectedDate}
                            onDateChange={handleDateChange}
                        />
                    </div>
                    {isEmpty ? (
                        <div>
                            <span className="text-4xl font-bold flex item-center justify-center">
                                No Orders Found For This Date
                            </span>
                        </div>
                    ) : (
                        <main>
                            <Table className="bg-background mx-auto w-11/12">
                                <TableHeader>
                                    <TableRow>
                                        <TableHeadComponent>
                                            Order Time
                                        </TableHeadComponent>
                                        <TableHeadComponent>
                                            First Name
                                        </TableHeadComponent>
                                        <TableHeadComponent>
                                            Last Name
                                        </TableHeadComponent>
                                        <TableHeadComponent>
                                            Type
                                        </TableHeadComponent>
                                        <TableHeadComponent>
                                            Temperature
                                        </TableHeadComponent>
                                        <TableHeadComponent>
                                            Toppings
                                        </TableHeadComponent>
                                        <TableHeadComponent>
                                            Size
                                        </TableHeadComponent>
                                        <TableHeadComponent>
                                            Comments
                                        </TableHeadComponent>
                                        <TableHeadComponent>
                                            Price
                                        </TableHeadComponent>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {orders.map((item) => (
                                        <TableRow key={item.id}>
                                            <TableCellComponent data="Order Time">
                                                {item.order_time}
                                            </TableCellComponent>
                                            <TableCellComponent data="First Name">
                                                {item.first_name}
                                            </TableCellComponent>
                                            <TableCellComponent data="Last Name">
                                                {item.last_name}
                                            </TableCellComponent>
                                            <TableCellComponent data="Type">
                                                {item.coffee_type}
                                            </TableCellComponent>
                                            <TableCellComponent data="Temperature">
                                                {item.temperature}
                                            </TableCellComponent>
                                            <TableCellComponent data="Toppings">
                                                {item.toppings}
                                            </TableCellComponent>
                                            <TableCellComponent data="Size">
                                                {item.size}
                                            </TableCellComponent>
                                            <TableCellComponent data="Comments">
                                                {item.comments}
                                            </TableCellComponent>
                                            <TableCellComponent
                                                data="Price"
                                                className="lg:text-right md:text-right"
                                            >
                                                ¥{item.price}
                                            </TableCellComponent>
                                        </TableRow>
                                    ))}
                                </TableBody>
                                <TableFooter>
                                    <TableRow>
                                        <TableCell colSpan={8}>
                                            Totals:
                                        </TableCell>
                                        <TableCellComponent data="Price">
                                            ¥{totalPrice}
                                        </TableCellComponent>
                                    </TableRow>
                                </TableFooter>
                            </Table>
                        </main>
                    )}
                </div>
            )}
        </div>
    );
};

export default ViewOrders;
