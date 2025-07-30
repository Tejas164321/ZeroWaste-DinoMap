import React from 'react';
import { Clock, MapPin, Package, Users, Calendar } from 'lucide-react';
import { FoodDonation } from '../../types';

interface DonationCardProps {
  donation: FoodDonation;
}

export const DonationCard: React.FC<DonationCardProps> = ({ donation }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'claimed':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'picked':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'expired':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-semibold text-gray-900">{donation.title}</h3>
        <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(donation.status)}`}>
          {donation.status.charAt(0).toUpperCase() + donation.status.slice(1)}
        </span>
      </div>

      {donation.description && (
        <p className="text-gray-600 mb-4">{donation.description}</p>
      )}

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <Package className="h-4 w-4" />
          <span>{donation.quantity}</span>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <span className="px-2 py-1 bg-gray-100 rounded text-xs font-medium">
            {donation.foodType}
          </span>
        </div>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <Calendar className="h-4 w-4" />
          <span>Best before: {formatDate(donation.expiryTime)}</span>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <Clock className="h-4 w-4" />
          <span>Pickup: {donation.pickupWindow.start} - {donation.pickupWindow.end}</span>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <MapPin className="h-4 w-4" />
          <span>{donation.location.address}</span>
        </div>
      </div>

      {donation.claimedByName && (
        <div className="flex items-center space-x-2 text-sm text-green-600 bg-green-50 p-2 rounded">
          <Users className="h-4 w-4" />
          <span>Claimed by: {donation.claimedByName}</span>
        </div>
      )}

      <div className="text-xs text-gray-400 mt-4">
        Posted: {formatDate(donation.createdAt)}
      </div>
    </div>
  );
};