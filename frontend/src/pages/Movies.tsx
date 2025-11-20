import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { MovieCard } from "@/components/MovieCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { movies } from "@/lib/movieData";
import { Search, SlidersHorizontal } from "lucide-react";

const Movies = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedGenre, setSelectedGenre] = useState<string>("All");

    const genres = ["All", ...Array.from(new Set(movies.flatMap((m) => m.genre)))];

    const filteredMovies = movies.filter((movie) => {
        const matchesSearch = movie.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            movie.genre.some(g => g.toLowerCase().includes(searchQuery.toLowerCase()));
        const matchesGenre = selectedGenre === "All" || movie.genre.includes(selectedGenre);
        return matchesSearch && matchesGenre;
    });

    return (
        <div className="min-h-screen bg-background">
            <Navbar />

            <div className="pt-24 pb-16 container mx-auto px-4">
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-foreground mb-2">All Movies</h1>
                    <p className="text-muted-foreground">Discover your next favorite film</p>
                </div>

                {/* Search and Filters */}
                <div className="mb-8 space-y-4">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search movies..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10 bg-card border-border"
                            />
                        </div>
                        <Button variant="outline" className="md:w-auto">
                            <SlidersHorizontal className="mr-2 h-4 w-4" />
                            More Filters
                        </Button>
                    </div>

                    {/* Genre Filter */}
                    <div className="flex flex-wrap gap-2">
                        {genres.map((genre) => (
                            <Button
                                key={genre}
                                variant={selectedGenre === genre ? "default" : "outline"}
                                size="sm"
                                onClick={() => setSelectedGenre(genre)}
                                className={selectedGenre === genre ? "bg-primary text-primary-foreground" : ""}
                            >
                                {genre}
                            </Button>
                        ))}
                    </div>
                </div>

                {/* Movies Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {filteredMovies.map((movie) => (
                        <MovieCard key={movie.id} movie={movie} />
                    ))}
                </div>

                {filteredMovies.length === 0 && (
                    <div className="text-center py-16">
                        <p className="text-muted-foreground text-lg">No movies found matching your criteria.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Movies;
