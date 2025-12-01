// utils/filmingLocations.js - Film Locations Database

// Since there's no comprehensive filming locations API, 
// we'll create a curated database of iconic filming locations

export const FILMING_LOCATIONS = [
    // VANCOUVER LOCATIONS
    {
        id: 11,
        movieTitle: 'Deadpool',
        movieId: 293660, // TMDB ID
        sceneDescription: "The Georgia Viaduct highway fight scene",
        locationName: 'Georgia Viaduct',
        address: 'Georgia Viaduct, Vancouver, BC, Canada',
        latitude: 49.2769,
        longitude: -123.1003,
        city: 'Vancouver',
        country: 'Canada',
        difficulty: 'medium',
        tips: 'Best viewed from the overpass. Be careful of traffic.',
        imageUrl: null,
        tags: ['action', 'superhero', 'iconic'],
    },
    {
        id: 12,
        movieTitle: 'Fifty Shades of Grey',
        movieId: 241554, // TMDB ID
        sceneDescription: "Christian Grey's apartment building",
        locationName: 'Bentall 5 Building',
        address: '550 Burrard St, Vancouver, BC V6C 2B5, Canada',
        latitude: 49.2865,
        longitude: -123.1207,
        city: 'Vancouver',
        country: 'Canada',
        difficulty: 'easy',
        tips: 'The building is in downtown Vancouver. Exterior shots only.',
        imageUrl: null,
        tags: ['romance', 'drama', 'modern'],
    },
    {
        id: 13,
        movieTitle: 'The Twilight Saga',
        movieId: 8966, // TMDB ID (first movie)
        sceneDescription: "Bella's house exterior",
        locationName: 'Bella Swan House',
        address: '184 W 6th St, North Vancouver, BC, Canada',
        latitude: 49.3142,
        longitude: -123.0747,
        city: 'North Vancouver',
        country: 'Canada',
        difficulty: 'easy',
        tips: 'Private residence - please be respectful and view from street only',
        imageUrl: null,
        tags: ['romance', 'fantasy', 'teen'],
    },
    {
        id: 14,
        movieTitle: 'The Proposal',
        movieId: 19995, // TMDB ID
        sceneDescription: "Sitka, Alaska scenes (filmed in Vancouver)",
        locationName: 'Rockport',
        address: 'Rockport, BC, Canada',
        latitude: 49.3833,
        longitude: -123.2667,
        city: 'Vancouver',
        country: 'Canada',
        difficulty: 'hard',
        tips: 'Remote location used as Alaska. Best to visit with a guide.',
        imageUrl: null,
        tags: ['romance', 'comedy', 'scenic'],
    },
    {
        id: 15,
        movieTitle: 'Supernatural (TV Series)',
        movieId: 1622, // TMDB ID
        sceneDescription: "Various Vancouver locations used throughout series",
        locationName: 'Riverview Hospital',
        address: '2601 Lougheed Hwy, Coquitlam, BC V3B 1A7, Canada',
        latitude: 49.2447,
        longitude: -122.8056,
        city: 'Coquitlam',
        country: 'Canada',
        difficulty: 'medium',
        tips: 'Former psychiatric hospital, now a filming location. Tours available.',
        imageUrl: null,
        tags: ['horror', 'supernatural', 'tv-series'],
    },
    {
        id: 16,
        movieTitle: 'X-Files (TV Series)',
        movieId: 4087, // TMDB ID
        sceneDescription: "FBI headquarters exterior",
        locationName: 'Oceanic Plaza',
        address: '1066 W Hastings St, Vancouver, BC V6E 3X2, Canada',
        latitude: 49.2868,
        longitude: -123.1228,
        city: 'Vancouver',
        country: 'Canada',
        difficulty: 'easy',
        tips: 'Downtown building used as FBI HQ exterior in many episodes',
        imageUrl: null,
        tags: ['sci-fi', 'mystery', 'tv-series'],
    },
    {
        id: 17,
        movieTitle: 'Sonic the Hedgehog',
        movieId: 338762, // TMDB ID
        sceneDescription: "Green Hills town scenes",
        locationName: 'Ladysmith',
        address: 'Ladysmith, BC, Canada',
        latitude: 48.9953,
        longitude: -123.8200,
        city: 'Ladysmith',
        country: 'Canada',
        difficulty: 'hard',
        tips: 'Small town on Vancouver Island. Worth a day trip.',
        imageUrl: null,
        tags: ['family', 'action', 'comedy'],
    },
    {
        id: 18,
        movieTitle: 'War for the Planet of the Apes',
        movieId: 281338, // TMDB ID
        sceneDescription: "Snowy wilderness and avalanche scenes",
        locationName: 'Capilano Suspension Bridge',
        address: '3735 Capilano Rd, North Vancouver, BC V7R 4J1, Canada',
        latitude: 49.3429,
        longitude: -123.1149,
        city: 'North Vancouver',
        country: 'Canada',
        difficulty: 'medium',
        tips: 'Popular tourist attraction. Admission fee required.',
        imageUrl: null,
        tags: ['action', 'sci-fi', 'adventure'],
    },
    {
        id: 19,
        movieTitle: 'The Sisterhood of the Traveling Pants',
        movieId: 11219, // TMDB ID
        sceneDescription: "Soccer field scenes",
        locationName: 'Swangard Stadium',
        address: '3883 Imperial St, Burnaby, BC V5J 1A3, Canada',
        latitude: 49.2258,
        longitude: -122.9920,
        city: 'Burnaby',
        country: 'Canada',
        difficulty: 'easy',
        tips: 'Public stadium, can be viewed from outside',
        imageUrl: null,
        tags: ['drama', 'friendship', 'teen'],
    },
    {
        id: 20,
        movieTitle: 'Tomorrowland',
        movieId: 158852, // TMDB ID
        sceneDescription: "Futuristic city and Science World",
        locationName: 'Science World',
        address: '1455 Quebec St, Vancouver, BC V6A 3Z7, Canada',
        latitude: 49.2733,
        longitude: -123.1035,
        city: 'Vancouver',
        country: 'Canada',
        difficulty: 'easy',
        tips: 'Iconic geodesic dome. Great for photos, admission for interior.',
        imageUrl: null,
        tags: ['sci-fi', 'adventure', 'family'],
    },
    
    // ORIGINAL LOCATIONS
    {
        id: 1,
        movieTitle: 'Notting Hill',
        movieId: 2073, // TMDB ID
        sceneDescription: "The iconic blue door where William Thacker lives",
        locationName: 'The Blue Door',
        address: '280 Westbourne Park Road, Notting Hill, London W11 1EQ, UK',
        latitude: 51.5201,
        longitude: -0.2013,
        city: 'London',
        country: 'United Kingdom',
        difficulty: 'easy',
        tips: 'The door is now black, but the location is still iconic',
        imageUrl: null,
        tags: ['romance', 'iconic', 'photo-op'],
    },
    {
        id: 2,
        movieTitle: 'When Harry Met Sally',
        movieId: 639, // TMDB ID
        sceneDescription: "Katz's Delicatessen - where Sally has her famous moment",
        locationName: "Katz's Delicatessen",
        address: '205 E Houston St, New York, NY 10002, USA',
        latitude: 40.7223,
        longitude: -73.9874,
        city: 'New York',
        country: 'USA',
        difficulty: 'easy',
        tips: "Order a pastrami sandwich and sit at the table marked 'Where Harry Met Sally'",
        imageUrl: null,
        tags: ['romance', 'restaurant', 'classic'],
    },
    {
        id: 3,
        movieTitle: 'La La Land',
        movieId: 313369, // TMDB ID
        sceneDescription: 'The magical planetarium dance scene',
        locationName: 'Griffith Observatory',
        address: '2800 E Observatory Rd, Los Angeles, CA 90027, USA',
        latitude: 34.1184,
        longitude: -118.3004,
        city: 'Los Angeles',
        country: 'USA',
        difficulty: 'medium',
        tips: 'Visit at sunset for the best views. Free admission to the building.',
        imageUrl: null,
        tags: ['romance', 'musical', 'scenic'],
    },
    {
        id: 4,
        movieTitle: 'Breakfast at Tiffany\'s',
        movieId: 590, // TMDB ID
        sceneDescription: 'Holly Golightly window shopping scene',
        locationName: 'Tiffany & Co. Fifth Avenue',
        address: '727 5th Ave, New York, NY 10022, USA',
        latitude: 40.7624,
        longitude: -73.9738,
        city: 'New York',
        country: 'USA',
        difficulty: 'easy',
        tips: 'Best visited early morning to recreate the iconic opening scene',
        imageUrl: null,
        tags: ['classic', 'iconic', 'luxury'],
    },
    {
        id: 5,
        movieTitle: 'Amélie',
        movieId: 194, // TMDB ID
        sceneDescription: 'The charming café where Amélie works',
        locationName: 'Café des Deux Moulins',
        address: '15 Rue Lepic, 75018 Paris, France',
        latitude: 48.8847,
        longitude: 2.3338,
        city: 'Paris',
        country: 'France',
        difficulty: 'easy',
        tips: 'Order a coffee and crème brûlée like in the movie',
        imageUrl: null,
        tags: ['romance', 'quirky', 'café'],
    },
    {
        id: 6,
        movieTitle: 'Roman Holiday',
        movieId: 653, // TMDB ID
        sceneDescription: 'The Mouth of Truth scene',
        locationName: 'Bocca della Verità',
        address: 'Piazza della Bocca della Verità, 18, 00186 Roma RM, Italy',
        latitude: 41.8882,
        longitude: 12.4818,
        city: 'Rome',
        country: 'Italy',
        difficulty: 'medium',
        tips: 'Arrive early to avoid long queues. Small donation required.',
        imageUrl: null,
        tags: ['classic', 'iconic', 'historic'],
    },
    {
        id: 7,
        movieTitle: 'Before Sunrise',
        movieId: 1646, // TMDB ID
        sceneDescription: 'The listening booth record store scene',
        locationName: 'Mariahilfer Strasse',
        address: 'Mariahilfer Str., 1060 Wien, Austria',
        latitude: 48.2008,
        longitude: 16.3501,
        city: 'Vienna',
        country: 'Austria',
        difficulty: 'medium',
        tips: 'Explore the charming streets and cafés around this area',
        imageUrl: null,
        tags: ['romance', 'indie', 'walking'],
    },
    {
        id: 8,
        movieTitle: 'Sleepless in Seattle',
        movieId: 858, // TMDB ID
        sceneDescription: 'The final meeting scene',
        locationName: 'Empire State Building Observatory',
        address: '20 W 34th St., New York, NY 10001, USA',
        latitude: 40.7484,
        longitude: -73.9857,
        city: 'New York',
        country: 'USA',
        difficulty: 'easy',
        tips: 'Visit at sunset or evening for romantic views',
        imageUrl: null,
        tags: ['romance', 'iconic', 'skyline'],
    },
    {
        id: 9,
        movieTitle: 'Midnight in Paris',
        movieId: 59436, // TMDB ID
        sceneDescription: 'The church steps where Gil waits',
        locationName: 'Church of Saint-Étienne-du-Mont',
        address: 'Place Sainte-Geneviève, 75005 Paris, France',
        latitude: 48.8466,
        longitude: 2.3479,
        city: 'Paris',
        country: 'France',
        difficulty: 'easy',
        tips: 'Visit at midnight for the full experience',
        imageUrl: null,
        tags: ['romance', 'nostalgic', 'magic'],
    },
    {
        id: 10,
        movieTitle: 'The Notebook',
        movieId: 11036, // TMDB ID
        sceneDescription: 'The iconic rain kiss scene location',
        locationName: 'Boone Hall Plantation',
        address: '1235 Long Point Rd, Mt Pleasant, SC 29464, USA',
        latitude: 32.8851,
        longitude: -79.8620,
        city: 'Charleston',
        country: 'USA',
        difficulty: 'medium',
        tips: 'Book a tour to see the Avenue of Oaks featured in the movie',
        imageUrl: null,
        tags: ['romance', 'dramatic', 'southern'],
    },
];

// Get all locations
export const getAllFilmingLocations = () => {
    return FILMING_LOCATIONS;
};

// Get location by ID
export const getFilmingLocationById = (id) => {
    return FILMING_LOCATIONS.find(loc => loc.id === id);
};

// Get locations by movie ID
export const getLocationsByMovieId = (movieId) => {
    return FILMING_LOCATIONS.filter(loc => loc.movieId === movieId);
};

// Get locations by city
export const getLocationsByCity = (city) => {
    return FILMING_LOCATIONS.filter(
        loc => loc.city.toLowerCase() === city.toLowerCase()
    );
};

// Search locations
export const searchFilmingLocations = (query) => {
    const lowerQuery = query.toLowerCase();
    return FILMING_LOCATIONS.filter(
        loc =>
            loc.movieTitle.toLowerCase().includes(lowerQuery) ||
            loc.locationName.toLowerCase().includes(lowerQuery) ||
            loc.city.toLowerCase().includes(lowerQuery) ||
            loc.sceneDescription.toLowerCase().includes(lowerQuery)
    );
};

// Get nearby locations (requires user's current location)
export const getNearbyLocations = (userLat, userLon, radiusKm = 50) => {
    return FILMING_LOCATIONS.filter(loc => {
        const distance = calculateDistance(userLat, userLon, loc.latitude, loc.longitude);
        return distance <= radiusKm;
    }).sort((a, b) => {
        const distA = calculateDistance(userLat, userLon, a.latitude, a.longitude);
        const distB = calculateDistance(userLat, userLon, b.latitude, b.longitude);
        return distA - distB;
    });
};

// Calculate distance between two coordinates (Haversine formula)
const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Earth's radius in km
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRad(lat1)) *
        Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
};

const toRad = (degrees) => {
    return degrees * (Math.PI / 180);
};

export { calculateDistance };