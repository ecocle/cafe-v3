import { Link, useLocation } from "react-router-dom";

const Breadcrumb = () => {
    const location = useLocation();
    const pathnames = location.pathname.split("/").filter((x) => x);

    return (
        <nav className="absolute top-0 left-2 z-10">
            <ol className="list-none flex items-center text-gray-600">
                <li>
                    <Link
                        to="/"
                        className={`${
                            pathnames.length === 0
                                ? "text-primary"
                                : "text-muted-foreground"
                        } hover:text-primary`}
                    >
                        Home
                    </Link>
                </li>
                {pathnames.map((name, index) => (
                    <li key={name} className="flex items-center">
                        <span className="mx-2 text-muted-foreground">/</span>
                        {index === pathnames.length - 1 ? (
                            <span className="text-primary">{name}</span>
                        ) : (
                            <Link
                                to={`/${pathnames.slice(0, index + 1).join("/")}`}
                                className="text-muted-foreground hover:text-primary"
                            >
                                {name}
                            </Link>
                        )}
                    </li>
                ))}
            </ol>
        </nav>
    );
};

export default Breadcrumb;
