import React, { useState, useEffect } from 'react';
import { MapPin, Plus, X, Navigation, Clock, Package } from 'lucide-react';
import { FoodDonation } from '../../types';

interface MultiLocationSelectorProps {
  donations: FoodDonation[];
  onStartRoute: (selectedDonations: FoodDonation[]) => void;
  onClose: () => void;
}

export const MultiLocationSelector: React.FC<MultiLocationSelectorProps> = ({
  donations,
  onStartRoute,
  onClose,
}) => {
  const [selectedDonations, setSelectedDonations] = useState<FoodDonation[]>([]);
  const [estimatedTime, setEstimatedTime] = useState<string>('');

  useEffect(() => {
    // Calculate estimated time based on selected donations
    if (selectedDonations.length > 0) {
      const baseTime = 15; // 15 minutes per pickup
      const travelTime = selectedDonations.length * 10; // 10 minutes travel between locations
      const total = baseTime * selectedDonations.length + travelTime;
      setEstimatedTime(`${Math.round(total)} min`);
    } else {
      setEstimatedTime('');
    }
  }, [selectedDonations]);

  const toggleDonation = (donation: FoodDonation) => {
    setSelectedDonations(prev => {
      const exists = prev.find(d => d.id === donation.id);
      if (exists) {
        return prev.filter(d => d.id !== donation.id);
      } else {
        return [...prev, donation];
      }
    });
  };

  const handleStartRoute = () => {
    if (selectedDonations.length > 0) {
      onStartRoute(selectedDonations);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center">
              <MapPin className="h-6 w-6 mr-2 text-green-600" />
              Select Pickup Locations
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
            >
              ×
            </button>
          </div>
          {selectedDonations.length > 0 && (
            <div className="mt-4 p-3 bg-green-50 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-green-800 font-medium">
                  {selectedDonations.length} location{selectedDonations.length > 1 ? 's' : ''} selected
                </span>
                <span className="text-green-600 text-sm">
                  Est. time: {estimatedTime}
                </span>
              </div>
            </div>
          )}
        </div>

        <div className="p-6 max-h-96 overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {donations.map((donation) => {
              const isSelected = selectedDonations.find(d => d.id === donation.id);
              return (
                <div
                  key={donation.id}
                  onClick={() => toggleDonation(donation)}
                  className={`p-4 border-2 rounded-lg cursor-pointer transition-all hover:shadow-md ${
                    isSelected
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-gray-900">{donation.title}</h3>
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                      isSelected ? 'border-green-500 bg-green-500' : 'border-gray-300'
                    }`}>
                      {isSelected && <Plus className="h-3 w-3 text-white rotate-45" />}
                    </div>
                  </div>
                  
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-center space-x-2">
                      <Package className="h-4 w-4" />
                      <span>{donation.quantity}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4" />
                      <span>{donation.pickupWindow.start} - {donation.pickupWindow.end}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-4 w-4" />
                      <span className="truncate">{donation.location.address}</span>
                    </div>
                  </div>
                  
                  <div className="mt-2">
                    <span className="text-xs text-gray-500">By: {donation.donorName}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="p-6 border-t border-gray-200">
          <div className="flex space-x-4">
            <button
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleStartRoute}
              disabled={selectedDonations.length === 0}
              className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
            >
              <Navigation className="h-5 w-5" />
              <span>Start Pickup Route ({selectedDonations.length})</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};