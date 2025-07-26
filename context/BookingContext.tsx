'use client';

import React, { createContext, useContext, useReducer, ReactNode } from 'react';

export interface Seat {
  id: string;
  number: string;
  isAvailable: boolean;
  isSelected: boolean;
  type: 'regular' | 'premium' | 'driver';
  price?: number;
}

export interface Bus {
  id: string;
  operator: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  price: number;
  amenities: string[];
  busType: string;
  rating: number;
  seats: Seat[];
}

export interface Passenger {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  age: number;
  gender: 'male' | 'female';
}

export interface BookingState {
  step: number;
  searchData: {
    from: string;
    to: string;
    date: string;
    passengers: number;
  };
  selectedBus: Bus | null;
  selectedSeats: Seat[];
  passengers: Passenger[];
  totalAmount: number;
}

type BookingAction =
  | { type: 'SET_STEP'; payload: number }
  | { type: 'SET_SEARCH_DATA'; payload: Partial<BookingState['searchData']> }
  | { type: 'SET_SELECTED_BUS'; payload: Bus }
  | { type: 'TOGGLE_SEAT'; payload: Seat }
  | { type: 'SET_PASSENGERS'; payload: Passenger[] }
  | { type: 'RESET_BOOKING' };

const initialState: BookingState = {
  step: 1,
  searchData: {
    from: '',
    to: '',
    date: '',
    passengers: 1,
  },
  selectedBus: null,
  selectedSeats: [],
  passengers: [],
  totalAmount: 0,
};

function bookingReducer(state: BookingState, action: BookingAction): BookingState {
  switch (action.type) {
    case 'SET_STEP':
      return { ...state, step: action.payload };
    case 'SET_SEARCH_DATA':
      return { ...state, searchData: { ...state.searchData, ...action.payload } };
    case 'SET_SELECTED_BUS':
      return { ...state, selectedBus: action.payload, selectedSeats: [] };
    case 'TOGGLE_SEAT':
      const seatExists = state.selectedSeats.find(s => s.id === action.payload.id);
      const newSelectedSeats = seatExists
        ? state.selectedSeats.filter(s => s.id !== action.payload.id)
        : [...state.selectedSeats, action.payload];
      
      const totalAmount = newSelectedSeats.reduce((sum, seat) => sum + (seat.price || state.selectedBus?.price || 0), 0);
      
      return {
        ...state,
        selectedSeats: newSelectedSeats,
        totalAmount,
      };
    case 'SET_PASSENGERS':
      return { ...state, passengers: action.payload };
    case 'RESET_BOOKING':
      return initialState;
    default:
      return state;
  }
}

const BookingContext = createContext<{
  state: BookingState;
  dispatch: React.Dispatch<BookingAction>;
} | null>(null);

export function BookingProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(bookingReducer, initialState);

  return (
    <BookingContext.Provider value={{ state, dispatch }}>
      {children}
    </BookingContext.Provider>
  );
}

export function useBooking() {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error('useBooking must be used within a BookingProvider');
  }
  return context;
}