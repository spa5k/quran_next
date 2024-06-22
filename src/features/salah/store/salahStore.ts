import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export interface Location {
  name: string;
  city?: string;
  country: string;
  lat: string;
  lng: string;
}

interface LocationState {
  locations: Location[];
  selectedLocation: Location | null;
  locationInput: string;
  latitude: string;
  longitude: string;
  setLocationInput: (input: string) => void;
  fetchLocations: () => Promise<void>;
  setSelectedLocation: (location: Location) => void;
}

export const useLocationStore = create<LocationState>()(
  persist(
    (set, get) => ({
      locations: [],
      selectedLocation: null,
      locationInput: "",
      latitude: "",
      longitude: "",
      setLocationInput: (input) => set({ locationInput: input }),
      fetchLocations: async () => {
        const { locationInput } = get();
        try {
          const response = await fetch(
            `https://quran-location.remtl.workers.dev/api/location/${locationInput}`,
            {
              headers: {
                "X-Custom-Header": "your-random-value",
              },
            },
          );
          const data = await response.json();
          if (data.success) {
            set({ locations: data.result });
          }
        } catch (error) {
          console.error("Error fetching locations:", error);
        }
      },
      setSelectedLocation: (location) =>
        set({
          selectedLocation: location,
          latitude: location.lat,
          longitude: location.lng,
        }),
    }),
    {
      name: "location-storage", // unique name
      storage: createJSONStorage(() => localStorage), // using localStorage for persistence
    },
  ),
);
