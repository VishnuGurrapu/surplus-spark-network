const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  role: 'donor' | 'ngo' | 'logistics' | 'admin';
  location: string;
  donorType?: 'individual' | 'restaurant' | 'grocery' | 'hotel';
  ngoRegistrationId?: string;
  vehicleType?: 'bike' | 'car' | 'van' | 'truck';
}

export interface LoginData {
  email: string;
  password: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  location: string;
  donorType?: string;
  ngoRegistrationId?: string;
  vehicleType?: string;
  isVerified?: boolean;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data?: {
    token: string;
    user: User;
  };
  errors?: any[];
}

export const register = async (data: RegisterData): Promise<AuthResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(data),
    });
    
    const result = await response.json();
    
    // Log the full response for debugging
    if (!response.ok) {
      console.error('Registration error:', result);
    }
    
    return result;
  } catch (error) {
    console.error('Network error during registration:', error);
    throw error;
  }
};

export const login = async (data: LoginData): Promise<AuthResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(data),
    });
    
    const result = await response.json();
    
    if (!response.ok) {
      console.error('Login error:', result);
    }
    
    return result;
  } catch (error) {
    console.error('Network error during login:', error);
    throw error;
  }
};

export const getProfile = async (token: string): Promise<AuthResponse> => {
  const response = await fetch(`${API_BASE_URL}/auth/profile`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });
  
  return response.json();
};

// Token management
export const setAuthToken = (token: string) => {
  localStorage.setItem('auth_token', token);
};

export const getAuthToken = (): string | null => {
  return localStorage.getItem('auth_token');
};

export const removeAuthToken = () => {
  localStorage.removeItem('auth_token');
};

export const setUser = (user: User) => {
  localStorage.setItem('user', JSON.stringify(user));
};

export const getUser = (): User | null => {
  const userStr = localStorage.getItem('user');
  return userStr ? JSON.parse(userStr) : null;
};

export const removeUser = () => {
  localStorage.removeItem('user');
};

export const logout = () => {
  removeAuthToken();
  removeUser();
};

// Surplus interfaces
export interface SurplusData {
  title: string;
  description: string;
  category: 'food' | 'clothing' | 'medical' | 'educational' | 'other';
  quantity: number;
  unit: string;
  expiryDate?: string;
  location: {
    address: string;
    coordinates?: {
      latitude: number;
      longitude: number;
    };
  };
  images?: string[];
}

export interface Surplus {
  _id: string;
  donorId: string;
  title: string;
  description: string;
  category: string;
  quantity: number;
  unit: string;
  expiryDate?: string;
  location: {
    address: string;
    coordinates?: {
      latitude: number;
      longitude: number;
    };
  };
  status: string;
  claimedBy?: string;
  logisticsPartnerId?: string;
  images?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  errors?: any[];
}

// Donor API functions
export const createSurplus = async (data: SurplusData): Promise<ApiResponse<Surplus>> => {
  try {
    const token = getAuthToken();
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await fetch(`${API_BASE_URL}/donor/surplus`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      credentials: 'include',
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      console.error('Create surplus error:', result);
    }

    return result;
  } catch (error) {
    console.error('Network error during surplus creation:', error);
    throw error;
  }
};

export const getDonorSurplus = async (filters?: { status?: string; category?: string }): Promise<ApiResponse<Surplus[]>> => {
  try {
    const token = getAuthToken();
    if (!token) {
      throw new Error('No authentication token found');
    }

    const params = new URLSearchParams();
    if (filters?.status) params.append('status', filters.status);
    if (filters?.category) params.append('category', filters.category);

    const url = `${API_BASE_URL}/donor/surplus${params.toString() ? `?${params.toString()}` : ''}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    return response.json();
  } catch (error) {
    console.error('Network error during fetch surplus:', error);
    throw error;
  }
};

export const getDonorImpact = async (): Promise<ApiResponse<any>> => {
  try {
    const token = getAuthToken();
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await fetch(`${API_BASE_URL}/donor/impact`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    return response.json();
  } catch (error) {
    console.error('Network error during fetch impact:', error);
    throw error;
  }
};

// Profile API functions
export interface UpdateProfileData {
  name?: string;
  location?: string;
  donorType?: string;
  phone?: string;
}

export const updateProfile = async (data: UpdateProfileData): Promise<ApiResponse<User>> => {
  try {
    const token = getAuthToken();
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await fetch(`${API_BASE_URL}/auth/profile`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      credentials: 'include',
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (result.success && result.data?.user) {
      // Update local storage
      setUser(result.data.user);
    }

    return result;
  } catch (error) {
    console.error('Network error during profile update:', error);
    throw error;
  }
};

export const getCurrentProfile = async (): Promise<ApiResponse<User>> => {
  try {
    const token = getAuthToken();
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await fetch(`${API_BASE_URL}/auth/profile`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    return response.json();
  } catch (error) {
    console.error('Network error during fetch profile:', error);
    throw error;
  }
};
