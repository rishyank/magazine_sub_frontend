import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  BookOpen,
  User,
  LogOut,
  Menu,
  X,
  Search,
  Home,
  BookCheck,
  CreditCard,
  Settings,
} from "lucide-react";

export const Navbar: React.FC = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <BookOpen className="h-6 w-6 text-magazine-purple" />
              <span className="text-xl font-bold bg-gradient-to-r from-magazine-purple to-magazine-blue bg-clip-text text-transparent">
                MagSub
              </span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center space-x-8">
            <Link
              to="/"
              className="text-gray-700 hover:text-magazine-purple transition-colors"
            >
              Home
            </Link>
            <Link
              to="/magazines"
              className="text-gray-700 hover:text-magazine-purple transition-colors"
            >
              Magazines
            </Link>
            <Link
              to="/plans"
              className="text-gray-700 hover:text-magazine-purple transition-colors"
            >
              Plans
            </Link>
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-10 w-10 rounded-full"
                  >
                    <div className="px-3 py-1 rounded-full bg-magazine-purple flex items-center justify-center text-white text-lg">
                      {user?.username.charAt(0).toUpperCase()}
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem asChild>
                    <Link to="/profile" className="flex items-center">
                      <User className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/subscriptions" className="flex items-center">
                      <BookCheck className="mr-2 h-4 w-4" />
                      <span>My Subscriptions</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={logout}
                    className="text-red-500 focus:text-red-500"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Logout</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center space-x-2">
                <Button asChild variant="ghost">
                  <Link to="/login">Login</Link>
                </Button>
                <Button asChild>
                  <Link to="/register">Register</Link>
                </Button>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <div className="lg:hidden">
            <Button variant="ghost" size="icon" onClick={toggleMenu}>
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden mt-4 py-4 border-t">
            <div className="flex flex-col space-y-4">
              <Link
                to="/"
                className="text-gray-700 hover:text-magazine-purple transition-colors px-2 py-1"
                onClick={toggleMenu}
              >
                <div className="flex items-center space-x-2">
                  <Home className="h-5 w-5" />
                  <span>Home</span>
                </div>
              </Link>
              <Link
                to="/magazines"
                className="text-gray-700 hover:text-magazine-purple transition-colors px-2 py-1"
                onClick={toggleMenu}
              >
                <div className="flex items-center space-x-2">
                  <BookOpen className="h-5 w-5" />
                  <span>Magazines</span>
                </div>
              </Link>
              <Link
                to="/plans"
                className="text-gray-700 hover:text-magazine-purple transition-colors px-2 py-1"
                onClick={toggleMenu}
              >
                <div className="flex items-center space-x-2">
                  <CreditCard className="h-5 w-5" />
                  <span>Plans</span>
                </div>
              </Link>

              {isAuthenticated ? (
                <>
                  <Link
                    to="/profile"
                    className="text-gray-700 hover:text-magazine-purple transition-colors px-2 py-1"
                    onClick={toggleMenu}
                  >
                    <div className="flex items-center space-x-2">
                      <User className="h-5 w-5" />
                      <span>Profile</span>
                    </div>
                  </Link>
                  <Link
                    to="/subscriptions"
                    className="text-gray-700 hover:text-magazine-purple transition-colors px-2 py-1"
                    onClick={toggleMenu}
                  >
                    <div className="flex items-center space-x-2">
                      <BookCheck className="h-5 w-5" />
                      <span>My Subscriptions</span>
                    </div>
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      toggleMenu();
                    }}
                    className="text-red-500 hover:text-red-600 transition-colors px-2 py-1 text-left"
                  >
                    <div className="flex items-center space-x-2">
                      <LogOut className="h-5 w-5" />
                      <span>Logout</span>
                    </div>
                  </button>
                </>
              ) : (
                <div className="flex flex-col space-y-2 pt-2">
                  <Button asChild variant="outline" onClick={toggleMenu}>
                    <Link to="/login">Login</Link>
                  </Button>
                  <Button asChild onClick={toggleMenu}>
                    <Link to="/register">Register</Link>
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};
