import { Bus, Seat } from '../context/BookingContext';

function generateSeats(busType: string): Seat[] {
  const seats: Seat[] = [];
  let seatCount = 0;

  if (busType === 'luxury') {
    // 2x2 layout for luxury buses (32 seats)
    for (let row = 1; row <= 8; row++) {
      const seatRow = String(row).padStart(2, '0');
      ['A', 'B', 'C', 'D'].forEach((letter) => {
        seatCount++;
        seats.push({
          id: `${seatRow}${letter}`,
          number: `${seatRow}${letter}`,
          isAvailable: Math.random() > 0.3, // 70% availability
          isSelected: false,
          type: row <= 2 ? 'premium' : 'regular',
          price: row <= 2 ? 1500 : 1200,
        });
      });
    }
  } else {
    // 2x3 layout for standard buses (48 seats)
    for (let row = 1; row <= 8; row++) {
      const seatRow = String(row).padStart(2, '0');
      ['A', 'B', 'C', 'D', 'E', 'F'].forEach((letter) => {
        seatCount++;
        seats.push({
          id: `${seatRow}${letter}`,
          number: `${seatRow}${letter}`,
          isAvailable: Math.random() > 0.25, // 75% availability
          isSelected: false,
          type: 'regular',
          price: 800,
        });
      });
    }
  }

  return seats;
}

export const mockRoutes = [
  'Lagos',
  'Abuja',
  'Kano',
  'Ibadan',
  'Port Harcourt',
  'Kaduna',
  'Enugu',
  'Ilorin',
  'Aba',
  'Jos',
  'Warri',
  'Calabar',
];

export const mockBuses: Bus[] = [
  {
    id: '1',
    operator: 'GIG Express',
    departureTime: '07:00',
    arrivalTime: '15:00',
    duration: '8h 0m',
    price: 1200,
    amenities: ['AC', 'WiFi', 'Entertainment', 'Charging Port'],
    busType: 'luxury',
    rating: 4.8,
    seats: generateSeats('luxury'),
  },
  {
    id: '2',
    operator: 'ABC Transport',
    departureTime: '09:30',
    arrivalTime: '17:45',
    duration: '8h 15m',
    price: 800,
    amenities: ['AC', 'Reclining Seats'],
    busType: 'standard',
    rating: 4.2,
    seats: generateSeats('standard'),
  },
  {
    id: '3',
    operator: 'Peace Mass Transit',
    departureTime: '12:00',
    arrivalTime: '20:30',
    duration: '8h 30m',
    price: 950,
    amenities: ['AC', 'Entertainment', 'Snacks'],
    busType: 'standard',
    rating: 4.5,
    seats: generateSeats('standard'),
  },
  {
    id: '4',
    operator: 'Young Shall Grow',
    departureTime: '14:30',
    arrivalTime: '22:45',
    duration: '8h 15m',
    price: 1000,
    amenities: ['AC', 'WiFi', 'Refreshments'],
    busType: 'luxury',
    rating: 4.6,
    seats: generateSeats('luxury'),
  },
  {
    id: '5',
    operator: 'God is Good Motors',
    departureTime: '18:00',
    arrivalTime: '02:30',
    duration: '8h 30m',
    price: 1100,
    amenities: ['AC', 'WiFi', 'Entertainment', 'Blanket'],
    busType: 'luxury',
    rating: 4.7,
    seats: generateSeats('luxury'),
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