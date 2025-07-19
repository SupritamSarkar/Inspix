import React,{useState} from "react";
import { Link } from "react-router-dom"; // Import Link for navigation
import {
  Download,
  Heart,
  Users,
  Upload,
  MessageCircle,
  Eye,
  Sparkles
} from "lucide-react";



const features = [
  {
    icon: Upload,
    title: "Upload & Share",
    description:
      "Share your creative wallpapers with the world. High-quality uploads with full CRUD functionality.",
  },
  {
    icon: Heart,
    title: "Like & Interact",
    description:
      "Show appreciation for amazing artwork with likes and real-time interactions.",
  },
  {
    icon: MessageCircle,
    title: "Comment & Discuss",
    description:
      "Engage with the community through comments and meaningful discussions.",
  },
  {
    icon: Download,
    title: "Free Downloads",
    description:
      "Download stunning wallpapers in high resolution for your devices.",
  },
  {
    icon: Users,
    title: "Follow Artists",
    description:
      "Build your network by following your favorite artists and creators.",
  },
  {
    icon: Eye,
    title: "Profile Views",
    description:
      "Track your profile visits and see who's interested in your work.",
  },
];

const Landing = () => {
  
  const [loading, setLoading] = useState(false);

  const handleRedirect = (url) => {
    setLoading(true); // show loading screen
    setTimeout(() => {
      window.location.href = url; // redirect after short wait
    }, 1000); // optionally wait 1 sec before redirect
  };



  return (
 
      <div>
      {loading ? (
        <div className="flex flex-col items-center justify-center h-screen text-center">
          <div className="text-2xl font-semibold">Please wait...</div>
          <div className="animate-spin mt-4 rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
      <div className="bg-gray-100 text-gray-800 font-sans">
        {/* Navigation Bar */}
        <nav className="flex items-center justify-between px-6 py-4 shadow-sm fixed top-0 w-full z-10 backdrop-blur-lg">
          {/* Logo */}
          <h2 className="text-blue-600 text-3xl font-bold">Inspix</h2>
          {/* Right Side Buttons */}
          <div className="space-x-5">
            
              <button 
              onClick={() => handleRedirect("https://inspix-cozl.onrender.com/login")}
              className="px-4 py-2 bg-gray-200 rounded-lg text-sm font-semibold hover:bg-gray-300 transition-all duration-300 transform hover:scale-105 shadow-lg">
                Log In
              </button>
            
            
              <button
               onClick={() => handleRedirect("https://inspix-cozl.onrender.com")}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 shadow-lg">
                Get Started
              </button>
            
          </div>
        </nav>

        {/* Hero Section */}
        <section className="flex flex-col lg:flex-row items-center justify-between px-8 lg:px-18 py-10 mt-24">
          <div className="max-w-2xl space-y-6">
            <h1 className="text-4xl text-black lg:text-6xl font-bold">
              Discover & Share <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-purple-300">
                Beautiful Wallpapers
              </span>
            </h1>
            <p className="text-gray-600 text-xl">
              Join our creative community where art meets technology. Upload
              your stunning wallpapers, discover amazing artwork, and connect
              with artists from around the world.
            </p>
            <div className="flex space-x-6">
              
              <button
               onClick={() => handleRedirect("https://inspix-cozl.onrender.com/home")}
              className="px-6 py-3 bg-blue-600 text-white rounded-xl font-medium text-lg transition-all duration-300 transform hover:scale-105 shadow-lg">
                Start Exploring
              </button>
              
              <button 
               onClick={() => handleRedirect("https://inspix-cozl.onrender.com")}
              className="px-6 py-3  rounded-xl font-medium text-lg bg-gray-200 transition-all duration-300 transform hover:scale-105 shadow-lg">
                Upload Wallpaper
              </button>
              
            </div>
            <div className="flex items-center text-md space-x-8 pt-4">
              <div className="flex items-center space-x-2">
                <Users className="w-5 h-5 text-primary text-yellow-600" />
                <span className="text-muted-foreground">10K+ Artists</span>
              </div>
              <div className="flex items-center space-x-2">
                <Download className="w-5 h-5 text-primary text-blue-700" />
                <span className="text-muted-foreground">100K+ Downloads</span>
              </div>
              <div className="flex items-center space-x-2">
                <Heart className="w-5 h-5 text-primary text-red-600" />
                <span className="text-muted-foreground">500K+ Likes</span>
              </div>
            </div>
          </div>
          <div className="mt-12 lg:mt-0 relative">
            {/* Floating cards */}
            <div className="absolute -top-4 -left-4 z-4 bg-white rounded-xl p-4 shadow-lg ">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium">Live Community</span>
              </div>
            </div>
            <img
              src="https://images.pexels.com/photos/592077/pexels-photo-592077.jpeg"
              alt="Wallpaper Preview"
              className="rounded-2xl w-full max-w-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-102"
            />
            <div className="absolute -bottom-4 -right-4 z-4 bg-white rounded-xl p-2 shadow-lg ">
              <div className="text-md font-medium">Daily Uploads</div>
              <div className="text-2xl font-bold text-blue-600">20+</div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-20 bg-gray-50 text-gray-800">
          <div className="max-w-6xl mx-auto px-6">
            {/* Header */}
            <div className="text-center space-y-4 mb-16">
              <h2 className="text-4xl font-bold">Why Choose Inspix?</h2>
              <p className="text-xl text-gray-500 max-w-2xl mx-auto">
                A complete social platform designed for wallpaper enthusiasts
                and digital artists
              </p>
            </div>

            {/* Features Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-transform hover:-translate-y-1 text-center space-y-4"
                >
                  <div className="w-16 h-16 mx-auto bg-blue-100 rounded-full flex items-center justify-center hover:bg-blue-200 transition-colors duration-200">
                    <feature.icon className="w-8 h-8 text-blue-600 hover:scale-108 transition-transform duration-200" />
                  </div>
                  <h3 className="text-xl font-semibold">{feature.title}</h3>
                  <p className="text-gray-500">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Wallpapers */}
        <section className="px-8 lg:px-32 py-20 bg-white">
          <h2 className="text-3xl font-bold text-center mb-10">
            Featured Wallpapers
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "Sunset Mountains",
                artist: "Artist1",
                likes: 124,
                downloads: 89,
                img: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400",
              },
              {
                title: "Starry Night",
                artist: "Artist2",
                likes: 256,
                downloads: 178,
                img: "https://images.unsplash.com/photo-1470813740244-df37b8c1edcb?w=400",
              },
              {
                title: "Mountain forest",
                artist: "Artist3",
                likes: 189,
                downloads: 134,
                img: "https://images.unsplash.com/photo-1426604966848-d7adac402bff?w=400",
              },
              {
                img: "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?w=400",
                title: "Ocean Waves",
                artist: "Artist4",
                likes: 312,
                downloads: 245,
              },
              {
                img: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=400",
                title: "Urban Life",
                artist: "Artist5",
                likes: 98,
                downloads: 67,
              },
              {
                img: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=400",
                title: "Digital Matrix",
                artist: "Artist6",
                likes: 445,
                downloads: 334,
              },
              
            ].map((item, i) => (
              <div
                key={i}
                className="bg-gray-100 rounded-xl overflow-hidden shadow-sm"
              >
                <div className="relative">
                  <img
                    src={item.img}
                    alt={item.title}
                    className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="p-4 space-y-3">
                    <div>
                      <h3 className="font-semibold text-lg">{item.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        by {item.artist}
                      </p>
                    </div>

                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <div className="flex items-center space-x-1">
                        <Heart className="w-4 h-4" />
                        <span>{item.likes}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Download className="w-4 h-4" />
                        <span>{item.downloads}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Call to Action */}
         <section className="py-15">
      <div className="container mx-auto px-3">
        {/* Replacing Card */}
        <div
          className="relative overflow-hidden rounded-2xl shadow-xl"
        >
          {/* Overlay Gradient */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl" />

          {/* Content */}
          <div className="relative p-12 lg:p-20 text-center text-white">
            <div className="max-w-3xl mx-auto space-y-8">
              {/* Icon and Text */}
              <div className="space-y-4">
                <div className="flex justify-center">
                  <Sparkles className="w-16 h-16 text-white/10" />
                </div>
                <h2 className="text-4xl lg:text-5xl font-bold leading-tight">
                  Ready to Share Your Art with the World?
                </h2>
                <p className="text-xl text-white/90 leading-relaxed">
                  Join thousands of artists and enthusiasts on Inspix. Upload your wallpapers, 
                  build your following, and be part of the most creative community online.
                </p>
              </div>

              {/* Buttons */}
              <div className="flex flex-wrap justify-center gap-4">
                
                <button 
                 onClick={() => handleRedirect("https://inspix-cozl.onrender.com")}
                className="text-lg text-blue-700 font-semibold px-8 py-3 bg-white text-primary rounded-lg hover:bg-gray-300 hover:cursor-pointer transition flex items-center">
                  <Upload className="w-5 h-5 mr-2" />
                  Start Uploading
                </button>
                
                <button className="text-lg px-8 py-3 border border-white text-white rounded-lg hover:bg-white/10 transition flex items-center">
                  <Users className="w-5 h-5 mr-2" />
                  Join Community
                </button>
              </div>

              {/* Stats */}
              <div className="flex justify-center items-center space-x-8 pt-8 text-white">
                <div className="text-center">
                  <div className="text-2xl font-bold">10K+</div>
                  <div className="text-sm">Active Users</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">50K+</div>
                  <div className="text-sm">Wallpapers</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">100K+</div>
                  <div className="text-sm">Downloads</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

        {/* Footer */}
        <footer className="px-8 lg:px-32 py-12 bg-white text-gray-700">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-sm">
            <div>
              <h3 className="text-blue-600 font-bold text-2xl mb-2">Inspix</h3>
              <p>
                The ultimate platform for wallpaper enthusiasts and digital
                artists to share, discover, and connect.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Features</h4>
              <ul className="space-y-1">
                <li>Upload Wallpapers</li>
                <li>Follow Artists</li>
                <li>Like & Comment</li>
                <li>Free Downloads</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Community</h4>
              <ul className="space-y-1">
                <li>Guidelines</li>
                <li>Support</li>
                <li>Featured Artists</li>
                <li>Blog</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Company</h4>
              <ul className="space-y-1">
                <li>About Us</li>
                <li>Privacy Policy</li>
                <li>Terms of Service</li>
                <li>Contact</li>
              </ul>
            </div>
          </div>
          <div className="mt-10 text-center text-gray-500 text-sm">
            Made with ❤️ by Supritam <br />
            &copy; 2025 Inspix. All rights reserved.
          </div>
        </footer>
      </div>
      )}
    </div>
  );
};

export default Landing;
