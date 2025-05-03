import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  fetchMagazineById,
  fetchPlanById,
  createSubscription,
  Magazine,
  Plan,
} from "@/services/api";
import { MainLayout } from "@/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Loader, Check, ArrowLeft, CreditCard } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { addMonths, format } from "date-fns";

const Subscribe = () => {
  const { magazineId, planId } = useParams<{
    magazineId: string;
    planId: string;
  }>();
  const [magazine, setMagazine] = useState<Magazine | null>(null);
  const [plan, setPlan] = useState<Plan | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        if (magazineId && planId) {
          const [magazineData, planData] = await Promise.all([
            fetchMagazineById(parseInt(magazineId)),
            fetchPlanById(parseInt(planId)),
          ]);
          setMagazine(magazineData);
          setPlan(planData);
        }
      } catch (error) {
        toast.error("Failed to load subscription details");
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [magazineId, planId]);

  const handleSubscribe = async () => {
    if (!user || !magazine || !plan) return;

    setIsSubmitting(true);
    try {
      await createSubscription({
        userId: user.id,
        magazineId: magazine.id,
        planId: plan.id,
      });

      toast.success("Subscription created successfully!");
      navigate("/subscriptions");
    } catch (error) {
      toast.error(error.message || "Failed to create subscription");
      console.error(error);
    } finally {
      setIsSubmitting(false);
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

  if (!magazine || !plan) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-16 text-center">
          <h2 className="text-2xl font-bold text-gray-800">
            Subscription details not found
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

  const getRenewDate = (months: number): string => {
    const renewDate = addMonths(new Date(), months);

    return format(renewDate, "MMMM d, yyyy"); // e.g., "August 12, 2025"
  };

  const calculateDiscountedPrice = () => {
    if (!magazine || !plan) return 0;
    return magazine.base_price * (1 - plan.discount);
  };

  const totalPrice = calculateDiscountedPrice() * plan.renewal_period;

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Button
          onClick={() => navigate(`/magazines/${magazine.id}`)}
          variant="ghost"
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Magazine
        </Button>

        <h1 className="text-3xl font-bold text-center mb-8">
          Confirm Your Subscription
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-xl font-semibold mb-4 text-center">
              Subscription Summary
            </h2>
            <Card>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Magazine:</span>
                    <span className="font-semibold">{magazine.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Plan:</span>
                    <span className="font-semibold">{plan.title}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Renewal Date:</span>
                    <span className="font-semibold">
                      {getRenewDate(plan.renewal_period)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Base Price:</span>
                    <span className="font-semibold">
                      ${magazine.base_price.toFixed(2)} / issue
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Discount:</span>
                    <span className="font-semibold text-green-600">
                      {plan.discount}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Price After Discount:</span>
                    <span className="font-semibold">
                      ${calculateDiscountedPrice().toFixed(2)} / issue
                    </span>
                  </div>
                  <div className="border-t pt-4 mt-4">
                    <div className="flex justify-between text-lg">
                      <span className="font-bold">Total:</span>
                      <span className="font-bold text-magazine-purple">
                        ${totalPrice.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-4 text-center">
              Subscription Benefits
            </h2>
            <Card>
              <CardContent className="p-6">
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>
                      {plan.renewal_period} months of access to {magazine.name}
                    </span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Exclusive subscriber-only content</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Early access to new issues</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Access to archive of past issues</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Cancel or modify your subscription anytime</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <div className="mt-6">
              <Button
                onClick={handleSubscribe}
                className="w-full bg-magazine-purple hover:bg-magazine-darkpurple py-6"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <Loader className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <>
                    <CreditCard className="mr-2 h-5 w-5" />
                    Complete Subscription
                  </>
                )}
              </Button>
              <p className="text-center text-sm text-gray-500 mt-3">
                By clicking "Complete Subscription", you agree to our terms of
                service.
              </p>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Subscribe;
