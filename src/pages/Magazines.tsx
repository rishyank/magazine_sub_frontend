import React, { useState, useEffect } from "react";
import { fetchMagazines } from "@/services/api";
import { MagazineCard } from "@/components/magazines/MagazineCard";
import { MainLayout } from "@/layout/MainLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Loader } from "lucide-react";
import { toast } from "sonner";

const Magazines = () => {
  const [magazines, setMagazines] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadMagazines = async () => {
      setIsLoading(true);
      try {
        const data = await fetchMagazines();
        setMagazines(data);
      } catch (error) {
        toast.error("Failed to load magazines");
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    loadMagazines();
  }, []);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsLoading(true);
    try {
      const data = await fetchMagazines();
      setMagazines(data);
    } catch (error) {
      toast.error("Failed to search magazines");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-magazine-purple to-magazine-blue bg-clip-text text-transparent">
            Explore Our Magazines
          </h1>
          <p className="text-gray-600 mt-3">
            Discover a world of knowledge and entertainment with our diverse
            magazine collection
          </p>
        </div>

        <div className="max-w-xl mx-auto mb-10">
          <form onSubmit={handleSearch} className="flex gap-2">
            <Input
              type="text"
              placeholder="Search for magazines..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-grow"
            />
            <Button
              type="submit"
              className="bg-magazine-purple hover:bg-magazine-darkpurple"
            >
              <Search className="h-4 w-4 mr-2" /> Search
            </Button>
          </form>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <Loader className="h-8 w-8 animate-spin text-magazine-purple" />
          </div>
        ) : magazines.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-lg text-gray-600">No magazines found</p>
            {searchTerm && (
              <Button
                variant="link"
                onClick={() => {
                  setSearchTerm("");
                  fetchMagazines().then(setMagazines);
                }}
                className="text-magazine-purple"
              >
                Clear search
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {magazines.map((magazine) => (
              <MagazineCard key={magazine.id} magazine={magazine} />
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default Magazines;
