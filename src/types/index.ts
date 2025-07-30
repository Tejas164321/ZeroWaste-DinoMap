export interface User {
  uid: string;
  email: string;
  displayName: string;
  role: 'donor' | 'ngo';
  photoURL?: string;
}

export interface FoodDonation {
  id: string;
  donorId: string;
  donorName: string;
  title: string;
  description: string;
  quantity: string;
  foodType: string;
  expiryTime: string;
  pickupWindow: {
    start: string;
    end: string;
  };
  location: {
    lat: number;
    lng: number;
    address: string;
  };
  status: 'available' | 'claimed' | 'picked' | 'expired';
  claimedBy?: string;
  claimedByName?: string;
  createdAt: string;
  imageUrl?: string;
}

export interface ClaimRequest {
  id: string;
  donationId: string;
  ngoId: string;
  ngoName: string;
  estimatedPickupTime: string;
  status: 'pending' | 'confirmed' | 'completed';
  createdAt: string;
}

declare global {
  interface Window {
    google: typeof google;
  }
}