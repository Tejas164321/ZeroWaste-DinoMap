import { useEffect, useState } from 'react';

// Global promise to ensure Google Maps is loaded only once
let googleMapsPromise: Promise<void> | null = null;

export const useGoogleMaps = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [loadError, setLoadError] = useState<Error | null>(null);

  useEffect(() => {
    // Check if Google Maps is already loaded
    if (window.google && window.google.maps) {
      setIsLoaded(true);
      return;
    }

    // Use global promise to ensure script is loaded only once
    if (!googleMapsPromise) {
      googleMapsPromise = new Promise<void>((resolve, reject) => {
        // Check if script already exists
        const existingScript = document.querySelector(`script[src*="maps.googleapis.com"]`);
        if (existingScript) {
          resolve();
          return;
        }

        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyDf1vfB2AGpVCGh1fdwB5mMZ-ClAnYh0ic&libraries=places,geometry`;
        script.async = true;
        script.defer = true;

        script.onload = () => {
          resolve();
        };

        script.onerror = () => {
          reject(new Error('Failed to load Google Maps'));
        };

        document.head.appendChild(script);
      });
    }

    googleMapsPromise
      .then(() => {
        setIsLoaded(true);
      })
      .catch((error) => {
        setLoadError(error);
      });

    // No cleanup needed - script should persist once loaded
  }, []);

  return { isLoaded, loadError };
};