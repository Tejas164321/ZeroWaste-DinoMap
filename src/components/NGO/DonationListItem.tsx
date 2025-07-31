import React from 'react';
import { MapPin, Clock, Package, User, Navigation, CheckCircle } from 'lucide-react';
import { FoodDonation } from '../../types';
import { useAuth } from '../../hooks/useAuth';

interface DonationListItemProps {
  donation: FoodDonation;
  onClaim: (donation: FoodDonation) => void;
  onViewRoute: (donation: FoodDonation) => void;
  distance?: string;
}

export const DonationListItem: React.FC<DonationListItemProps> = ({ 
  donation, 
  onClaim, 
  onViewRoute, 
  distance 
}) => {
  const { user } = useAuth();
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'claimed':
        return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'expired':
        return 'text-red-600 bg-red-50 border-red-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const isExpired = new Date(donation.expiryTime) < new Date();
  const isAvailable = donation.status === 'available' && !isExpired;

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-4 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">{donation.title}</h3>
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <User className="h-4 w-4" />
            <span>{donation.donorName}</span>
            {distance && (
              <>
                <span>•</span>
                <span>{distance}</span>
              </>
            )}
          </div>
        </div>
        <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(donation.status)}`}>
          {donation.status.charAt(0).toUpperCase() + donation.status.slice(1)}
        </span>
      </div>

      {donation.description && (
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{donation.description}</p>
      )}

      <div className="grid grid-cols-2 gap-3 mb-3">
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <Package className="h-4 w-4" />
          <span>{donation.quantity}</span>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <Clock className="h-4 w-4" />
          <span>{donation.pickupWindow.start} - {donation.pickupWindow.end}</span>
        </div>
      </div>

      <div className="flex items-center space-x-2 text-sm text-gray-600 mb-3">
        <MapPin className="h-4 w-4" />
        <span className="truncate">{donation.location.address}</span>
      </div>

      <div className="flex space-x-2">
        <button
          onClick={() => onViewRoute(donation)}
          className="flex-1 flex items-center justify-center space-x-2 px-3 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
          title="Get directions to pickup location"
        >
          <Navigation className="h-4 w-4" />
          <span>Navigate</span>
        </button>
        
        {isAvailable && (
          <button
            onClick={() => onClaim(donation)}
            className="flex-1 px-3 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors"
            title="Claim this donation"
          >
            Claim
          </button>
        )}
        
        {donation.status === 'claimed' && donation.claimedBy === user?.uid && (
          <button
            onClick={() => onViewRoute(donation)}
            className="flex-1 flex items-center justify-center space-x-2 px-3 py-2 text-sm font-medium text-white bg-orange-600 rounded-lg hover:bg-orange-700 transition-colors"
            title="Navigate to pickup location"
          >
            <CheckCircle className="h-4 w-4" />
            Pickup Now
          </button>
        )}
      </div>

      <div className="text-xs text-gray-400 mt-2">
        Best before: {new Date(donation.expiryTime).toLocaleString()}
      </div>
    </div>
  );
};