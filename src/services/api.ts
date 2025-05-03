import { toast } from "sonner";
// Base URL of the API
export const API_URL = "http://localhost:8950";

// Token storage key
const TOKEN_KEY = "magazine_auth_token";
const USER_KEY = "magazine_user";


export interface User {
  id: number;
  username: string;
  email: string;
}


export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface Magazine {
  id: number;
  name: string;
  description: string;
  base_price: number;
  imageUrl?: string;
}

export interface Plan {
  id: number;
  title: string;
  description: string;
  discount: number;
  renewal_period: number;
  tier: number;
}

export interface Subscription {
  id: number;
  userId: number;
  magazineName: number;
  magazineId: number;
  planTitle: string;
  renewalDate: string;
  price: number;
  active: boolean;
  magazine?: Magazine;
  plan?: Plan;
}

export interface SubscriptionRequest {
  userId: number;
  magazineId: number;
  planId: number;
}

export interface ChangePlanRequest {
  userId: number;
  magazineId: number;
  newPlanId: number;
}

// Helper to get the auth token
export const getToken = (): string | null => {
  return localStorage.getItem(TOKEN_KEY);
};

// Helper to set the auth token
export const setToken = (token: string): void => {
  localStorage.setItem(TOKEN_KEY, token);
};

export const getCurrentUser = (): User | null => {
  const userStr = localStorage.getItem(USER_KEY);
  return userStr ? JSON.parse(userStr) : null;
};

// Helper to set the current user
export const setCurrentUser = (user: User): void => {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
};

// Helper to clear auth data
export const clearAuth = (): void => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
};

// Helper for API requests

const apiRequest = async (
  endpoint: string,
  method: string = "GET",
  data: any = null,
  requiresAuth: boolean = true
) => {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  if (requiresAuth) {
    const token = getToken();
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
  }

  const config: RequestInit = {
    method,
    headers,
    body: data ? JSON.stringify(data) : null,
  };

  try {
    const response = await fetch(`${API_URL}${endpoint}`, config);
    
    if (response.status === 401) {
      clearAuth();
      toast.error("Your session has expired. Please login again.");
      window.location.href = "/login";
      throw new Error("Unauthorized");
    }
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      const errorMessage = errorData?.message || "Something went wrong";
      throw new Error(errorMessage);
    }
    
    if (response.status === 204) {
      return null;
    }
    return await response.json();
  } catch (error) {
    console.error("API request failed:", error);
    throw error;
  }
  
};

// Authentication API calls
export const login = async (credentials: LoginRequest): Promise<LoginResponse> => {
  const response = await apiRequest("/auth/login", "POST", credentials, false);
  if (response && response.token) {
    // Store jwt token in local storage
    setToken(response.token);
    // Store user information only 
    setCurrentUser(response.user || { id: 0, username: credentials.username, email: "" });
  }
  return response;
};

export const fetchCurrentUser = async (): Promise<User> => {
  return await apiRequest("/users/me","GET",null,true);
};

export const register = async (data: RegisterRequest): Promise<LoginResponse> => {
  return await apiRequest("/auth/register", "POST", data, false);
}

export const findUser = async (username: string): Promise<User> => {
  return await apiRequest(`/users/find-user?username=${username}`);
};

// Magazine API calls
export const fetchMagazines = async (): Promise<Magazine[]> => {
  const endpoint = `/api/magazines`;
  return await apiRequest(endpoint);
};

export const fetchMagazineById = async (id: number): Promise<Magazine> => {
  return await apiRequest(`/api/magazines/${id}`);
};

export const createMagazine = async (magazine: Partial<Magazine>): Promise<Magazine> => {
  return await apiRequest("/api/magazines", "POST", magazine);
};

export const deleteMagazine = async (id: number, name: string): Promise<void> => {
  await apiRequest(`/api/magazines?id=${id}&name=${encodeURIComponent(name)}`, "DELETE");
};

// Plans API calls
export const fetchPlans = async (): Promise<Plan[]> => {
  return await apiRequest("/api/plans");
};

export const fetchPlanById = async (id: number): Promise<Plan> => {
  return await apiRequest(`/api/plans/${id}`);
};

// Subscription API calls
export const fetchUserSubscriptions = async (userId: number): Promise<Subscription[]> => {
  return await apiRequest(`/api/subscriptions/user/${userId}`);
};

export const createSubscription = async (subscriptionData: SubscriptionRequest): Promise<Subscription> => {
  return await apiRequest("/api/subscriptions", "POST", subscriptionData);
};

export const changePlan = async (changeData: ChangePlanRequest): Promise<Subscription> => {
  return await apiRequest("/api/subscriptions/change-plan", "PUT", changeData);
};

export const cancelSubscription = async (subscriptionId: number, userId: number): Promise<void> => {
  await apiRequest(`/api/subscriptions/${subscriptionId}?userId=${userId}`, "DELETE");
};
