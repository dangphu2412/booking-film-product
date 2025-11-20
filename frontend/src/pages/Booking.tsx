import { useState } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { movies } from "@/lib/movieData";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

const Booking = () => {
    const { id } = useParams();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const movie = movies.find((m) => m.id === id);
    const date = searchParams.get("date");
    const time = searchParams.get("time");

    const [selectedSeats, setSelectedSeats] = useState<string[]>([]);

    if (!movie || !date || !time) {
        return (
            <div className="min-h-screen bg-background">
                <Navbar />
                <div className="pt-24 container mx-auto px-4 text-center">
                    <h1 className="text-2xl font-bold text-foreground">Invalid booking</h1>
                    <Button onClick={() => navigate("/movies")} className="mt-4">
                        Back to Movies
                    </Button>
                </div>
            </div>
        );
    }

    const rows = ["A", "B", "C", "D", "E", "F", "G", "H"];
    const seatsPerRow = 12;
    const occupiedSeats = ["A5", "A6", "C8", "D4", "D5", "E7", "F9", "F10"];

    const toggleSeat = (seat: string) => {
        if (occupiedSeats.includes(seat)) return;

        setSelectedSeats((prev) =>
            prev.includes(seat) ? prev.filter((s) => s !== seat) : [...prev, seat]
        );
    };

    const ticketPrice = 12.99;
    const totalPrice = selectedSeats.length * ticketPrice;

    return (
        <div className="min-h-screen bg-background">
            <Navbar />

            <div className="pt-24 pb-16 container mx-auto px-4">
                <Button
                    variant="ghost"
                    onClick={() => navigate(-1)}
                    className="mb-6 text-foreground hover:text-primary"
                >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back
                </Button>

                <div className="grid lg:grid-cols-[1fr,380px] gap-8">
                    {/* Seat Selection */}
                    <div>
                        <Card className="p-6 bg-card border-border">
                            <h2 className="text-2xl font-bold text-foreground mb-6">Select Your Seats</h2>

                            {/* Screen */}
                            <div className="mb-8">
                                <div className="h-2 bg-gradient-to-r from-transparent via-primary to-transparent rounded-full mb-2 opacity-50" />
                                <p className="text-center text-sm text-muted-foreground">SCREEN</p>
                            </div>

                            {/* Seats Grid */}
                            <div className="space-y-3 mb-8">
                                {rows.map((row) => (
                                    <div key={row} className="flex items-center justify-center gap-2">
                    <span className="text-sm font-medium text-muted-foreground w-6">
                      {row}
                    </span>
                                        <div className="flex gap-2">
                                            {Array.from({ length: seatsPerRow }, (_, i) => {
                                                const seatNum = i + 1;
                                                const seatId = `${row}${seatNum}`;
                                                const isOccupied = occupiedSeats.includes(seatId);
                                                const isSelected = selectedSeats.includes(seatId);

                                                return (
                                                    <button
                                                        key={seatId}
                                                        onClick={() => toggleSeat(seatId)}
                                                        disabled={isOccupied}
                                                        className={cn(
                                                            "w-8 h-8 rounded-t-lg transition-all duration-200 text-xs font-medium",
                                                            isOccupied && "bg-muted cursor-not-allowed opacity-40",
                                                            !isOccupied && !isSelected && "bg-card border-2 border-border hover:border-primary hover:bg-primary/10",
                                                            isSelected && "bg-primary text-primary-foreground shadow-glow scale-110"
                                                        )}
                                                    >
                                                        {isOccupied ? "×" : seatNum}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Legend */}
                            <div className="flex flex-wrap justify-center gap-6 text-sm">
                                <div className="flex items-center gap-2">
                                    <div className="w-6 h-6 rounded-t-lg bg-card border-2 border-border" />
                                    <span className="text-muted-foreground">Available</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-6 h-6 rounded-t-lg bg-primary" />
                                    <span className="text-muted-foreground">Selected</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-6 h-6 rounded-t-lg bg-muted opacity-40" />
                                    <span className="text-muted-foreground">Occupied</span>
                                </div>
                            </div>
                        </Card>
                    </div>

                    {/* Booking Summary */}
                    <div className="lg:sticky lg:top-24 h-fit">
                        <Card className="p-6 bg-card border-border space-y-6">
                            <h3 className="text-xl font-bold text-foreground">Booking Summary</h3>

                            <div className="space-y-3">
                                <div className="aspect-[2/3] w-full overflow-hidden rounded-lg">
                                    <img
                                        src={movie.poster}
                                        alt={movie.title}
                                        className="h-full w-full object-cover"
                                    />
                                </div>

                                <div>
                                    <h4 className="font-semibold text-foreground">{movie.title}</h4>
                                    <p className="text-sm text-muted-foreground">{movie.rating} • {movie.runtime} min</p>
                                </div>
                            </div>

                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Date</span>
                                    <span className="text-foreground font-medium">
                    {new Date(date).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                    })}
                  </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Time</span>
                                    <span className="text-foreground font-medium">{time}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Seats</span>
                                    <span className="text-foreground font-medium">
                    {selectedSeats.length > 0 ? selectedSeats.join(", ") : "None"}
                  </span>
                                </div>
                            </div>

                            <div className="border-t border-border pt-4">
                                <div className="flex justify-between items-baseline mb-2">
                                    <span className="text-muted-foreground">Ticket Price</span>
                                    <span className="text-foreground">${ticketPrice.toFixed(2)} × {selectedSeats.length}</span>
                                </div>
                                <div className="flex justify-between items-baseline text-lg font-bold">
                                    <span className="text-foreground">Total</span>
                                    <span className="text-primary">${totalPrice.toFixed(2)}</span>
                                </div>
                            </div>

                            <Button
                                className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/90"
                                size="lg"
                                disabled={selectedSeats.length === 0}
                                onClick={() => navigate(`/checkout?movieId=${id}&date=${date}&time=${time}&seats=${selectedSeats.join(",")}`)}
                            >
                                Continue to Payment
                                <ArrowRight className="ml-2 h-5 w-5" />
                            </Button>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Booking;
