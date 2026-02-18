"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  MessageCircle, 
  Users, 
  MapPin, 
  Shield, 
  Zap,
  TrendingUp,
  Heart,
  ArrowRight,
  Menu,
  X
} from "lucide-react";

const FEATURES = [
  {
    icon: MessageCircle,
    title: "Real-Time Chat",
    description: "Instant conversations with your neighbors. No refresh needed.",
  },
  {
    icon: MapPin,
    title: "Local Directory",
    description: "Discover and support businesses in your community.",
  },
  {
    icon: Shield,
    title: "Safe & Moderated",
    description: "Community-driven moderation with AI assistance.",
  },
  {
    icon: Zap,
    title: "Emergency Alerts",
    description: "Get real-time updates during severe weather and events.",
  },
];

const SAMPLE_MESSAGES = [
  { id: 1, user: "Sarah M.", message: "Anyone else hear those sirens?", time: "2m ago", avatar: "SM" },
  { id: 2, user: "Mike T.", message: "Yeah, there's a storm warning for the east side", time: "1m ago", avatar: "MT" },
  { id: 3, user: "Jessica K.", message: "Stay safe everyone! 🙏", time: "Just now", avatar: "JK" },
];

const CITIES = [
  "Austin, TX",
  "Baton Rouge, LA",
  "Lafayette, LA",
  "New Orleans, LA",
  "Houston, TX",
];

export default function Home() {
  const [selectedCity, setSelectedCity] = useState("Austin, TX");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#FAF9F7]">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-[#E8E6E3]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-[#FF6B4A] rounded-xl flex items-center justify-center">
                <MessageCircle className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-[#2D3436]">YallWall</span>
            </div>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-[#636E72] hover:text-[#2D3436] transition-colors">Features</a>
              <a href="#cities" className="text-[#636E72] hover:text-[#2D3436] transition-colors">Cities</a>
              <a href="#business" className="text-[#636E72] hover:text-[#2D3436] transition-colors">For Business</a>
              <Button className="bg-[#FF6B4A] hover:bg-[#E55A3B] text-white rounded-full px-6">
                Join Chat
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <button 
              className="md:hidden p-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-[#E8E6E3] py-4">
            <div className="px-4 space-y-3">
              <a href="#features" className="block py-2 text-[#636E72]">Features</a>
              <a href="#cities" className="block py-2 text-[#636E72]">Cities</a>
              <a href="#business" className="block py-2 text-[#636E72]">For Business</a>
              <Button className="w-full bg-[#FF6B4A] hover:bg-[#E55A3B] text-white rounded-full">
                Join Chat
              </Button>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#FF6B4A]/5 via-transparent to-[#2A9D8F]/5" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left: Content */}
            <div className="text-center lg:text-left">
              <Badge className="bg-[#FFD93D]/20 text-[#2D3436] hover:bg-[#FFD93D]/30 mb-6 px-4 py-1.5 text-sm font-medium">
                <Zap className="w-4 h-4 mr-1 inline" />
                Now Live in 5 Cities
              </Badge>
              
              <h1 className="text-5xl lg:text-7xl font-bold text-[#2D3436] leading-tight mb-6">
                Your City's{" "}
                <span className="text-[#FF6B4A]">Living Room</span>
              </h1>
              
              <p className="text-xl text-[#636E72] mb-8 max-w-lg mx-auto lg:mx-0">
                Real-time conversations with your neighbors. Local news, emergency alerts, 
                and community connection—all in one place.
              </p>

              {/* City Selector */}
              <div className="flex flex-col sm:flex-row gap-4 mb-8 max-w-md mx-auto lg:mx-0">
                <select 
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  className="flex-1 px-4 py-3 rounded-full border border-[#E8E6E3] bg-white text-[#2D3436] focus:outline-none focus:ring-2 focus:ring-[#FF6B4A]"
                >
                  {CITIES.map(city => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
                <Button className="bg-[#FF6B4A] hover:bg-[#E55A3B] text-white rounded-full px-8 py-3 text-lg font-semibold shadow-lg shadow-[#FF6B4A]/25">
                  Join {selectedCity.split(',')[0]}
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </div>

              {/* Stats */}
              <div className="flex justify-center lg:justify-start gap-8">
                <div className="text-center">
                  <div className="text-3xl font-bold text-[#2D3436]">2.4k</div>
                  <div className="text-sm text-[#636E72]">Online Now</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-[#2D3436]">15k</div>
                  <div className="text-sm text-[#636E72]">Messages Today</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-[#2D3436]">5</div>
                  <div className="text-sm text-[#636E72]">Cities</div>
                </div>
              </div>
            </div>

            {/* Right: Chat Preview */}
            <div className="relative">
              <Card className="bg-white shadow-2xl border-0 rounded-3xl overflow-hidden">
                {/* Chat Header */}
                <div className="bg-[#FF6B4A] px-6 py-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-[#FFD93D] rounded-full live-indicator" />
                      <span className="text-white font-semibold">{selectedCity}</span>
                    </div>
                    <div className="flex items-center gap-2 text-white/80 text-sm">
                      <Users className="w-4 h-4" />
                      <span>247 online</span>
                    </div>
                  </div>
                </div>

                {/* Chat Messages */}
                <div className="p-6 space-y-4 bg-[#FAF9F7] min-h-[300px]">
                  {SAMPLE_MESSAGES.map((msg) => (
                    <div key={msg.id} className="flex gap-3 message-enter">
                      <Avatar className="w-10 h-10 bg-[#2A9D8F]">
                        <AvatarFallback className="bg-[#2A9D8F] text-white text-sm">
                          {msg.avatar}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold text-[#2D3436] text-sm">{msg.user}</span>
                          <span className="text-xs text-[#636E72]">{msg.time}</span>
                        </div>
                        <p className="text-[#2D3436] text-sm">{msg.message}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Chat Input */}
                <div className="p-4 bg-white border-t border-[#E8E6E3]">
                  <div className="flex gap-2">
                    <Input 
                      placeholder="Join the conversation..."
                      className="flex-1 rounded-full border-[#E8E6E3] bg-[#FAF9F7]"
                    />
                    <Button className="bg-[#FF6B4A] hover:bg-[#E55A3B] text-white rounded-full px-6">
                      Send
                    </Button>
                  </div>
                </div>
              </Card>

              {/* Decorative Elements */}
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-[#FFD93D]/20 rounded-full blur-2xl" />
              <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-[#2A9D8F]/20 rounded-full blur-2xl" />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-[#2D3436] mb-4">
              Everything Your Community Needs
            </h2>
            <p className="text-xl text-[#636E72] max-w-2xl mx-auto">
              From emergency alerts to local business discovery, YallWall keeps you connected.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {FEATURES.map((feature, index) => (
              <Card key={index} className="border-0 shadow-lg bg-[#FAF9F7] hover:shadow-xl transition-shadow">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-[#FF6B4A]/10 rounded-2xl flex items-center justify-center mb-4">
                    <feature.icon className="w-6 h-6 text-[#FF6B4A]" />
                  </div>
                  <h3 className="text-xl font-bold text-[#2D3436] mb-2">{feature.title}</h3>
                  <p className="text-[#636E72]">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Business Section */}
      <section id="business" className="py-24 bg-[#2A9D8F]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge className="bg-white/20 text-white mb-6">
                <TrendingUp className="w-4 h-4 mr-1" />
                For Local Business
              </Badge>
              <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
                Reach Your Community
              </h2>
              <p className="text-xl text-white/80 mb-8">
                Get your business in front of locals who care. Inline ads, sponsored posts, 
                and directory listings that actually convert.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button className="bg-white text-[#2A9D8F] hover:bg-white/90 rounded-full px-8 py-3 font-semibold">
                  List Your Business
                </Button>
                <Button variant="outline" className="border-white text-white hover:bg-white/10 rounded-full px-8 py-3">
                  View Pricing
                </Button>
              </div>
            </div>

            <div className="relative">
              <Card className="bg-white rounded-3xl shadow-2xl overflow-hidden">
                <div className="p-6">
                  <h3 className="text-lg font-bold text-[#2D3436] mb-4">Ad Preview</h3>
                  
                  {/* Mock Chat with Ad */}
                  <div className="space-y-3 mb-4">
                    <div className="flex gap-2">
                      <div className="w-8 h-8 bg-[#FF6B4A] rounded-full" />
                      <div className="bg-[#F5F3F0] rounded-2xl rounded-tl-sm px-4 py-2 text-sm">
                        Anyone know a good plumber?
                      </div>
                    </div>
                  </div>

                  {/* Business Card Ad */}
                  <Card className="bg-gradient-to-r from-[#FF6B4A]/5 to-[#2A9D8F]/5 border-[#FF6B4A]/20">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className="w-12 h-12 bg-[#FF6B4A] rounded-xl flex items-center justify-center">
                          <Heart className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-[#2D3436]">Acme Plumbing</span>
                            <Badge className="bg-[#FFD93D] text-[#2D3436] text-xs">Sponsored</Badge>
                          </div>
                          <p className="text-sm text-[#636E72]">24/7 Emergency Service • 4.9★ (127 reviews)</p>
                          <Button size="sm" className="mt-2 bg-[#FF6B4A] hover:bg-[#E55A3B] text-white rounded-full text-xs">
                            Call Now
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <div className="text-center text-xs text-[#636E72] mt-4">
                    Ads appear naturally every 10-15 messages
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#2D3436] text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-[#FF6B4A] rounded-lg flex items-center justify-center">
                  <MessageCircle className="w-5 h-5 text-white" />
                </div>
                <span className="text-lg font-bold">YallWall</span>
              </div>
              <p className="text-gray-400 text-sm">
                Your city's living room. Real-time chat for local communities.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="#" className="hover:text-white">Features</a></li>
                <li><a href="#" className="hover:text-white">Cities</a></li>
                <li><a href="#" className="hover:text-white">Business</a></li>
                <li><a href="#" className="hover:text-white">Pricing</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="#" className="hover:text-white">About</a></li>
                <li><a href="#" className="hover:text-white">Blog</a></li>
                <li><a href="#" className="hover:text-white">Careers</a></li>
                <li><a href="#" className="hover:text-white">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="#" className="hover:text-white">Privacy</a></li>
                <li><a href="#" className="hover:text-white">Terms</a></li>
                <li><a href="#" className="hover:text-white">Guidelines</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 pt-8 text-center text-gray-400 text-sm">
            © 2025 YallWall. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
