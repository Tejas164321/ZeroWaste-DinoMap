import React, { useState, useEffect, useRef } from 'react';
import { Navigation, MapPin, CheckCircle, Clock, Package, Trophy, Star } from 'lucide-react';
import { FoodDonation } from '../../types';
import { useGoogleMaps } from '../../hooks/useGoogleMaps';

interface RouteTrackerProps {
  donations: FoodDonation[];
  onComplete: () => void;
  onClose: () => void;
}

export const RouteTracker: React.FC<RouteTrackerProps> = ({
  donations,
  onComplete,
  onClose,
}) => {
  const { isLoaded } = useGoogleMaps();
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const directionsServiceRef = useRef<google.maps.DirectionsService | null>(null);
  const directionsRendererRef = useRef<google.maps.DirectionsRenderer | null>(null);
  
  const [currentLocation, setCurrentLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [currentDonationIndex, setCurrentDonationIndex] = useState(0);
  const [completedDonations, setCompletedDonations] = useState<string[]>([]);
  const [progress, setProgress] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);
  const [estimatedTime, setEstimatedTime] = useState<string>('');
  const [distance, setDistance] = useState<string>('');

  useEffect(() => {
    if (navigator.geolocation) {
      const watchId = navigator.geolocation.watchPosition(
        (position) => {
          setCurrentLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.error('Error watching location:', error);
        },
        { enableHighAccuracy: true, maximumAge: 10000, timeout: 5000 }
      );

      return () => navigator.geolocation.clearWatch(watchId);
    }
  }, []);

  useEffect(() => {
    if (!isLoaded || !mapRef.current || !currentLocation) return;

    const map = new window.google.maps.Map(mapRef.current, {
      center: currentLocation,
      zoom: 14,
      styles: [
        {
          featureType: 'poi',
          elementType: 'labels',
          stylers: [{ visibility: 'off' }],
        },
      ],
    });

    mapInstanceRef.current = map;
    directionsServiceRef.current = new window.google.maps.DirectionsService();
    directionsRendererRef.current = new window.google.maps.DirectionsRenderer({
      suppressMarkers: false,
      polylineOptions: {
        strokeColor: '#10B981',
        strokeWeight: 4,
      },
    });

    directionsRendererRef.current.setMap(map);

    // Calculate and display route
    calculateRoute();
  }, [isLoaded, currentLocation, donations]);

  const calculateRoute = () => {
    if (!directionsServiceRef.current || !currentLocation || donations.length === 0) return;

    const waypoints = donations.slice(0, -1).map(donation => ({
      location: { lat: donation.location.lat, lng: donation.location.lng },
      stopover: true,
    }));

    const destination = donations[donations.length - 1];

    directionsServiceRef.current.route(
      {
        origin: currentLocation,
        destination: { lat: destination.location.lat, lng: destination.location.lng },
        waypoints: waypoints,
        optimizeWaypoints: true,
        travelMode: window.google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (status === 'OK' && result) {
          directionsRendererRef.current?.setDirections(result);
          
          // Calculate total time and distance
          let totalTime = 0;
          let totalDistance = 0;
          
          result.routes[0].legs.forEach(leg => {
            if (leg.duration) totalTime += leg.duration.value;
            if (leg.distance) totalDistance += leg.distance.value;
          });

          setEstimatedTime(`${Math.round(totalTime / 60)} min`);
          setDistance(`${(totalDistance / 1000).toFixed(1)} km`);
        }
      }
    );
  };

  const handleClaimDonation = (donation: FoodDonation) => {
    setCompletedDonations(prev => [...prev, donation.id]);
    
    const newProgress = ((completedDonations.length + 1) / donations.length) * 100;
    setProgress(newProgress);

    if (completedDonations.length + 1 === donations.length) {
      // All donations completed
      setShowCelebration(true);
      setTimeout(() => {
        onComplete();
      }, 3000);
    } else {
      setCurrentDonationIndex(prev => prev + 1);
    }
  };

  const getCurrentDonation = () => {
    return donations.find(d => !completedDonations.includes(d.id));
  };

  const currentDonation = getCurrentDonation();

  if (showCelebration) {
    return (
      <div className="fixed inset-0 bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center z-50">
        <div className="text-center text-white animate-bounce">
          <Trophy className="h-24 w-24 mx-auto mb-4 animate-pulse" />
          <h1 className="text-4xl font-bold mb-2">Mission Complete! 🎉</h1>
          <p className="text-xl mb-4">You've successfully collected all donations!</p>
          <div className="flex items-center justify-center space-x-2">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="h-8 w-8 fill-current animate-pulse" style={{ animationDelay: `${i * 0.2}s` }} />
            ))}
          </div>
          <p className="mt-4 text-lg">Making a difference, one meal at a time! 💚</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-white z-50 flex flex-col">
      {/* Header */}
      <div className="bg-white shadow-lg p-4 border-b">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900 flex items-center">
            <Navigation className="h-6 w-6 mr-2 text-green-600" />
            Pickup Route
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
          >
            ×
          </button>
        </div>

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">
              Progress: {completedDonations.length}/{donations.length} completed
            </span>
            <span className="text-sm text-gray-500">{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-gradient-to-r from-green-500 to-green-600 h-3 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            >
              <div className="h-full bg-white bg-opacity-30 rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>

        {/* Route Info */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center space-x-2 text-gray-600">
            <Clock className="h-4 w-4" />
            <span>Est. time: {estimatedTime}</span>
          </div>
          <div className="flex items-center space-x-2 text-gray-600">
            <MapPin className="h-4 w-4" />
            <span>Distance: {distance}</span>
          </div>
        </div>
      </div>

      {/* Map */}
      <div className="flex-1 relative">
        <div ref={mapRef} className="w-full h-full" />
        
        {/* Current Donation Card */}
        {currentDonation && (
          <div className="absolute bottom-4 left-4 right-4 bg-white rounded-lg shadow-lg p-4">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="font-semibold text-lg text-gray-900">{currentDonation.title}</h3>
                <p className="text-gray-600 text-sm">By: {currentDonation.donorName}</p>
              </div>
              <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                Next Pickup
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4 text-sm text-gray-600">
              <div className="flex items-center space-x-2">
                <Package className="h-4 w-4" />
                <span>{currentDonation.quantity}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4" />
                <span>{currentDonation.pickupWindow.start} - {currentDonation.pickupWindow.end}</span>
              </div>
            </div>

            <div className="flex items-center space-x-2 mb-4 text-sm text-gray-600">
              <MapPin className="h-4 w-4" />
              <span>{currentDonation.location.address}</span>
            </div>

            <button
              onClick={() => handleClaimDonation(currentDonation)}
              className="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center justify-center space-x-2"
            >
              <CheckCircle className="h-5 w-5" />
              <span>Mark as Collected</span>
            </button>
          </div>
        )}
      </div>

      {/* Completed Donations List */}
      {completedDonations.length > 0 && (
        <div className="bg-gray-50 p-4 border-t max-h-32 overflow-y-auto">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Completed Pickups:</h4>
          <div className="space-y-1">
            {donations
              .filter(d => completedDonations.includes(d.id))
              .map(donation => (
                <div key={donation.id} className="flex items-center space-x-2 text-sm text-green-600">
                  <CheckCircle className="h-4 w-4" />
                  <span>{donation.title} - {donation.donorName}</span>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};