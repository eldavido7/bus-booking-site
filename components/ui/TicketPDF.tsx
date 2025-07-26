import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  //   Font,
} from "@react-pdf/renderer";

// Optionally register a font for better matching
// Font.register({ family: 'Inter', src: '...' });

const styles = StyleSheet.create({
  page: {
    padding: 32,
    fontFamily: "Helvetica",
    fontSize: 12,
    backgroundColor: "#f0f9ff", // Light blue gradient background similar to the page
  },

  // Header section with TravelEase branding
  headerSection: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 16,
    marginBottom: 24,
    border: "1px solid #e5e7eb",
    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
  },

  brandHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },

  brandIcon: {
    width: 32,
    height: 32,
    backgroundColor: "#2563eb",
    borderRadius: 6,
    marginRight: 8,
    justifyContent: "center",
    alignItems: "center",
  },

  brandText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#111827",
  },

  // Success message section
  successSection: {
    textAlign: "center",
    marginBottom: 24,
  },

  successTitle: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 8,
  },

  successSubtext: {
    fontSize: 16,
    color: "#6b7280",
    marginBottom: 4,
  },

  // Main ticket card
  ticketCard: {
    backgroundColor: "#fff",
    borderRadius: 8,
    marginBottom: 20,
    border: "1px solid #e5e7eb",
    boxShadow: "0 4px 6px rgba(0,0,0,0.05)",
  },

  ticketHeader: {
    backgroundColor: "#2563eb",
    color: "#fff",
    padding: 16,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  ticketTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },

  referenceBadge: {
    backgroundColor: "#fff",
    color: "#2563eb",
    borderRadius: 4,
    paddingHorizontal: 12,
    paddingVertical: 6,
    fontWeight: "bold",
    fontSize: 12,
  },

  ticketContent: {
    padding: 24,
  },

  // Two column layout
  twoColumnRow: {
    flexDirection: "row",
    marginBottom: 24,
  },

  leftColumn: {
    flex: 1,
    marginRight: 24,
  },

  rightColumn: {
    flex: 1,
  },

  // Section headers with icons
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    paddingBottom: 8,
    borderBottom: "1px solid #e5e7eb",
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#111827",
    marginLeft: 8,
  },

  sectionIcon: {
    fontSize: 16,
    color: "#2563eb",
    width: 20,
    textAlign: "center",
  },

  // Data rows
  dataRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
    paddingVertical: 2,
  },

  dataLabel: {
    color: "#6b7280",
    fontSize: 12,
    flex: 1,
  },

  dataValue: {
    fontWeight: "bold",
    color: "#111827",
    fontSize: 12,
    flex: 1.5,
    textAlign: "right",
  },

  // Passenger cards
  passengerCard: {
    border: "1px solid #e5e7eb",
    borderRadius: 6,
    padding: 12,
    marginBottom: 8,
    backgroundColor: "#fafafa",
  },

  passengerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },

  passengerInfo: {
    flex: 1,
  },

  passengerName: {
    fontSize: 13,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 2,
  },

  passengerDetails: {
    fontSize: 11,
    color: "#6b7280",
    marginBottom: 2,
  },

  primaryContact: {
    fontSize: 10,
    color: "#2563eb",
    fontWeight: "bold",
  },

  seatInfo: {
    textAlign: "right",
  },

  seatNumber: {
    fontSize: 13,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 2,
  },

  seatType: {
    fontSize: 11,
    color: "#6b7280",
  },

  // Contact section
  contactRow: {
    flexDirection: "row",
    marginBottom: 8,
    alignItems: "center",
  },

  contactIcon: {
    fontSize: 14,
    color: "#2563eb",
    width: 16,
    textAlign: "center",
    marginRight: 8,
  },

  contactLabel: {
    color: "#6b7280",
    fontSize: 12,
    marginRight: 8,
  },

  contactValue: {
    fontWeight: "bold",
    color: "#111827",
    fontSize: 12,
  },

  // Payment summary
  paymentSummary: {
    backgroundColor: "#f9fafb",
    borderRadius: 6,
    padding: 16,
    marginTop: 16,
  },

  paymentRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },

  paymentLabel: {
    fontSize: 12,
    color: "#111827",
  },

  paymentAmount: {
    fontSize: 12,
    color: "#111827",
  },

  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: 12,
    borderTop: "1px solid #e5e7eb",
    marginTop: 8,
  },

  totalLabel: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#111827",
  },

  totalAmount: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#16a34a",
  },

  // Important information section
  infoCard: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 20,
    border: "1px solid #e5e7eb",
    marginBottom: 20,
  },

  infoTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 16,
  },

  infoSection: {
    marginBottom: 20,
  },

  infoSectionTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 8,
  },

  infoList: {
    fontSize: 11,
    color: "#6b7280",
    lineHeight: 1.4,
  },

  // Footer
  footer: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 20,
    textAlign: "center",
    border: "1px solid #e5e7eb",
  },

  footerTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 8,
  },

  footerText: {
    fontSize: 12,
    color: "#6b7280",
    lineHeight: 1.4,
  },
});

interface Seat {
  id: string | number;
  number: string | number;
  type: string;
  price?: number;
}

interface Passenger {
  firstName: string;
  lastName: string;
  age: number;
  gender: string;
  email?: string;
  phone?: string;
}

interface Booking {
  reference: string;
  searchData: {
    from: string;
    to: string;
    date: string;
  };
  selectedBus: {
    departureTime: string;
    arrivalTime: string;
    duration: string;
    operator: string;
    price?: number;
  };
  selectedSeats: Seat[];
  passengers: Passenger[];
  totalAmount: number;
}

export function TicketPDF({ booking }: { booking: Booking }) {
  // Helper function to format numbers without locale issues
  const formatCurrency = (amount: number): string => {
    return "₦" + amount.toLocaleString("en-NG");
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header with branding */}
        <View style={styles.headerSection}>
          <View style={styles.brandHeader}>
            <View style={styles.brandIcon}>
              <Text style={{ color: "#fff", fontSize: 16, fontWeight: "bold" }}>
                T
              </Text>
            </View>
            <Text style={styles.brandText}>TravelEase</Text>
          </View>
        </View>

        {/* Success message */}
        <View style={styles.successSection}>
          <Text style={styles.successTitle}>Booking Confirmed!</Text>
          <Text style={styles.successSubtext}>
            Your bus ticket has been successfully booked. We've sent the
          </Text>
          <Text style={styles.successSubtext}>
            confirmation details to your email.
          </Text>
        </View>

        {/* Main ticket card */}
        <View style={styles.ticketCard}>
          <View style={styles.ticketHeader}>
            <Text style={styles.ticketTitle}>Booking Confirmation</Text>
            <Text style={styles.referenceBadge}>{booking.reference}</Text>
          </View>

          <View style={styles.ticketContent}>
            {/* Two column layout for trip info and passenger details */}
            <View style={styles.twoColumnRow}>
              {/* Trip Information */}
              <View style={styles.leftColumn}>
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionIcon}>🚗</Text>
                  <Text style={styles.sectionTitle}>Trip Information</Text>
                </View>

                <View style={styles.dataRow}>
                  <Text style={styles.dataLabel}>From:</Text>
                  <Text style={styles.dataValue}>
                    {booking.searchData.from}
                  </Text>
                </View>
                <View style={styles.dataRow}>
                  <Text style={styles.dataLabel}>To:</Text>
                  <Text style={styles.dataValue}>{booking.searchData.to}</Text>
                </View>
                <View style={styles.dataRow}>
                  <Text style={styles.dataLabel}>Date:</Text>
                  <Text style={styles.dataValue}>
                    {new Date(booking.searchData.date).toLocaleDateString()}
                  </Text>
                </View>
                <View style={styles.dataRow}>
                  <Text style={styles.dataLabel}>Departure:</Text>
                  <Text style={styles.dataValue}>
                    {booking.selectedBus.departureTime}
                  </Text>
                </View>
                <View style={styles.dataRow}>
                  <Text style={styles.dataLabel}>Arrival:</Text>
                  <Text style={styles.dataValue}>
                    {booking.selectedBus.arrivalTime}
                  </Text>
                </View>
                <View style={styles.dataRow}>
                  <Text style={styles.dataLabel}>Duration:</Text>
                  <Text style={styles.dataValue}>
                    {booking.selectedBus.duration}
                  </Text>
                </View>
                <View style={styles.dataRow}>
                  <Text style={styles.dataLabel}>Bus Operator:</Text>
                  <Text style={styles.dataValue}>
                    {booking.selectedBus.operator}
                  </Text>
                </View>
              </View>

              {/* Passenger Details */}
              <View style={styles.rightColumn}>
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionIcon}>👤</Text>
                  <Text style={styles.sectionTitle}>Passenger Details</Text>
                </View>

                {booking.passengers.map((passenger, index) => (
                  <View key={index} style={styles.passengerCard}>
                    <View style={styles.passengerRow}>
                      <View style={styles.passengerInfo}>
                        <Text style={styles.passengerName}>
                          {passenger.firstName} {passenger.lastName}
                        </Text>
                        <Text style={styles.passengerDetails}>
                          {passenger.age} years, {passenger.gender}
                        </Text>
                        {index === 0 && (
                          <Text style={styles.primaryContact}>
                            Primary Contact
                          </Text>
                        )}
                      </View>
                      <View style={styles.seatInfo}>
                        <Text style={styles.seatNumber}>
                          Seat {booking.selectedSeats[index]?.number}
                        </Text>
                        <Text style={styles.seatType}>
                          {booking.selectedSeats[index]?.type === "premium"
                            ? "Premium"
                            : "Regular"}
                        </Text>
                      </View>
                    </View>
                  </View>
                ))}
              </View>
            </View>

            {/* Contact Information */}
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Contact Information</Text>
            </View>
            <View style={{ flexDirection: "row", marginBottom: 16 }}>
              <View style={styles.contactRow}>
                <Text style={styles.contactIcon}>📧</Text>
                <Text style={styles.contactLabel}>Email:</Text>
                <Text style={styles.contactValue}>
                  {booking.passengers[0]?.email}
                </Text>
              </View>
              <View style={[styles.contactRow, { marginLeft: 24 }]}>
                <Text style={styles.contactIcon}>📞</Text>
                <Text style={styles.contactLabel}>Phone:</Text>
                <Text style={styles.contactValue}>
                  {booking.passengers[0]?.phone}
                </Text>
              </View>
            </View>

            {/* Payment Summary */}
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Payment Summary</Text>
            </View>
            <View style={styles.paymentSummary}>
              {booking.selectedSeats.map((seat, index) => (
                <View key={seat.id} style={styles.paymentRow}>
                  <Text style={styles.paymentLabel}>
                    Seat {seat.number} - {booking.passengers[index]?.firstName}
                  </Text>
                  <Text style={styles.paymentAmount}>
                    ₦
                    {formatCurrency(
                      seat.price ?? booking.selectedBus.price ?? 0
                    )}
                  </Text>
                </View>
              ))}
              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>Total Paid:</Text>
                <Text style={styles.totalAmount}>
                  ₦{formatCurrency(booking.totalAmount)}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Important Information */}
        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>Important Information</Text>
          <View style={{ flexDirection: "row" }}>
            <View style={[styles.infoSection, { flex: 1, marginRight: 24 }]}>
              <Text style={styles.infoSectionTitle}>Before You Travel</Text>
              <Text style={styles.infoList}>
                • Arrive at the terminal 30 minutes before departure{"\n"}•
                Bring a valid government-issued ID{"\n"}• Your booking
                reference: {booking.reference}
                {"\n"}• Check weather conditions for your travel date
              </Text>
            </View>
            <View style={[styles.infoSection, { flex: 1 }]}>
              <Text style={styles.infoSectionTitle}>Need Help?</Text>
              <Text style={styles.infoList}>
                • Email: support@travelease.com{"\n"}• Phone: +234 800 123 4567
                {"\n"}• WhatsApp: +234 800 123 4567{"\n"}• Available 24/7 for
                assistance
              </Text>
            </View>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerTitle}>
            Thank you for choosing TravelEase!
          </Text>
          <Text style={styles.footerText}>
            We hope you have a comfortable and safe journey. Don't forget to
            {"\n"}
            rate your experience after your trip.
          </Text>
        </View>
      </Page>
    </Document>
  );
}
