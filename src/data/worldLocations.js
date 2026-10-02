import { project } from '../assets/maps/projection'

export const WORLD_LOCATIONS = [
  // Primary Milestone Hubs
  { id: 'uganda', label: 'Uganda', note: 'Born 1971', lon: 32.5825, lat: 2.2, align: 'up' },
  { id: 'india', label: 'India', note: 'Studies (1993-2012)', lon: 74.856, lat: 14.5, align: 'left' },
  { id: 'east-africa', label: 'East Africa', note: 'Gold 2010', lon: 43.5, lat: 4.5, align: 'right' },
  { id: 'pan-africa', label: 'Pan-Africa', note: 'Charity 2014', lon: 25.0, lat: -28.0, align: 'left' },
  { id: 'dubai', label: 'Dubai (UAE)', note: 'Base 2016+', lon: 55.2708, lat: 25.2048, align: 'up' },

  // Global Destinations
  { id: 'uk', label: 'United Kingdom (London)', note: 'Europe Hub', lon: -0.1276, lat: 51.5074, align: 'up' },
  { id: 'usa', label: 'United States (New York)', note: 'Americas Hub', lon: -74.006, lat: 40.7128, align: 'left' },
  { id: 'france', label: 'France (Paris)', note: 'Europe', lon: 2.3522, lat: 48.8566, align: 'up' },
  { id: 'germany', label: 'Germany (Berlin)', note: 'Europe', lon: 13.405, lat: 52.52, align: 'up' },
  { id: 'switzerland', label: 'Switzerland (Zurich)', note: 'Europe', lon: 8.5417, lat: 47.3769, align: 'up' },
  { id: 'italy', label: 'Italy (Rome)', note: 'Europe', lon: 12.4964, lat: 41.9028, align: 'right' },
  { id: 'spain', label: 'Spain (Madrid)', note: 'Europe', lon: -3.7038, lat: 40.4168, align: 'left' },
  { id: 'turkey', label: 'Turkey (Istanbul)', note: 'Eurasia', lon: 28.9784, lat: 41.0082, align: 'up' },
  { id: 'russia', label: 'Russia (Moscow)', note: 'Eurasia', lon: 37.6173, lat: 55.7558, align: 'up' },
  { id: 'qatar', label: 'Qatar (Doha)', note: 'Middle East', lon: 51.531, lat: 25.2854, align: 'left' },
  { id: 'saudi', label: 'Saudi Arabia (Riyadh)', note: 'Middle East', lon: 46.6753, lat: 24.7136, align: 'down' },
  { id: 'singapore', label: 'Singapore', note: 'Southeast Asia', lon: 103.8198, lat: 1.3521, align: 'right' },
  { id: 'hongkong', label: 'Hong Kong', note: 'East Asia', lon: 114.1694, lat: 22.3193, align: 'right' },
  { id: 'china', label: 'China (Beijing)', note: 'East Asia', lon: 116.4074, lat: 39.9042, align: 'up' },
  { id: 'japan', label: 'Japan (Tokyo)', note: 'East Asia', lon: 139.6917, lat: 35.6895, align: 'right' },
  { id: 'thailand', label: 'Thailand (Bangkok)', note: 'Southeast Asia', lon: 100.5018, lat: 13.7563, align: 'right' },
  { id: 'indonesia', label: 'Indonesia (Jakarta)', note: 'Southeast Asia', lon: 106.8456, lat: -6.2088, align: 'down' },
  { id: 'australia', label: 'Australia (Sydney)', note: 'Oceania', lon: 151.2093, lat: -33.8688, align: 'right' },
  { id: 'canada', label: 'Canada (Toronto)', note: 'North America', lon: -79.3832, lat: 43.6532, align: 'left' },
  { id: 'brazil', label: 'Brazil (São Paulo)', note: 'South America', lon: -46.6333, lat: -23.5505, align: 'left' },
  { id: 'kenya', label: 'Kenya (Nairobi)', note: 'East Africa', lon: 36.8219, lat: -1.2921, align: 'right' },
  { id: 'rwanda', label: 'Rwanda (Kigali)', note: 'East Africa', lon: 30.0619, lat: -1.9441, align: 'right' },
  { id: 'tanzania', label: 'Tanzania (Dar es Salaam)', note: 'East Africa', lon: 39.2083, lat: -6.7924, align: 'right' },
  { id: 'south-africa', label: 'South Africa (Johannesburg)', note: 'Southern Africa', lon: 28.0473, lat: -26.2041, align: 'right' },
  { id: 'nigeria', label: 'Nigeria (Lagos)', note: 'West Africa', lon: 3.3792, lat: 6.5244, align: 'left' },
  { id: 'egypt', label: 'Egypt (Cairo)', note: 'North Africa', lon: 31.2357, lat: 30.0444, align: 'up' },
]

export function getProjectedLocation(loc) {
  const coords = project(loc.lon, loc.lat)
  return {
    ...loc,
    x: coords.x,
    y: coords.y,
  }
}
