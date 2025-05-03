import React, { useState, useEffect } from "react";
import { fetchPlans, Plan } from "@/services/api";
import { MainLayout } from "@/layout/MainLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Check, Loader } from "lucide-react";
import { toast } from "sonner";

const Plans = () => {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadPlans = async () => {
      setIsLoading(true);
      try {
        const data = await fetchPlans();
        setPlans(data);
      } catch (error) {
        toast.error("Failed to load subscription plans");
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    loadPlans();
  }, []);

  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex justify-center items-center h-96">
          <Loader className="h-8 w-8 animate-spin text-magazine-purple" />
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-magazine-purple to-magazine-blue bg-clip-text text-transparent">
            Subscription Plans
          </h1>
          <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
            Choose the perfect subscription plan that fits your reading
            preferences. Apply these discounts when subscribing to any of our
            magazines.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
          {plans.map((plan) => (
            <Card
              key={plan.id}
              className="overflow-hidden border-2 hover:border-magazine-purple transition-colors"
            >
              <div className="bg-gradient-to-r from-magazine-purple to-magazine-blue p-4 text-white">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xl font-bold">{plan.title}</h3>
                  <div className="px-3 py-1 border border-white rounded-full text-white text-xs font-semibold">
                    {plan.tier}
                  </div>
                </div>
                <p className="text-sm text-white/80">
                  {plan.description ||
                    `${plan.renewal_period} months subscription`}
                </p>
              </div>
              <CardContent className="p-6">
                <div className="text-center mb-6">
                  <div className="flex items-end justify-center">
                    <span className="text-4xl font-bold text-magazine-purple">
                      {plan.discount}%
                    </span>
                    <span className="text-gray-500 ml-2">off</span>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    on all magazine subscriptions
                  </p>
                </div>

                <div className="border-t pt-4">
                  <div className="text-gray-700 font-medium mb-2">
                    Plan includes:
                  </div>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                      <span>{plan.renewal_period} months subscription</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                      <span>{plan.discount}% off regular price</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                      <span>Access to exclusive content</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                      <span>Cancel anytime</span>
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-gray-600 max-w-2xl mx-auto">
            All plans are applied at checkout when you subscribe to a magazine.
            Browse our magazine collection and select the plan that works best
            for you during the subscription process.
          </p>
        </div>
      </div>
    </MainLayout>
  );
};

export default Plans;
