import React from "react";
import { Link } from "react-router-dom";
import { Magazine, API_URL } from "@/services/api";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { BookOpen } from "lucide-react";

interface MagazineCardProps {
  magazine: Magazine;
}

export const MagazineCard: React.FC<MagazineCardProps> = ({ magazine }) => {
  return (
    <Card className="magazine-card overflow-hidden flex flex-col h-full">
      <div className="relative h-48 overflow-hidden">
        <img
          src={`${API_URL}${magazine.imageUrl}`}
          alt={magazine.name}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        />
      </div>
      <CardContent className="p-5 flex-grow">
        <h3 className="text-lg font-semibold mb-2 line-clamp-1">
          {magazine.name}
        </h3>
        <p className="text-gray-600 text-sm line-clamp-3 mb-3">
          {magazine.description ||
            "Discover the latest issues and exclusive content in this captivating magazine."}
        </p>
        <div className="text-magazine-purple font-semibold">
          ${magazine.base_price.toFixed(2)} / issue
        </div>
      </CardContent>
      <CardFooter className="px-5 py-4 border-t bg-gray-50">
        <Link
          to={`/magazines/${magazine.id}`}
          className="text-magazine-purple hover:text-magazine-darkpurple text-sm font-medium flex items-center"
        >
          <BookOpen className="h-4 w-4 mr-1" />
          View Details
        </Link>
      </CardFooter>
    </Card>
  );
};
