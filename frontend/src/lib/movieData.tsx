export interface Movie {
    id: string;
    title: string;
    genre: string[];
    runtime: number;
    rating: string;
    score: number;
    poster: string;
    description: string;
    director: string;
    cast: string[];
    showtimes: {
        date: string;
        times: string[];
    }[];
}

export const movies: Movie[] = [
    {
        id: "1",
        title: "Midnight Pursuit",
        genre: ["Action", "Thriller"],
        runtime: 142,
        rating: "PG-13",
        score: 8.7,
        poster: "/src/assets/movie-1.jpg",
        description: "An intense chase through the city's underbelly as a determined detective races against time to stop a catastrophic threat.",
        director: "Michael Reynolds",
        cast: ["Tom Hardy", "Charlize Theron", "Idris Elba"],
        showtimes: [
            { date: "2024-01-20", times: ["10:00 AM", "1:30 PM", "4:45 PM", "7:30 PM", "10:15 PM"] },
            { date: "2024-01-21", times: ["11:00 AM", "2:00 PM", "5:15 PM", "8:00 PM"] },
        ],
    },
    {
        id: "2",
        title: "Hearts in the City",
        genre: ["Romance", "Drama"],
        runtime: 118,
        rating: "PG",
        score: 7.9,
        poster: "/src/assets/movie-2.jpg",
        description: "Two strangers find love in the most unexpected places as they navigate the complexities of modern relationships in a bustling metropolis.",
        director: "Sofia Martinez",
        cast: ["Emma Stone", "Ryan Gosling", "Rachel McAdams"],
        showtimes: [
            { date: "2024-01-20", times: ["12:00 PM", "3:15 PM", "6:30 PM", "9:00 PM"] },
            { date: "2024-01-21", times: ["1:00 PM", "4:15 PM", "7:00 PM", "9:45 PM"] },
        ],
    },
    {
        id: "3",
        title: "Galactic Frontier",
        genre: ["Sci-Fi", "Adventure"],
        runtime: 156,
        rating: "PG-13",
        score: 9.1,
        poster: "/src/assets/movie-3.jpg",
        description: "Humanity's boldest expedition ventures into uncharted space, discovering wonders and dangers beyond imagination.",
        director: "Christopher Nolan",
        cast: ["Matthew McConaughey", "Jessica Chastain", "Anne Hathaway"],
        showtimes: [
            { date: "2024-01-20", times: ["10:30 AM", "2:00 PM", "5:30 PM", "9:00 PM"] },
            { date: "2024-01-21", times: ["11:30 AM", "3:00 PM", "6:30 PM", "10:00 PM"] },
        ],
    },
    {
        id: "4",
        title: "Whispers in the Dark",
        genre: ["Horror", "Mystery"],
        runtime: 105,
        rating: "R",
        score: 7.4,
        poster: "/src/assets/movie-4.jpg",
        description: "A family moves into a secluded mansion, only to discover that some secrets are best left buried.",
        director: "James Wan",
        cast: ["Vera Farmiga", "Patrick Wilson", "Lili Taylor"],
        showtimes: [
            { date: "2024-01-20", times: ["7:00 PM", "9:30 PM", "11:45 PM"] },
            { date: "2024-01-21", times: ["7:30 PM", "10:00 PM"] },
        ],
    },
    {
        id: "5",
        title: "Laughing Matter",
        genre: ["Comedy"],
        runtime: 98,
        rating: "PG-13",
        score: 6.8,
        poster: "/src/assets/movie-5.jpg",
        description: "A down-on-his-luck comedian gets one last chance to prove himself at the biggest comedy festival of the year.",
        director: "Judd Apatow",
        cast: ["Kevin Hart", "Tiffany Haddish", "Adam Sandler"],
        showtimes: [
            { date: "2024-01-20", times: ["12:30 PM", "3:00 PM", "5:30 PM", "8:00 PM", "10:30 PM"] },
            { date: "2024-01-21", times: ["1:30 PM", "4:00 PM", "6:30 PM", "9:00 PM"] },
        ],
    },
    {
        id: "6",
        title: "Adventure Kingdom",
        genre: ["Animation", "Family", "Adventure"],
        runtime: 102,
        rating: "G",
        score: 8.5,
        poster: "/src/assets/movie-6.jpg",
        description: "Join a brave young hero and their quirky friends on a magical quest to save their enchanted kingdom from darkness.",
        director: "Pete Docter",
        cast: ["Tom Holland (voice)", "Zendaya (voice)", "Jack Black (voice)"],
        showtimes: [
            { date: "2024-01-20", times: ["10:00 AM", "12:30 PM", "3:00 PM", "5:30 PM", "8:00 PM"] },
            { date: "2024-01-21", times: ["10:30 AM", "1:00 PM", "3:30 PM", "6:00 PM"] },
        ],
    },
];
