import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "../pages/home";

const Layout = () => {
    return (
        <Router>
            <div className="flex flex-col justify-center items-center h-screen w-screen bg-background">
                <main className="h-full w-full flex items-center">
                    <Routes>
                        <Route path="/" element={<Home />} />
                    </Routes>
                </main>
                <footer className="text-muted-foreground font-semibold mt-auto mb-2">
                    <p>Made by Shawn</p>
                </footer>
            </div>
        </Router>
    );
};

export default Layout;
