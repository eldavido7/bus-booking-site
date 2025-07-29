import { Bus, Seat, Trip, Booking } from '../context/BookingContext';

function generateSeats(busType: string): Seat[] {
  const seats: Seat[] = [];
  let seatCount = 0;
  const isLuxury = busType.toLowerCase() === 'luxury';
  const layout = isLuxury ? ['A', 'B', 'C', 'D'] : ['A', 'B', 'C', 'D', 'E', 'F'];
  const rows = isLuxury ? 8 : 8;

  for (let row = 1; row <= rows; row++) {
    const seatRow = String(row).padStart(2, '0');
    layout.forEach((letter) => {
      seatCount++;
      seats.push({
        id: `${seatRow}${letter}`,
        number: `${seatRow}${letter}`,
        isAvailable: Math.random() > (isLuxury ? 0.3 : 0.25),
        isSelected: false,
        type: isLuxury && row <= 2 ? 'premium' : 'regular',
        price: isLuxury && row <= 2 ? 1500 : isLuxury ? 1200 : 800,
      });
    });
  }

  return seats;
}

export const mockRoutes = [
  'Lagos', 'Abuja', 'Kano', 'Ibadan', 'Port Harcourt', 'Kaduna', 'Enugu',
  'Ilorin', 'Aba', 'Jos', 'Warri', 'Calabar',
];

export const mockBuses: Bus[] = [
  {
    id: '1',
    operator: 'GIG Express',
    busType: 'luxury',
    seats: generateSeats('luxury').map((seat) =>
      seat.number === '01A' || seat.number === '01B' ? { ...seat, isAvailable: false } : seat
    ),
    amenities: ['AC', 'WiFi', 'Entertainment', 'Charging Port'],
    rating: 4.8,
  },
  {
    id: '2',
    operator: 'ABC Transport',
    busType: 'standard',
    seats: generateSeats('standard').map((seat) =>
      seat.number === '03C' ? { ...seat, isAvailable: false } : seat
    ),
    amenities: ['AC', 'Reclining Seats'],
    rating: 4.2,
  },
  {
    id: '3',
    operator: 'Peace Mass Transit',
    busType: 'standard',
    seats: generateSeats('standard'),
    amenities: ['AC', 'Entertainment', 'Snacks'],
    rating: 4.5,
  },
  {
    id: '4',
    operator: 'Young Shall Grow',
    busType: 'luxury',
    seats: generateSeats('luxury'),
    amenities: ['AC', 'WiFi', 'Refreshments'],
    rating: 4.6,
  },
  {
    id: '5',
    operator: 'God is Good Motors',
    busType: 'luxury',
    seats: generateSeats('luxury'),
    amenities: ['AC', 'WiFi', 'Entertainment', 'Blanket'],
    rating: 4.7,
  },
];

export const mockTrips: Trip[] = [
  {
    id: 't1',
    busId: '1',
    from: 'Lagos',
    to: 'Abuja',
    date: new Date('2025-07-29'),
    departureTime: '07:00',
    arrivalTime: '15:00',
    duration: '8h 0m',
    price: 1200,
    isAvailable: true,
  },
  {
    id: 't2',
    busId: '2',
    from: 'Abuja',
    to: 'Kano',
    date: new Date('2025-07-29'),
    departureTime: '09:30',
    arrivalTime: '17:45',
    duration: '8h 15m',
    price: 800,
    isAvailable: true,
  },
  {
    id: 't3',
    busId: '3',
    from: 'Enugu',
    to: 'Lagos',
    date: new Date('2025-07-29'),
    departureTime: '12:00',
    arrivalTime: '20:30',
    duration: '8h 30m',
    price: 950,
    isAvailable: false,
  },
  {
    id: 't4',
    busId: '4',
    from: 'Port Harcourt',
    to: 'Jos',
    date: new Date('2025-07-29'),
    departureTime: '14:30',
    arrivalTime: '22:45',
    duration: '8h 15m',
    price: 1000,
    isAvailable: true,
  },
  {
    id: 't5',
    busId: '5',
    from: 'Kaduna',
    to: 'Ibadan',
    date: new Date('2025-07-29'),
    departureTime: '18:00',
    arrivalTime: '02:30',
    duration: '8h 30m',
    price: 1100,
    isAvailable: true,
  },
];

export const mockBookings: Booking[] = [
  {
    reference: 'TE12345678',
    status: 'confirmed',
    tripId: 't1',
    busId: '1',
    route: { from: 'Lagos', to: 'Abuja' },
    date: '2025-07-29',
    time: '07:00',
    operator: 'GIG Express',
    passengers: [
      { name: 'John Doe', seat: '01A' },
      { name: 'Jane Doe', seat: '01B' },
    ],
    contact: {
      email: 'john.doe@email.com',
      phone: '+2348012345678',
    },
    totalAmount: 2700, // 1500 (premium) + 1200 (regular)
    bookingDate: '2025-07-25',
  },
  {
    reference: 'TE87654321',
    status: 'cancelled',
    tripId: 't2',
    busId: '2',
    route: { from: 'Abuja', to: 'Kano' },
    date: '2025-07-29',
    time: '09:30',
    operator: 'ABC Transport',
    passengers: [{ name: 'Ahmed Ibrahim', seat: '03C' }],
    contact: {
      email: 'ahmed.ibrahim@email.com',
      phone: '+2348023456789',
    },
    totalAmount: 800,
    bookingDate: '2025-07-26',
  },
];

export const testimonials = [
  {
    name: 'Adebayo Johnson',
    location: 'Lagos',
    rating: 5,
    comment: 'Excellent service! The booking process was smooth and the bus was very comfortable.',
    image: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
  },
  {
    name: 'Fatima Abdul',
    location: 'Abuja',
    rating: 5,
    comment: 'I love how easy it is to select seats and track my booking. Highly recommended!',
    image: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
  },
  {
    name: 'Emeka Okafor',
    location: 'Enugu',
    rating: 4,
    comment: 'Great platform with reliable buses. The payment process is secure and fast.',
    image: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
  },
];

export const mockUsers = [
  {
    id: "1",
    firstName: "Admin",
    lastName: "User",
    email: "admin@kadzai.com",
    password: "admin",
    phone: "+2348012345678",
    createdAt: "2024-01-01T10:00:00Z",
    isActive: true,
  },
  {
    id: "2",
    firstName: "Jane",
    lastName: "Doe",
    email: "jane@example.com",
    password: "admin",
    phone: "+2348098765432",
    createdAt: "2024-02-15T12:30:00Z",
    isActive: true,
  },
];