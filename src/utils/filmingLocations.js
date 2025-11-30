// utils/filmingLocations.js - Film Locations Database

// Since there's no comprehensive filming locations API, 
// we'll create a curated database of iconic filming locations

export const FILMING_LOCATIONS = [
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