import React, { useState, useEffect } from "react";
import {
  fetchUserSubscriptions,
  cancelSubscription,
  changePlan,
  fetchPlans,
  Subscription,
  Plan,
  ChangePlanRequest,
} from "@/services/api";
import { MainLayout } from "@/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Loader,
  RefreshCw,
  XCircle,
  Calendar,
  Clock,
  ChevronRight,
  BookOpen,
  Edit2Icon,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const Subscriptions = () => {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [subscriptionToCancel, setSubscriptionToCancel] =
    useState<Subscription | null>(null);
  const [subscriptionToModify, setSubscriptionToModify] =
    useState<Subscription | null>(null);
  const [selectedPlanId, setSelectedPlanId] = useState<number>();
  const { user } = useAuth();

  const loadSubscriptions = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      const [subsData, plansData] = await Promise.all([
        fetchUserSubscriptions(user.id),
        fetchPlans(),
      ]);
      setSubscriptions(subsData);
      setPlans(plansData);
    } catch (error) {
      toast.error("Failed to load your subscriptions");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadSubscriptions();
  }, [user]);

  const handleCancelClick = (subscription: Subscription) => {
    setSubscriptionToCancel(subscription);
  };

  const handleChangePlanClick = (subscription: Subscription) => {
    setSubscriptionToModify(subscription);
    setSelectedPlanId(undefined);
  };

  const handleChangePlan = async (changeRequest: ChangePlanRequest) => {
    if (!user || !subscriptionToModify) return;

    setIsUpdating(true);
    try {
      await changePlan(changeRequest);
      toast.success("Subscription plan changed successfully");
      setSubscriptionToModify(null);
      loadSubscriptions();
    } catch (error) {
      toast.error("Failed to change plan for the subscription");
      console.error(error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCancelSubscription = async () => {
    if (!user || !subscriptionToCancel) return;

    setIsDeleting(true);
    try {
      await cancelSubscription(subscriptionToCancel.id, user.id);
      setSubscriptions(
        subscriptions.filter((s) => s.id !== subscriptionToCancel.id)
      );
      toast.success("Subscription cancelled successfully");
      setSubscriptionToCancel(null);
    } catch (error) {
      toast.error("Failed to cancel subscription");
      console.error(error);
    } finally {
      setIsDeleting(false);
    }
  };

  const getPlanDetails = (planTitle: string) =>
    plans.find((p) => p.title === planTitle);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
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

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">My Subscriptions</h1>
          <Button
            variant="outline"
            onClick={loadSubscriptions}
            className="flex items-center"
          >
            <RefreshCw className="h-4 w-4 mr-2" /> Refresh
          </Button>
        </div>

        {!subscriptions || subscriptions.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <BookOpen className="h-16 w-16 mx-auto text-gray-400 mb-4" />
            <h2 className="text-2xl font-semibold text-gray-700 mb-2">
              No subscriptions yet
            </h2>
            <p className="text-gray-600 mb-6">
              You haven't subscribed to any magazines yet.
            </p>
            <Button
              asChild
              className="bg-magazine-purple hover:bg-magazine-darkpurple"
            >
              <Link to="/magazines">Browse Magazines</Link>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {subscriptions.map((subscription) => {
              const plan = getPlanDetails(subscription.planTitle);
              return (
                <Card key={subscription.id} className="overflow-hidden">
                  <CardContent className="p-0">
                    <div className="grid grid-cols-1 md:grid-cols-4">
                      <div className="p-6 md:col-span-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <h2 className="text-xl font-bold text-gray-900">
                              {subscription.magazine?.name ||
                                `Magazine #${subscription.magazineId}`}
                            </h2>
                            <p className="text-sm text-gray-500">
                              {plan?.title || `Plan #${subscription.planTitle}`}{" "}
                              - {plan?.discount}% discount
                            </p>
                          </div>
                          <div className="flex items-start flex-row space-x-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                handleChangePlanClick(subscription)
                              }
                              className="flex items-center bg-cyan-400 hover:bg-cyan-600 text-gray-900"
                            >
                              <Edit2Icon className="h-4 w-4 mr-1" /> Change Plan
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleCancelClick(subscription)}
                              className="flex items-center"
                            >
                              <XCircle className="h-4 w-4 mr-1" /> Cancel
                            </Button>
                          </div>
                        </div>
                        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="flex items-center">
                            <Calendar className="h-5 w-5 text-gray-500 mr-2" />
                            <div>
                              <p className="text-sm text-gray-500">
                                Subscription Renewal Date
                              </p>
                              <p className="font-medium">
                                {formatDate(subscription.renewalDate)}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center">
                            <Clock className="h-5 w-5 text-gray-500 mr-2" />
                            <div>
                              <p className="text-sm text-gray-500">Duration</p>
                              <p className="font-medium">
                                {plan?.renewal_period || 0} months
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="bg-gray-50 p-6 flex flex-col justify-center items-center border-t md:border-t-0 md:border-l">
                        <Link
                          to={`/magazines/${subscription.magazineId}`}
                          className="flex items-center text-magazine-purple hover:text-magazine-darkpurple font-medium"
                        >
                          View Magazine{" "}
                          <ChevronRight className="h-4 w-4 ml-1" />
                        </Link>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        <AlertDialog
          open={!!subscriptionToModify}
          onOpenChange={(open) => !open && setSubscriptionToModify(null)}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Change Plan</AlertDialogTitle>
              <AlertDialogDescription>
                Select a new plan for{" "}
                <span className="font-semibold">
                  {subscriptionToModify?.magazine?.name ||
                    `Magazine #${subscriptionToModify?.magazineId}`}
                </span>
              </AlertDialogDescription>
            </AlertDialogHeader>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                New Plan
              </label>
              <select
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                value={selectedPlanId}
                onChange={(e) => setSelectedPlanId(Number(e.target.value))}
              >
                <option value="">Select a plan</option>
                {plans.map((plan) => (
                  <option key={plan.id} value={plan.id}>
                    {plan.title} ({plan.discount * 100}% off)
                  </option>
                ))}
              </select>
            </div>

            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() =>
                  handleChangePlan({
                    userId: user!.id,
                    magazineId: subscriptionToModify!.magazineId,
                    newPlanId: selectedPlanId,
                  })
                }
                className="bg-red-500 hover:bg-red-600"
                disabled={!selectedPlanId || isUpdating}
              >
                {isDeleting ? (
                  <Loader className="h-4 w-4 animate-spin" />
                ) : (
                  "Update Plan"
                )}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <AlertDialog
          open={!!subscriptionToCancel}
          onOpenChange={(open) => !open && setSubscriptionToCancel(null)}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Cancel Subscription</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to cancel your subscription to{" "}
                <span className="font-semibold">
                  {subscriptionToCancel?.magazine?.name ||
                    `Magazine #${subscriptionToCancel?.magazineId}`}
                </span>
                ? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleCancelSubscription}
                className="bg-red-500 hover:bg-red-600"
                disabled={isDeleting}
              >
                {isDeleting ? (
                  <Loader className="h-4 w-4 animate-spin" />
                ) : (
                  "Confirm"
                )}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </MainLayout>
  );
};

export default Subscriptions;
