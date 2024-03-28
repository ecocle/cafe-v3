import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { ModeToggle } from "@/components/ModeToggle";
import Error from "@/components/Error";
import Loading from "@/components/Loading";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import paymentImage from "../images/paymentImage.jpg";
import { Eye, Loader2, LogOut, Plus, Settings, UserRound } from "lucide-react";

const baseUrl =
    process.env.NODE_ENV === "production" ? "" : "http://localhost:5000";

type OrderButtonProps = {
    children: React.ReactNode;
    redirectTo?: string;
};

const token = Cookies.get("token");

const OrderButton: React.FC<OrderButtonProps> = ({ children, redirectTo }) => {
    const navigate = useNavigate();

    const handleClick = () => {
        if (redirectTo) {
            navigate(redirectTo);
        }
    };

    return (
        <Button
            variant="default"
            onClick={handleClick}
            className="text-2xl mt-12 p-10 w-64 lg:w-auto md:w-auto lg:text-4xl md:text-3xl"
        >
            {children}
        </Button>
    );
};

const ProfileDropdown = () => {
    const navigate = useNavigate();
    const [userBalance, setUserBalance] = useState(0);
    const [username, setUsername] = useState("");
    const [fundsToAdd, setFundsToAdd] = useState("0");
    const [addingFunds, setAddingFunds] = useState(false);
    const [error, setError] = useState("");
    const [openPayment, setOpenPayment] = useState(false);

    const handleAddFunds = async () => {
        setAddingFunds(true);

        const funds = Number(fundsToAdd);
        if (isNaN(funds)) {
            setError("Please enter a valid amount.");
            setAddingFunds(false);
            return;
        }

        try {
            const response = await fetch(`${baseUrl}/api/addFundToAccount`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                credentials: "include",
                body: JSON.stringify({ amount: funds }),
            });

            if (response.ok) {
                setOpenPayment(true);
            } else if (response.status === 400) {
                setError("Please enter a valid amount.");
            } else {
                const errorData = await response.json();
                setError(
                    errorData.message ||
                        "Something went wrong. Please try again later.",
                );
            }
        } catch (error) {
            setError(
                "An error occurred while adding funds. Please try again later.",
            );
        } finally {
            setAddingFunds(false);
        }
    };

    useEffect(() => {
        fetch(`${baseUrl}/api/userData`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            credentials: "include",
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.balance) {
                    setUserBalance(data.balance);
                }
                if (data.username) {
                    setUsername(data.username);
                }
            })
            .catch((error) => console.error("Error:", error));
    }, []);

    return (
        <DropdownMenu>
            <DropdownMenuTrigger>
                <Button variant="outline" size="icon">
                    <UserRound />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuLabel>
                    {username ? (
                        username
                    ) : (
                        <Loader2 className="animate-spin h-6 w-6" />
                    )}
                </DropdownMenuLabel>
                <DropdownMenuLabel>Balance: {userBalance}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <Dialog>
                    <DialogTrigger>
                        <button className="w-32 relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50">
                            <Plus className="mr-2 h-4 w-4" />
                            <span>Add Funds</span>
                        </button>
                    </DialogTrigger>
                    <DialogContent className="w-5/6">
                        {addingFunds ? (
                            <Loading message="Adding funds..." />
                        ) : error ? (
                            <Error message={error} />
                        ) : openPayment ? (
                            <div className="flex flex-row space-x-2">
                                <img src={paymentImage} alt="Payment Image" />
                                <span className="text-lg font-semibold">
                                    Funds added successfully!
                                </span>
                            </div>
                        ) : (
                            <div className="flex flex-col space-y-4">
                                <DialogHeader>
                                    <DialogTitle>Add Funds</DialogTitle>
                                    <DialogDescription>
                                        Add funds to your account.
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="flex flex-col space-y-4">
                                    <Input
                                        type="number"
                                        value={fundsToAdd}
                                        onChange={(e) =>
                                            setFundsToAdd(
                                                String(e.target.value),
                                            )
                                        }
                                        placeholder="Enter amount"
                                    />
                                    <Button
                                        variant="default"
                                        onClick={handleAddFunds}
                                    >
                                        Add Funds
                                    </Button>
                                </div>
                            </div>
                        )}
                    </DialogContent>
                </Dialog>
                <DropdownMenuItem onClick={() => navigate("/view-orders")}>
                    <Eye className="mr-2 h-4 w-4" />
                    <span>View Orders</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                    disabled
                    onClick={() => navigate("/settings")}
                >
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                    onClick={() => {
                        Cookies.remove("token");
                        window.location.reload();
                    }}
                >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Sign Out</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

const Home = () => {
    return (
        <div className="flex flex-col flex-grow h-full w-full">
            <div className="space-x-2 basis-40 flex flex-row justify-end m-2">
                <ModeToggle />
                {token ? (
                    <div className="space-x-2">
                        <ProfileDropdown />
                    </div>
                ) : (
                    <div className="space-x-2">
                        <Link
                            to="/sign-up"
                            className={buttonVariants({ variant: "outline" })}
                        >
                            Sign Up
                        </Link>
                        <Link
                            to="/sign-in"
                            className={buttonVariants({ variant: "outline" })}
                        >
                            sign in
                        </Link>
                    </div>
                )}
            </div>
            <div className="flex flex-col items-center space-y-6 w-full">
                <h1 className="font-pacifico lg:text-8xl md:text-8xl text-7xl font-bold">
                    MY Cafe
                </h1>
                <div className="flex flex-col lg:flex-row lg:space-x-12">
                    <OrderButton redirectTo="/coffee">Coffee</OrderButton>
                    <OrderButton redirectTo="Non-caffeinated">
                        Non-caffeanted Drinks
                    </OrderButton>
                    <OrderButton redirectTo="/breakfast">Breakfast</OrderButton>
                </div>
            </div>
        </div>
    );
};

export default Home;
