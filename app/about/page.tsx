"use client";

import { Card, CardContent } from "../../components/ui/card";
import { Shield, Clock, Headphones, Users, Award, MapPin } from "lucide-react";

export default function About() {
  const stats = [
    { label: "Happy Customers", value: "50,000+", icon: Users },
    { label: "Cities Connected", value: "25+", icon: MapPin },
    { label: "Years of Service", value: "10+", icon: Award },
    { label: "Fleet Size", value: "200+", icon: Shield },
  ];

  const values = [
    {
      icon: Shield,
      title: "Safety First",
      description:
        "Your safety is our top priority. All our buses undergo regular maintenance and safety checks.",
    },
    {
      icon: Clock,
      title: "Punctuality",
      description:
        "We value your time and ensure our buses run on schedule with real-time tracking.",
    },
    {
      icon: Headphones,
      title: "24/7 Support",
      description:
        "Our customer support team is always available to assist you with any queries.",
    },
    {
      icon: Users,
      title: "Customer Focus",
      description:
        "We continuously improve our services based on customer feedback and needs.",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">T</span>
              </div>
              <span className="text-2xl font-bold text-gray-900">
                TravelEase
              </span>
            </div>
            <nav className="hidden md:flex items-center space-x-8">
              <a
                href="/"
                className="text-gray-600 hover:text-blue-600 transition-colors"
              >
                Home
              </a>
              <a
                href="/trip-search"
                className="text-gray-600 hover:text-blue-600 transition-colors"
              >
                Find Trip
              </a>
              <a href="/about" className="text-blue-600 font-medium">
                About
              </a>
              <a
                href="/contact"
                className="text-gray-600 hover:text-blue-600 transition-colors"
              >
                Contact
              </a>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            About TravelEase
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Connecting Nigeria through comfortable, reliable, and affordable bus
            transportation since 2014.
          </p>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <stat.icon className="w-8 h-8 text-blue-600" />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">
                  {stat.value}
                </div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Our Story
              </h2>
              <div className="space-y-4 text-gray-600">
                <p>
                  TravelEase was founded in 2014 with a simple mission: to make
                  intercity travel in Nigeria comfortable, reliable, and
                  accessible to everyone. What started as a small transport
                  company with just 5 buses has grown into one of Nigeria's most
                  trusted travel brands.
                </p>
                <p>
                  Over the years, we've invested heavily in modern fleet
                  management, customer service training, and technology to
                  ensure that every journey with us is safe and enjoyable. Our
                  commitment to excellence has earned us the trust of over
                  50,000 satisfied customers.
                </p>
                <p>
                  Today, we operate across 25+ cities in Nigeria, connecting
                  families, enabling business, and making dreams possible
                  through reliable transportation.
                </p>
              </div>
            </div>
            <div className="relative">
              <img
                src="https://images.pexels.com/photos/1010973/pexels-photo-1010973.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop"
                alt="Modern bus fleet"
                className="rounded-lg shadow-xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Our Values
            </h2>
            <p className="text-xl text-gray-600">
              The principles that guide everything we do
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <Card
                key={index}
                className="text-center p-6 hover:shadow-lg transition-shadow"
              >
                <CardContent className="p-0">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <value.icon className="w-8 h-8 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">
                    {value.title}
                  </h3>
                  <p className="text-gray-600">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Leadership Team
            </h2>
            <p className="text-xl text-gray-600">
              Meet the people driving our vision forward
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Adebayo Ogundimu",
                role: "Chief Executive Officer",
                image:
                  "https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop",
                bio: "15+ years in transportation industry",
              },
              {
                name: "Fatima Abdullahi",
                role: "Chief Operations Officer",
                image:
                  "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop",
                bio: "Expert in fleet management and logistics",
              },
              {
                name: "Emeka Okafor",
                role: "Chief Technology Officer",
                image:
                  "https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop",
                bio: "Leading digital transformation initiatives",
              },
            ].map((member, index) => (
              <Card
                key={index}
                className="text-center overflow-hidden hover:shadow-lg transition-shadow"
              >
                <CardContent className="p-0">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-64 object-cover"
                  />
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {member.name}
                    </h3>
                    <p className="text-blue-600 font-medium mb-2">
                      {member.role}
                    </p>
                    <p className="text-gray-600 text-sm">{member.bio}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-6">
                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">T</span>
                </div>
                <span className="text-2xl font-bold">TravelEase</span>
              </div>
              <p className="text-gray-400">
                Making travel comfortable, safe, and affordable for everyone
                across Nigeria.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-3 text-gray-400">
                <li>
                  <a href="/" className="hover:text-white transition-colors">
                    Book a Trip
                  </a>
                </li>
                <li>
                  <a
                    href="/trip-search"
                    className="hover:text-white transition-colors"
                  >
                    Track Booking
                  </a>
                </li>
                <li>
                  <a
                    href="/contact"
                    className="hover:text-white transition-colors"
                  >
                    Help Center
                  </a>
                </li>
                <li>
                  <a
                    href="/about"
                    className="hover:text-white transition-colors"
                  >
                    About Us
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Support</h3>
              <ul className="space-y-3 text-gray-400">
                <li>
                  <a
                    href="/contact"
                    className="hover:text-white transition-colors"
                  >
                    Customer Care
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Refund Policy
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Contact Info</h3>
              <ul className="space-y-3 text-gray-400">
                <li>Email: support@travelease.com</li>
                <li>Phone: +234 800 123 4567</li>
                <li>Available 24/7</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; 2024 TravelEase. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
