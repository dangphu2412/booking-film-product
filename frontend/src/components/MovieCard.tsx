import { Link } from "react-router-dom";
import { Star, Clock } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Movie } from "@/lib/movieData";

interface MovieCardProps {
    movie: Movie;
}

export const MovieCard = ({ movie }: MovieCardProps) => {
    return (
        <Link to={`/movie/${movie.id}`}>
            <Card className="group overflow-hidden border-border bg-card transition-all duration-300 hover:shadow-glow hover:scale-105">
                <div className="relative aspect-[2/3] overflow-hidden">
                    <img
                        src={movie.poster}
                        alt={movie.title}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/0 to-black/0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                    <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full transition-transform duration-300 group-hover:translate-y-0">
                        <div className="flex items-center justify-between text-sm text-foreground">
                            <div className="flex items-center space-x-1">
                                <Star className="h-4 w-4 fill-primary text-primary" />
                                <span className="font-semibold">{movie.score}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                                <Clock className="h-4 w-4" />
                                <span>{movie.runtime} min</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="p-4">
                    <h3 className="font-semibold text-foreground mb-1 line-clamp-1">{movie.title}</h3>
                    <p className="text-sm text-muted-foreground">{movie.genre.join(", ")}</p>
                </div>
            </Card>
        </Link>
    );
};
