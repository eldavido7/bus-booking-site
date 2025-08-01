"use client";

import React, {
  createContext,
  useContext,
  useReducer,
  ReactNode,
  useState,
} from "react";

export interface Seat {
  id: string;
  number: string;
  isAvailable: boolean;
  isSelected: boolean;
  type: "regular" | "premium" | "driver";
  price?: number;
}

export interface BusType {
  id: string;
  name: string;
  seats: number;
}

export interface Bus {
  id: string;
  operator: string;
  busType: string;
  seats: Seat[];
  amenities: string[];
  rating: number;
}

export interface Trip {
  id: string;
  busId: string;
  from: string;
  to: string;
  date: Date;
  departureTime: string;
  arrivalTime: string;
  price: number;
  isAvailable: boolean;
  duration: string; // e.g., "8h 0m"
}

export interface Passenger {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  age: number;
  gender: "male" | "female";
}

export interface Booking {
  reference: string;
  status: "confirmed" | "cancelled" | "completed";
  tripId: string;
  busId: string;
  route: { from: string; to: string };
  date: string;
  time: string;
  operator: string;
  passengers: { name: string; seat: string }[];
  contact: { email: string; phone: string };
  totalAmount: number;
  bookingDate: string;
}

export interface BookingState {
  step: number;
  searchData: {
    from: string;
    to: string;
    date: string;
    passengers: number;
  };
  selectedTrip: Trip | null;
  selectedBus: Bus | null;
  selectedSeats: Seat[];
  passengers: Passenger[];
  totalAmount: number;
  bookings: Booking[];
}

type BookingAction =
  | { type: "SET_STEP"; payload: number }
  | { type: "SET_SEARCH_DATA"; payload: Partial<BookingState["searchData"]> }
  | { type: "SET_SELECTED_TRIP"; payload: Trip }
  | { type: "SET_SELECTED_BUS"; payload: Bus }
  | { type: "TOGGLE_SEAT"; payload: Seat }
  | { type: "SET_PASSENGERS"; payload: Passenger[] }
  | { type: "ADD_BOOKING"; payload: Booking }
  | {
      type: "CANCEL_BOOKING";
      payload: { reference: string; busId: string; seatNumbers: string[] };
    }
  | { type: "RESET_BOOKING" };

const initialState: BookingState = {
  step: 1,
  searchData: { from: "", to: "", date: "", passengers: 1 },
  selectedTrip: null,
  selectedBus: null,
  selectedSeats: [],
  passengers: [],
  totalAmount: 0,
  bookings: [],
};

function bookingReducer(
  state: BookingState,
  action: BookingAction
): BookingState {
  switch (action.type) {
    case "SET_STEP":
      return { ...state, step: action.payload };
    case "SET_SEARCH_DATA":
      return {
        ...state,
        searchData: { ...state.searchData, ...action.payload },
      };
    case "SET_SELECTED_TRIP":
      return { ...state, selectedTrip: action.payload, selectedSeats: [] };
    case "SET_SELECTED_BUS":
      return { ...state, selectedBus: action.payload };
    case "TOGGLE_SEAT":
      const seatExists = state.selectedSeats.find(
        (s) => s.id === action.payload.id
      );
      const newSelectedSeats = seatExists
        ? state.selectedSeats.filter((s) => s.id !== action.payload.id)
        : [...state.selectedSeats, action.payload];
      const totalAmount = newSelectedSeats.reduce(
        (sum, seat) => sum + (seat.price || state.selectedTrip?.price || 0),
        0
      );
      return { ...state, selectedSeats: newSelectedSeats, totalAmount };
    case "SET_PASSENGERS":
      return { ...state, passengers: action.payload };
    case "ADD_BOOKING":
      return { ...state, bookings: [...state.bookings, action.payload] };
    case "CANCEL_BOOKING":
      return {
        ...state,
        bookings: state.bookings.map((booking) =>
          booking.reference === action.payload.reference
            ? { ...booking, status: "cancelled" }
            : booking
        ),
        selectedBus:
          state.selectedBus?.id === action.payload.busId
            ? {
                ...state.selectedBus,
                seats: state.selectedBus.seats.map((seat) =>
                  action.payload.seatNumbers.includes(seat.number)
                    ? { ...seat, isAvailable: true }
                    : seat
                ),
              }
            : state.selectedBus,
      };
    case "RESET_BOOKING":
      return { ...initialState, bookings: state.bookings };
    default:
      return state;
  }
}

const BookingContext = createContext<{
  state: BookingState;
  dispatch: React.Dispatch<BookingAction>;
} | null>(null);

const BusTypeContext = createContext<{
  busTypes: BusType[];
  setBusTypes: React.Dispatch<React.SetStateAction<BusType[]>>;
} | null>(null);

export function BookingProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(bookingReducer, initialState);
  const [busTypes, setBusTypes] = useState<BusType[]>([
    { id: "1", name: "Standard", seats: 48 },
    { id: "2", name: "Luxury", seats: 32 },
  ]);

  return (
    <BookingContext.Provider value={{ state, dispatch }}>
      <BusTypeContext.Provider value={{ busTypes, setBusTypes }}>
        {children}
      </BusTypeContext.Provider>
    </BookingContext.Provider>
  );
}

export function useBooking() {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error("useBooking must be used within a BookingProvider");
  }
  return context;
}

export function useBusTypes() {
  const context = useContext(BusTypeContext);
  if (!context) {
    throw new Error("useBusTypes must be used within a BookingProvider");
  }
  return context;
}
