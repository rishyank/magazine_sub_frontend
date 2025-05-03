import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  fetchMagazineById,
  fetchPlans,
  Magazine,
  Plan,
  API_URL,
} from "@/services/api";
import { MainLayout } from "@/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

import { Loader, BookOpen, CreditCard, ArrowLeft } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

const MagazineDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [magazine, setMagazine] = useState<Magazine | null>(null);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        if (id) {
          const magazineData = await fetchMagazineById(parseInt(id));
          setMagazine(magazineData);

          const plansData = await fetchPlans();
          setPlans(plansData);
        }
      } catch (error) {
        toast.error("Failed to load magazine details");
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [id]);

  const handleSubscribe = () => {
    if (!isAuthenticated) {
      toast.error("Please login to subscribe");
      navigate("/login");
      return;
    }

    if (selectedPlan === null) {
      toast.error("Please select a subscription plan");
      return;
    }

    if (magazine) {
      navigate(`/subscribe/${magazine.id}/${selectedPlan}`);
    }
  };

  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex justify-center items-center h-96">
          <Loader className="h-8 w-8 animate-spin text-magazine-purple" />
        </div>
      </MainLayout>
    );
  }

  if (!magazine) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-16 text-center">
          <h2 className="text-2xl font-bold text-gray-800">
            Magazine not found
          </h2>
          <Button
            onClick={() => navigate("/magazines")}
            variant="outline"
            className="mt-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Magazines
          </Button>
        </div>
      </MainLayout>
    );
  }

  // Get a consistent image for the magazine
  const getImageForMagazine = (id: number) => {
    return API_URL + magazine.imageUrl;
  };

  const getFinalPrice = (
    basePrice: number,
    selectedPlanId: number | null
  ): number => {
    if (selectedPlanId === null) return basePrice;
    const plan = plans.find((p) => p.id === selectedPlanId);
    const discount = plan?.discount ?? 0;
    return basePrice * (1 - discount);
  };

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <Button
          onClick={() => navigate("/magazines")}
          variant="ghost"
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Magazines
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <img
                src={getImageForMagazine(magazine.id)}
                alt={magazine.name}
                className="w-full h-64 object-cover"
              />
              <div className="p-6">
                <div className="flex justify-between items-start">
                  <h1 className="text-3xl font-bold text-gray-900">
                    {magazine.name}
                  </h1>
                  <div className="text-lg font-bold text-magazine-purple">
                    ${magazine.base_price.toFixed(2)} / issue
                  </div>
                </div>
                <div className="mt-6">
                  <h2 className="text-xl font-semibold text-gray-800 mb-3">
                    About this Magazine
                  </h2>
                  <p className="text-gray-600">
                    {magazine.description ||
                      "Discover the latest issues and exclusive content in this captivating magazine. Perfect for enthusiasts looking for in-depth articles, stunning visuals, and expert insights."}
                  </p>
                </div>

                <div className="mt-8">
                  <h2 className="text-xl font-semibold text-gray-800 mb-3">
                    Features
                  </h2>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <span className="flex-shrink-0 h-5 w-5 text-magazine-purple">
                        •
                      </span>
                      <span className="ml-2 text-gray-600">
                        Premium quality content curated by experts
                      </span>
                    </li>
                    <li className="flex items-start">
                      <span className="flex-shrink-0 h-5 w-5 text-magazine-purple">
                        •
                      </span>
                      <span className="ml-2 text-gray-600">
                        Regular issues delivered to your device
                      </span>
                    </li>
                    <li className="flex items-start">
                      <span className="flex-shrink-0 h-5 w-5 text-magazine-purple">
                        •
                      </span>
                      <span className="ml-2 text-gray-600">
                        Exclusive subscriber-only content
                      </span>
                    </li>
                    <li className="flex items-start">
                      <span className="flex-shrink-0 h-5 w-5 text-magazine-purple">
                        •
                      </span>
                      <span className="ml-2 text-gray-600">
                        Access to archive of past issues
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div>
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Subscription Plans
              </h2>
              <div className="space-y-4 mb-6">
                {plans.map((plan) => (
                  <Card
                    key={plan.id}
                    className={`subscription-plan cursor-pointer ${
                      selectedPlan === plan.id ? "selected" : ""
                    }`}
                    onClick={() => setSelectedPlan(plan.id)}
                  >
                    <CardContent className="p-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="font-semibold text-gray-800">
                            {plan.title}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {plan.description ||
                              `${plan.renewal_period} months`}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="text-magazine-purple font-bold">
                            {plan.discount}% off
                          </div>
                          <div className="text-sm text-gray-600">
                            {plan.renewal_period}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="border-t pt-4">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-sm text-gray-600">Base price:</span>
                  <span className="font-semibold">
                    ${magazine.base_price.toFixed(2)} / issue
                  </span>
                </div>

                {selectedPlan !== null && (
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-sm text-gray-600">Discount:</span>
                    <span className="font-semibold text-green-600">
                      {plans.find((p) => p.id === selectedPlan)?.discount}%
                    </span>
                  </div>
                )}

                <Button
                  onClick={handleSubscribe}
                  className="w-full bg-magazine-purple hover:bg-magazine-darkpurple"
                >
                  <CreditCard className="mr-2 h-4 w-4" />
                  Subscribe Now
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default MagazineDetail;
