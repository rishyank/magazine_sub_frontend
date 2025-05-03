import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import { MainLayout } from "@/layout/MainLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { User, BookCheck, LogOut } from "lucide-react";

const Profile = () => {
  const { user, logout } = useAuth();

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">My Profile</h1>

          <Card className="mb-8">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="h-16 w-16 rounded-full bg-magazine-purple flex items-center justify-center text-white text-2xl font-bold">
                  {user?.username.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h2 className="text-xl font-bold">{user?.username}</h2>
                  <p className="text-gray-600">{user?.email}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <Button
              asChild
              variant="outline"
              className="h-auto py-6 flex items-start justify-start"
            >
              <Link to="/subscriptions" className="text-left">
                <div className="flex flex-col items-start">
                  <BookCheck className="h-8 w-8 mb-2 text-magazine-purple" />
                  <div>
                    <h3 className="font-bold">My Subscriptions</h3>
                    <p className="text-sm text-gray-600">
                      Manage your magazine subscriptions
                    </p>
                  </div>
                </div>
              </Link>
            </Button>

            <Button
              variant="outline"
              className="h-auto py-6 flex items-start justify-start text-left"
              onClick={logout}
            >
              <div className="flex flex-col items-start">
                <LogOut className="h-8 w-8 mb-2 text-red-500" />
                <div>
                  <h3 className="font-bold">Logout</h3>
                  <p className="text-sm text-gray-600">
                    Sign out of your account
                  </p>
                </div>
              </div>
            </Button>
          </div>

          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-bold mb-4">Account Information</h3>

              <div className="space-y-4">
                <div>
                  <div className="text-sm text-gray-500">Username</div>
                  <div className="font-medium">{user?.username}</div>
                </div>

                <div>
                  <div className="text-sm text-gray-500">Email</div>
                  <div className="font-medium">{user?.email}</div>
                </div>

                <div>
                  <div className="text-sm text-gray-500">User ID</div>
                  <div className="font-medium">{user?.id}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};

export default Profile;
