import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { MainLayout } from "@/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { fetchMagazines, Magazine } from "@/services/api";
import { MagazineCard } from "@/components/magazines/MagazineCard";
import { BookOpen, BookCheck, CreditCard, ArrowRight } from "lucide-react";
import { toast } from "sonner";

const Home = () => {
  const [featuredMagazines, setFeaturedMagazines] = useState<Magazine[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadMagazines = async () => {
      setIsLoading(true);
      try {
        const data = await fetchMagazines();
        // Take a few magazines to feature on the home page
        setFeaturedMagazines(data.slice(0, 4));
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    loadMagazines();
  }, []);

  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-magazine-purple to-magazine-blue text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            Discover Your Perfect Reading Experience
          </h1>
          <p className="text-lg md:text-xl max-w-3xl mx-auto mb-8 text-white/85">
            Subscribe to your favorite magazines and unlock a world of
            knowledge, entertainment, and inspiration at your fingertips.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button
              asChild
              size="lg"
              className="bg-white text-magazine-purple hover:bg-gray-100"
            >
              <Link to="/magazines">Browse Magazines</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="bg-white text-magazine-purple hover:bg-gray-100"
            >
              <Link to="/plans">View Plans</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Magazines */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-10">
            <h2 className="text-3xl font-bold">Featured Magazines</h2>
            <Link
              to="/magazines"
              className="text-magazine-purple hover:text-magazine-darkpurple flex items-center font-medium"
            >
              View All <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredMagazines.map((magazine) => (
              <MagazineCard key={magazine.id} magazine={magazine} />
            ))}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-magazine-purple/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen className="h-8 w-8 text-magazine-purple" />
              </div>
              <h3 className="text-xl font-bold mb-2">Browse Magazines</h3>
              <p className="text-gray-600">
                Explore our extensive collection of magazines across various
                categories and interests.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-magazine-purple/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <CreditCard className="h-8 w-8 text-magazine-purple" />
              </div>
              <h3 className="text-xl font-bold mb-2">Choose a Plan</h3>
              <p className="text-gray-600">
                Select from our flexible subscription plans with different
                durations and discounts.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-magazine-purple/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <BookCheck className="h-8 w-8 text-magazine-purple" />
              </div>
              <h3 className="text-xl font-bold mb-2">Enjoy Reading</h3>
              <p className="text-gray-600">
                Access your subscribed magazines anytime, anywhere, and dive
                into premium content.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gray-900 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Start Reading?</h2>
          <p className="text-lg max-w-2xl mx-auto mb-8 text-gray-300">
            Join thousands of readers who have already discovered their favorite
            magazines through our platform.
          </p>
          <Button
            asChild
            size="lg"
            className="bg-magazine-purple hover:bg-magazine-darkpurple"
          >
            <Link to="/magazines">Get Started Today</Link>
          </Button>
        </div>
      </section>
    </MainLayout>
  );
};

export default Home;
