import React, { useEffect, useRef, useState } from 'react';
import { FoodDonation } from '../../types';
import { useGoogleMaps } from '../../hooks/useGoogleMaps';

interface FoodMapProps {
  donations: FoodDonation[];
  onMarkerClick: (donation: FoodDonation) => void;
  selectedDonation: FoodDonation | null;
}

export const FoodMap: React.FC<FoodMapProps> = ({ donations, onMarkerClick, selectedDonation }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<google.maps.Marker[]>([]);
  const { isLoaded } = useGoogleMaps();
  const [currentLocation, setCurrentLocation] = useState<{ lat: number; lng: number } | null>(null);

  useEffect(() => {
    // Get current location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          let errorMessage = 'Unknown geolocation error';
          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = 'Location access denied by user';
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage = 'Location information unavailable';
              break;
            case error.TIMEOUT:
              errorMessage = 'Location request timed out';
              break;
          }
          console.error('Error getting location:', errorMessage, error);
          // Default to a center location if geolocation fails
          setCurrentLocation({ lat: 18.5204, lng: 73.8567 }); // Pune

        }
      );
    }
  }, []);

  useEffect(() => {
    if (!isLoaded || !mapRef.current || !currentLocation) return;

    // Initialize map
    const map = new window.google.maps.Map(mapRef.current, {
      center: currentLocation,
      zoom: 12,
      styles: [
        {
          featureType: 'poi',
          elementType: 'labels',
          stylers: [{ visibility: 'off' }],
        },
      ],
    });

    mapInstanceRef.current = map;

    // Add current location marker
    new window.google.maps.Marker({
      position: currentLocation,
      map: map,
      title: 'Your Location',
      icon: {
        url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="8" fill="#3B82F6" stroke="white" stroke-width="2"/>
            <circle cx="12" cy="12" r="3" fill="white"/>
          </svg>
        `),
        scaledSize: new window.google.maps.Size(24, 24),
      },
    });

    return () => {
      // Cleanup
      markersRef.current.forEach(marker => marker.setMap(null));
      markersRef.current = [];
    };
  }, [isLoaded, currentLocation]);

  useEffect(() => {
    if (!mapInstanceRef.current) return;

    // Clear existing markers
    markersRef.current.forEach(marker => marker.setMap(null));
    markersRef.current = [];

    // Add donation markers
    donations.forEach((donation) => {
      const getMarkerColor = (status: string) => {
        switch (status) {
          case 'available':
            return '#10B981'; // green
          case 'claimed':
            return '#F97316'; // orange
          case 'expired':
            return '#EF4444'; // red
          default:
            return '#6B7280'; // gray
        }
      };

      const marker = new window.google.maps.Marker({
        position: { lat: donation.location.lat, lng: donation.location.lng },
        map: mapInstanceRef.current,
        title: donation.title,
        animation: window.google.maps.Animation.DROP,
        icon: {
          url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M16 2C10.477 2 6 6.477 6 12c0 7.5 10 18 10 18s10-10.5 10-18c0-5.523-4.477-10-10-10z" fill="${getMarkerColor(donation.status)}" stroke="white" stroke-width="2"/>
              <circle cx="16" cy="12" r="4" fill="white"/>
            </svg>
          `),
          scaledSize: new window.google.maps.Size(32, 32),
        },
      });

      const infoWindow = new window.google.maps.InfoWindow({
        content: `
          <div style="padding: 12px; max-width: 250px; font-family: system-ui, -apple-system, sans-serif;">
            <h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: bold;">${donation.title}</h3>
            <div style="margin: 8px 0; padding: 8px; background: #f9fafb; border-radius: 6px;">
              <p style="margin: 0 0 4px 0; font-size: 14px; color: #374151;"><strong>Quantity:</strong> ${donation.quantity}</p>
              <p style="margin: 0 0 4px 0; font-size: 14px; color: #374151;"><strong>Pickup:</strong> ${donation.pickupWindow.start} - ${donation.pickupWindow.end}</p>
              <p style="margin: 0; font-size: 12px; color: #6b7280;">By: ${donation.donorName}</p>
            </div>
            <div style="margin-top: 8px;">
              <span style="display: inline-block; padding: 4px 8px; background: ${getMarkerColor(donation.status)}; color: white; border-radius: 6px; font-size: 12px; font-weight: 500; text-transform: uppercase;">
                ${donation.status}
              </span>
            </div>
          </div>
        `,
      });

      marker.addListener('click', () => {
        // Close any open info windows
        markersRef.current.forEach(m => {
          if ((m as any).infoWindow) {
            (m as any).infoWindow.close();
          }
        });
        
        // Add bounce animation
        marker.setAnimation(window.google.maps.Animation.BOUNCE);
        setTimeout(() => marker.setAnimation(null), 2000);
        
        infoWindow.open(mapInstanceRef.current, marker);
        (marker as any).infoWindow = infoWindow;
        onMarkerClick(donation);
        
        // Pan to marker location
        mapInstanceRef.current?.panTo({ lat: donation.location.lat, lng: donation.location.lng });
      });

      markersRef.current.push(marker);
    });
  }, [donations, onMarkerClick]);

  useEffect(() => {
    if (!selectedDonation || !mapInstanceRef.current) return;

    // Pan to selected donation
    mapInstanceRef.current.panTo({
      lat: selectedDonation.location.lat,
      lng: selectedDonation.location.lng,
    });
  }, [selectedDonation]);

  if (!isLoaded) {
    return (
      <div className="w-full h-96 bg-gray-200 rounded-lg flex items-center justify-center">
        <div className="text-gray-500">Loading map...</div>
      </div>
    );
  }

  return (
    <div 
      ref={mapRef} 
      className="w-full h-96 rounded-lg shadow-md border border-gray-200"
      style={{ minHeight: '400px' }}
    />
  );
};