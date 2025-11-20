import { Navbar } from "@/components/Navbar";
import { MovieCard } from "@/components/MovieCard";
import { Button } from "@/components/ui/button";
import { movies } from "@/lib/movieData";
import { ArrowRight, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import heroCinema from "@/assets/hero-cinema.jpg";

const Home = () => {
    const featuredMovies = movies.slice(0, 3);
    const nowShowing = movies.slice(3);

    return (
        <div className="min-h-screen bg-background">
            <Navbar />

            {/* Hero Section */}
            <section className="relative h-[70vh] overflow-hidden">
                <div className="absolute inset-0">
                    <img
                        src={heroCinema}
                        alt="Cinema"
                        className="h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-background/40" />
                </div>
                <div className="relative container mx-auto px-4 h-full flex items-center">
                    <div className="max-w-2xl space-y-6">
                        <div className="inline-flex items-center space-x-2 rounded-full bg-primary/10 px-4 py-2 text-sm text-primary">
                            <Sparkles className="h-4 w-4" />
                            <span>Premium Cinema Experience</span>
                        </div>
                        <h1 className="text-5xl md:text-6xl font-bold text-foreground leading-tight">
                            Book Your Next
                            <span className="block bg-gradient-to-r from-primary via-primary to-secondary bg-clip-text text-transparent">
                Movie Experience
              </span>
                        </h1>
                        <p className="text-lg text-muted-foreground max-w-xl">
                            Reserve your seats for the latest blockbusters and timeless classics. Premium comfort, cutting-edge sound, and unforgettable moments await.
                        </p>
                        <div className="flex flex-wrap gap-4">
                            <Button size="lg" asChild className="bg-primary text-primary-foreground hover:bg-primary/90">
                                <Link to="/movies">
                                    Browse Movies
                                    <ArrowRight className="ml-2 h-5 w-5" />
                                </Link>
                            </Button>
                            <Button size="lg" variant="outline">
                                Learn More
                            </Button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Featured Movies */}
            <section className="py-16 container mx-auto px-4">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h2 className="text-3xl font-bold text-foreground mb-2">Featured This Week</h2>
                        <p className="text-muted-foreground">Handpicked movies you don't want to miss</p>
                    </div>
                    <Button variant="ghost" asChild>
                        <Link to="/movies">
                            View All
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                    </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {featuredMovies.map((movie) => (
                        <MovieCard key={movie.id} movie={movie} />
                    ))}
                </div>
            </section>

            {/* Now Showing */}
            <section className="py-16 bg-gradient-card container mx-auto px-4">
                <div className="mb-8">
                    <h2 className="text-3xl font-bold text-foreground mb-2">Now Showing</h2>
                    <p className="text-muted-foreground">Currently playing in theaters</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {nowShowing.map((movie) => (
                        <MovieCard key={movie.id} movie={movie} />
                    ))}
                </div>
            </section>

            {/* Footer */}
            <footer className="border-t border-border py-8">
                <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
                    <p>&copy; 2024 CineBook. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
};

export default Home;
