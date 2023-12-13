import { getDistance } from 'geolib';

type Coordinates = {
  latitude: number;
  longitude: number;
};

const getLocationPermission = async () => {
  if (!navigator.geolocation) {
    return false;
  }
  const result = await navigator.permissions.query({ name: 'geolocation' });
  return result.state !== 'denied';
};

const getLocation = () => {
  if (!navigator.geolocation) {
    return new Promise<GeolocationCoordinates | null>((resolve, _) =>
      resolve(null)
    );
  }
  return new Promise<GeolocationCoordinates | null>((resolve, _) => {
    navigator.geolocation.getCurrentPosition(
      (pos) => resolve(pos.coords),
      (error) => {
        console.log(error);
        resolve(null);
      },
      { enableHighAccuracy: true, timeout: 5000, maximumAge: Infinity }
    );
  });
};

const isWithinRadius = async (
  latitude: number,
  longitude: number,
  radius: number
) => {
  const position = await getLocation();
  if (!position) {
    return false;
  }

  const distance = getDistance(
    { latitude: position.latitude, longitude: position.longitude },
    { latitude: latitude, longitude: longitude }
  );
  return distance < radius;
};

const GeolocationService = {
  getLocationPermission,
  getLocation,
  isWithinRadius,
};
export default GeolocationService;
export { Coordinates };
