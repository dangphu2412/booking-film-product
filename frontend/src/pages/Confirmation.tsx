import { useSearchParams, Link } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { movies } from "@/lib/movieData";
import { CheckCircle, Download, Mail, Calendar, Clock, MapPin } from "lucide-react";

const Confirmation = () => {
    const [searchParams] = useSearchParams();

    const movieId = searchParams.get("movieId");
    const date = searchParams.get("date");
    const time = searchParams.get("time");
    const seats = searchParams.get("seats")?.split(",") || [];

    const movie = movies.find((m) => m.id === movieId);

    if (!movie || !date || !time || seats.length === 0) {
        return (
            <div className="min-h-screen bg-background">
                <Navbar />
                <div className="pt-24 container mx-auto px-4 text-center">
                    <h1 className="text-2xl font-bold text-foreground">Booking not found</h1>
                    <Button asChild className="mt-4">
                        <Link to="/movies">Browse Movies</Link>
                    </Button>
                </div>
            </div>
        );
    }

    const ticketPrice = 12.99;
    const totalPrice = seats.length * ticketPrice;
    const confirmationNumber = `CNB${Math.random().toString(36).substring(2, 9).toUpperCase()}`;

    return (
        <div className="min-h-screen bg-background">
            <Navbar />

            <div className="pt-24 pb-16 container mx-auto px-4 max-w-2xl">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                        <CheckCircle className="h-10 w-10 text-primary" />
                    </div>
                    <h1 className="text-3xl font-bold text-foreground mb-2">Booking Confirmed!</h1>
                    <p className="text-muted-foreground">Your tickets have been sent to your email</p>
                </div>

                <Card className="p-6 md:p-8 bg-card border-border space-y-6">
                    {/* Confirmation Number */}
                    <div className="text-center pb-6 border-b border-border">
                        <p className="text-sm text-muted-foreground mb-1">Confirmation Number</p>
                        <p className="text-2xl font-bold text-primary font-mono">{confirmationNumber}</p>
                    </div>

                    {/* Movie Info */}
                    <div className="flex gap-4">
                        <div className="w-24 aspect-[2/3] overflow-hidden rounded-lg">
                            <img
                                src={movie.poster}
                                alt={movie.title}
                                className="h-full w-full object-cover"
                            />
                        </div>

                        <div className="flex-1">
                            <h2 className="text-xl font-bold text-foreground mb-2">{movie.title}</h2>
                            <p className="text-sm text-muted-foreground">{movie.rating} • {movie.runtime} min</p>
                        </div>
                    </div>

                    {/* Details */}
                    <div className="space-y-4 border-t border-border pt-6">
                        <div className="flex items-start gap-3">
                            <Calendar className="h-5 w-5 text-primary mt-0.5" />
                            <div>
                                <p className="text-sm text-muted-foreground">Date</p>
                                <p className="text-foreground font-medium">
                                    {new Date(date).toLocaleDateString("en-US", {
                                        weekday: "long",
                                        month: "long",
                                        day: "numeric",
                                        year: "numeric",
                                    })}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3">
                            <Clock className="h-5 w-5 text-primary mt-0.5" />
                            <div>
                                <p className="text-sm text-muted-foreground">Time</p>
                                <p className="text-foreground font-medium">{time}</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3">
                            <MapPin className="h-5 w-5 text-primary mt-0.5" />
                            <div>
                                <p className="text-sm text-muted-foreground">Theater</p>
                                <p className="text-foreground font-medium">CineBook Theater - Screen 1</p>
                                <p className="text-sm text-muted-foreground">123 Cinema Street, Movie City</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3">
                            <Mail className="h-5 w-5 text-primary mt-0.5" />
                            <div>
                                <p className="text-sm text-muted-foreground">Seats</p>
                                <p className="text-foreground font-medium">{seats.join(", ")}</p>
                            </div>
                        </div>
                    </div>

                    {/* Payment Summary */}
                    <div className="border-t border-border pt-6 space-y-2">
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Tickets ({seats.length})</span>
                            <span className="text-foreground">${(seats.length * ticketPrice).toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between items-baseline font-bold">
                            <span className="text-foreground">Total Paid</span>
                            <span className="text-primary text-lg">${totalPrice.toFixed(2)}</span>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col sm:flex-row gap-3 pt-4">
                        <Button variant="outline" className="flex-1">
                            <Download className="mr-2 h-4 w-4" />
                            Download Tickets
                        </Button>
                        <Button variant="outline" className="flex-1">
                            <Mail className="mr-2 h-4 w-4" />
                            Email Tickets
                        </Button>
                    </div>

                    <Button asChild className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                        <Link to="/movies">Book Another Movie</Link>
                    </Button>
                </Card>

                <p className="text-center text-sm text-muted-foreground mt-6">
                    Please arrive 15 minutes before showtime. Bring your confirmation number or email.
                </p>
            </div>
        </div>
    );
};

export default Confirmation;
