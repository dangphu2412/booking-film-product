import { Link, useLocation } from "react-router-dom";
import { Film, User } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Navbar = () => {
    const location = useLocation();

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
            <div className="container mx-auto px-4">
                <div className="flex h-16 items-center justify-between">
                    <Link to="/" className="flex items-center space-x-2">
                        <Film className="h-8 w-8 text-primary" />
                        <span className="text-xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              CineBook
            </span>
                    </Link>

                    <div className="flex items-center space-x-8">
                        <Link
                            to="/"
                            className={`text-sm font-medium transition-colors hover:text-primary ${
                                location.pathname === "/" ? "text-primary" : "text-foreground/80"
                            }`}
                        >
                            Home
                        </Link>
                        <Link
                            to="/movies"
                            className={`text-sm font-medium transition-colors hover:text-primary ${
                                location.pathname === "/movies" ? "text-primary" : "text-foreground/80"
                            }`}
                        >
                            Movies
                        </Link>
                        <Button variant="outline" size="sm" asChild>
                            <Link to="/login">
                                <User className="mr-2 h-4 w-4" />
                                Sign In
                            </Link>
                        </Button>
                    </div>
                </div>
            </div>
        </nav>
    );
};
