import { useParams, useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { movies } from "@/lib/movieData";
import { Star, Clock, Calendar, ArrowLeft } from "lucide-react";
import { useState } from "react";

const MovieDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const movie = movies.find((m) => m.id === id);
    const [selectedDate, setSelectedDate] = useState(0);

    if (!movie) {
        return (
            <div className="min-h-screen bg-background">
                <Navbar />
                <div className="pt-24 container mx-auto px-4 text-center">
                    <h1 className="text-2xl font-bold text-foreground">Movie not found</h1>
                    <Button onClick={() => navigate("/movies")} className="mt-4">
                        Back to Movies
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            <Navbar />

            <div className="pt-20">
                {/* Hero Section */}
                <div className="relative h-[50vh] overflow-hidden">
                    <div className="absolute inset-0">
                        <img
                            src={movie.poster}
                            alt={movie.title}
                            className="h-full w-full object-cover blur-2xl scale-110 opacity-30"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-background/40" />
                    </div>
                </div>

                <div className="container mx-auto px-4 -mt-40 relative z-10">
                    <Button
                        variant="ghost"
                        onClick={() => navigate(-1)}
                        className="mb-4 text-foreground hover:text-primary"
                    >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back
                    </Button>

                    <div className="grid md:grid-cols-[300px,1fr] gap-8">
                        {/* Movie Poster */}
                        <div>
                            <Card className="overflow-hidden shadow-card">
                                <img
                                    src={movie.poster}
                                    alt={movie.title}
                                    className="w-full aspect-[2/3] object-cover"
                                />
                            </Card>
                        </div>

                        {/* Movie Info */}
                        <div className="space-y-6">
                            <div>
                                <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-3">
                                    {movie.title}
                                </h1>
                                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                                    <div className="flex items-center space-x-2">
                                        <Star className="h-5 w-5 fill-primary text-primary" />
                                        <span className="text-foreground font-semibold text-lg">{movie.score}</span>
                                    </div>
                                    <div className="flex items-center space-x-1">
                                        <Clock className="h-4 w-4" />
                                        <span>{movie.runtime} min</span>
                                    </div>
                                    <span className="px-2 py-1 rounded bg-muted text-foreground text-xs font-medium">
                    {movie.rating}
                  </span>
                                    <span>{movie.genre.join(", ")}</span>
                                </div>
                            </div>

                            <div>
                                <h3 className="text-lg font-semibold text-foreground mb-2">Synopsis</h3>
                                <p className="text-muted-foreground leading-relaxed">{movie.description}</p>
                            </div>

                            <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                    <h3 className="text-sm font-semibold text-foreground mb-1">Director</h3>
                                    <p className="text-muted-foreground">{movie.director}</p>
                                </div>
                                <div>
                                    <h3 className="text-sm font-semibold text-foreground mb-1">Cast</h3>
                                    <p className="text-muted-foreground">{movie.cast.join(", ")}</p>
                                </div>
                            </div>

                            {/* Showtimes */}
                            <div className="space-y-4">
                                <h3 className="text-xl font-semibold text-foreground">Select Showtime</h3>

                                {/* Date Selection */}
                                <div className="flex gap-2 overflow-x-auto pb-2">
                                    {movie.showtimes.map((showtime, index) => (
                                        <Button
                                            key={index}
                                            variant={selectedDate === index ? "default" : "outline"}
                                            onClick={() => setSelectedDate(index)}
                                            className={`min-w-[140px] ${selectedDate === index ? "bg-primary text-primary-foreground" : ""}`}
                                        >
                                            <Calendar className="mr-2 h-4 w-4" />
                                            {new Date(showtime.date).toLocaleDateString("en-US", {
                                                month: "short",
                                                day: "numeric",
                                            })}
                                        </Button>
                                    ))}
                                </div>

                                {/* Time Selection */}
                                <div className="flex flex-wrap gap-3">
                                    {movie.showtimes[selectedDate].times.map((time, index) => (
                                        <Button
                                            key={index}
                                            variant="outline"
                                            className="hover:bg-primary hover:text-primary-foreground"
                                            onClick={() => navigate(`/booking/${movie.id}?date=${movie.showtimes[selectedDate].date}&time=${time}`)}
                                        >
                                            {time}
                                        </Button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="py-16" />
        </div>
    );
};

export default MovieDetail;
