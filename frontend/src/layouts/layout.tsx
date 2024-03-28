import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Breadcrumb from "./breadcrumb";
import Home from "@/pages/Home";
import ViewOrders from "@/pages/ViewOrders";
import SignIn from "@/pages/SignIn";
import SignUp from "@/pages/SignUp";
import Coffee from "@/pages/Coffee";
import NonCaffeinated from "@/pages/NonCaffeinated";
import Breakfast from "@/pages/Breakfast";
import Order from "@/pages/Order";
import NotAuthorized from "@/pages/NotAuthorized";
import NotFound from "@/pages/404";

const Layout = () => {
    return (
        <Router>
            <div className="flex flex-col min-h-screen bg-background">
                <Breadcrumb />
                <main className="h-full flex flex-col justify-center items-center flex-grow">
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/view-orders" element={<ViewOrders />} />
                        <Route path="/sign-in" element={<SignIn />} />
                        <Route path="/sign-up" element={<SignUp />} />
                        <Route path="/coffee" element={<Coffee />} />
                        <Route
                            path="/non-caffeinated"
                            element={<NonCaffeinated />}
                        />
                        <Route path="/breakfast" element={<Breakfast />} />
                        <Route
                            path="/coffee/order"
                            element={<Order itemType="coffee" />}
                        />
                        <Route
                            path="/non-caffeinated/order"
                            element={<Order itemType="non_caffeinated" />}
                        />
                        <Route
                            path="/breakfast/order"
                            element={<Order itemType="breakfast" />}
                        />
                        <Route
                            path="/not-authorized"
                            element={<NotAuthorized />}
                        />
                        <Route path="*" element={<NotFound />} />
                    </Routes>
                </main>
                <footer className="text-muted-foreground font-normal py-2 text-center">
                    Made by Shawn and managed by Anja & Shawn.
                </footer>
            </div>
        </Router>
    );
};

export default Layout;
