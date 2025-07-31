import React, { useState, useEffect } from 'react';
import { Plus, MapPin, Clock, Package, Calendar, AlertCircle } from 'lucide-react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { useAuth } from '../../hooks/useAuth';
import { useGoogleMaps } from '../../hooks/useGoogleMaps';
import { FoodDonation } from '../../types';
import { v4 as uuidv4 } from 'uuid';

interface PostFoodFormProps {
  onClose: () => void;
  onSuccess: () => void;
}

export const PostFoodForm: React.FC<PostFoodFormProps> = ({ onClose, onSuccess }) => {
  const { user } = useAuth();
  const { isLoaded } = useGoogleMaps();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [currentLocation, setCurrentLocation] = useState<{ lat: number; lng: number; address: string } | null>(null);
  const [autocomplete, setAutocomplete] = useState<google.maps.places.Autocomplete | null>(null);
  const [addressInputRef, setAddressInputRef] = useState<HTMLInputElement | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    quantity: '',
    foodType: 'prepared',
    expiryTime: '',
    pickupStart: '',
    pickupEnd: '',
    address: '',
  });

  useEffect(() => {
    // Initialize Google Places Autocomplete
    if (isLoaded && addressInputRef && !autocomplete) {
      const autocompleteInstance = new window.google.maps.places.Autocomplete(addressInputRef, {
        types: ['establishment', 'geocode'],
        componentRestrictions: { country: 'in' }, // Restrict to India, change as needed
      });

      autocompleteInstance.addListener('place_changed', () => {
        const place = autocompleteInstance.getPlace();
        if (place.geometry && place.geometry.location) {
          const lat = place.geometry.location.lat();
          const lng = place.geometry.location.lng();
          const address = place.formatted_address || place.name || '';
          
          setCurrentLocation({ lat, lng, address });
          setFormData(prev => ({ ...prev, address }));
        }
      });

      setAutocomplete(autocompleteInstance);
    }
  }, [isLoaded, addressInputRef, autocomplete]);

  useEffect(() => {
    // Get current location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          
          // In a real app, you'd use Google Maps Geocoding API to get the address
          const address = `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
          
          setCurrentLocation({
            lat: latitude,
            lng: longitude,
            address: address
          });
          
          setFormData(prev => ({ ...prev, address }));
        },
        (error) => {
          console.error('Error getting location:', error);
        }
      );
    }
  }, []);

  // Check if form is valid
  const isFormValid = () => {
    return (
      formData.title.trim() !== '' &&
      formData.quantity.trim() !== '' &&
      formData.expiryTime !== '' &&
      formData.pickupStart !== '' &&
      formData.pickupEnd !== '' &&
      formData.address.trim() !== ''
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !currentLocation) return;

    setLoading(true);
    setError('');

    try {
      const donation: Omit<FoodDonation, 'id'> = {
        donorId: user.uid,
        donorName: user.displayName,
        title: formData.title,
        description: formData.description,
        quantity: formData.quantity,
        foodType: formData.foodType,
        expiryTime: formData.expiryTime,
        pickupWindow: {
          start: formData.pickupStart,
          end: formData.pickupEnd,
        },
        location: {
          lat: currentLocation.lat,
          lng: currentLocation.lng,
          address: formData.address,
        },
        status: 'available',
        createdAt: new Date().toISOString(),
      };

      await addDoc(collection(db, 'donations'), donation);
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to post donation');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center">
              <Plus className="h-6 w-6 mr-2 text-green-600" />
              Post Surplus Food
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
            >
              ×
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2 text-red-700">
              <AlertCircle className="h-5 w-5" />
              <span className="text-sm">{error}</span>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Food Title
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="e.g., Fresh Sandwiches, Leftover Pasta"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Describe the food, ingredients, dietary restrictions..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Package className="inline h-4 w-4 mr-1" />
                Quantity
              </label>
              <input
                type="text"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="e.g., Serves 20 people, 5 boxes"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Food Type
              </label>
              <select
                name="foodType"
                value={formData.foodType}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="prepared">Prepared Food</option>
                <option value="packaged">Packaged Food</option>
                <option value="produce">Fresh Produce</option>
                <option value="baked">Baked Goods</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="inline h-4 w-4 mr-1" />
                Best Before
              </label>
              <input
                type="datetime-local"
                name="expiryTime"
                value={formData.expiryTime}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Clock className="inline h-4 w-4 mr-1" />
                Pickup Window
              </label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="time"
                  name="pickupStart"
                  value={formData.pickupStart}
                  onChange={handleChange}
                  required
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
                <input
                  type="time"
                  name="pickupEnd"
                  value={formData.pickupEnd}
                  onChange={handleChange}
                  required
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <MapPin className="inline h-4 w-4 mr-1" />
                Pickup Location
              </label>
              <input
                type="text"
                name="address"
                ref={setAddressInputRef}
                value={formData.address}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Start typing address for suggestions..."
              />
              {currentLocation && (
                <p className="text-sm text-gray-500 mt-1">
                  Location confirmed: {currentLocation.address}
                </p>
              )}
            </div>
          </div>

          <div className="flex space-x-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !isFormValid()}
              className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Posting...' : 'Post Food Donation'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};