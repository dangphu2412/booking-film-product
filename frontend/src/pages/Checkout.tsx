import { useSearchParams, useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { movies } from "@/lib/movieData";
import { ArrowLeft, CreditCard, Lock } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const Checkout = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { toast } = useToast();

    const movieId = searchParams.get("movieId");
    const date = searchParams.get("date");
    const time = searchParams.get("time");
    const seats = searchParams.get("seats")?.split(",") || [];

    const movie = movies.find((m) => m.id === movieId);

    const [cardNumber, setCardNumber] = useState("");
    const [processing, setProcessing] = useState(false);

    if (!movie || !date || !time || seats.length === 0) {
        return (
            <div className="min-h-screen bg-background">
                <Navbar />
                <div className="pt-24 container mx-auto px-4 text-center">
                    <h1 className="text-2xl font-bold text-foreground">Invalid checkout</h1>
                    <Button onClick={() => navigate("/movies")} className="mt-4">
                        Back to Movies
                    </Button>
                </div>
            </div>
        );
    }

    const ticketPrice = 12.99;
    const totalPrice = seats.length * ticketPrice;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setProcessing(true);

        setTimeout(() => {
            setProcessing(false);
            toast({
                title: "Booking Confirmed!",
                description: "Your tickets have been sent to your email.",
            });
            navigate(`/confirmation?movieId=${movieId}&date=${date}&time=${time}&seats=${seats.join(",")}`);
        }, 2000);
    };

    return (
        <div className="min-h-screen bg-background">
            <Navbar />

            <div className="pt-24 pb-16 container mx-auto px-4 max-w-4xl">
                <Button
                    variant="ghost"
                    onClick={() => navigate(-1)}
                    className="mb-6 text-foreground hover:text-primary"
                >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back
                </Button>

                <h1 className="text-3xl font-bold text-foreground mb-8">Payment</h1>

                <div className="grid md:grid-cols-2 gap-8">
                    {/* Payment Form */}
                    <Card className="p-6 bg-card border-border">
                        <div className="flex items-center gap-2 mb-6">
                            <CreditCard className="h-5 w-5 text-primary" />
                            <h2 className="text-xl font-semibold text-foreground">Card Details</h2>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <Label htmlFor="cardNumber">Card Number</Label>
                                <Input
                                    id="cardNumber"
                                    placeholder="1234 5678 9012 3456"
                                    value={cardNumber}
                                    onChange={(e) => setCardNumber(e.target.value)}
                                    maxLength={19}
                                    required
                                    className="bg-background border-border"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="expiry">Expiry Date</Label>
                                    <Input
                                        id="expiry"
                                        placeholder="MM/YY"
                                        required
                                        className="bg-background border-border"
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="cvv">CVV</Label>
                                    <Input
                                        id="cvv"
                                        placeholder="123"
                                        maxLength={3}
                                        required
                                        className="bg-background border-border"
                                    />
                                </div>
                            </div>

                            <div>
                                <Label htmlFor="name">Cardholder Name</Label>
                                <Input
                                    id="name"
                                    placeholder="John Doe"
                                    required
                                    className="bg-background border-border"
                                />
                            </div>

                            <div className="pt-4">
                                <Button
                                    type="submit"
                                    className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/90"
                                    size="lg"
                                    disabled={processing}
                                >
                                    {processing ? (
                                        "Processing..."
                                    ) : (
                                        <>
                                            <Lock className="mr-2 h-4 w-4" />
                                            Pay ${totalPrice.toFixed(2)}
                                        </>
                                    )}
                                </Button>
                            </div>

                            <p className="text-xs text-center text-muted-foreground">
                                Your payment information is encrypted and secure
                            </p>
                        </form>
                    </Card>

                    {/* Order Summary */}
                    <div>
                        <Card className="p-6 bg-card border-border space-y-6">
                            <h3 className="text-xl font-semibold text-foreground">Order Summary</h3>

                            <div className="flex gap-4">
                                <div className="w-24 aspect-[2/3] overflow-hidden rounded-lg">
                                    <img
                                        src={movie.poster}
                                        alt={movie.title}
                                        className="h-full w-full object-cover"
                                    />
                                </div>

                                <div className="flex-1">
                                    <h4 className="font-semibold text-foreground mb-1">{movie.title}</h4>
                                    <p className="text-sm text-muted-foreground mb-2">{movie.rating} • {movie.runtime} min</p>
                                    <div className="text-sm space-y-1">
                                        <p className="text-muted-foreground">
                                            {new Date(date).toLocaleDateString("en-US", {
                                                month: "short",
                                                day: "numeric",
                                                year: "numeric",
                                            })} at {time}
                                        </p>
                                        <p className="text-foreground font-medium">
                                            Seats: {seats.join(", ")}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="border-t border-border pt-4 space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Tickets ({seats.length})</span>
                                    <span className="text-foreground">${(seats.length * ticketPrice).toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Booking Fee</span>
                                    <span className="text-foreground">$0.00</span>
                                </div>
                                <div className="flex justify-between items-baseline text-lg font-bold pt-2 border-t border-border">
                                    <span className="text-foreground">Total</span>
                                    <span className="text-primary">${totalPrice.toFixed(2)}</span>
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
