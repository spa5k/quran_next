import { CalculationMethod, type CalculationParameters, Coordinates, Madhab, PrayerTimes } from "adhan";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export interface Location {
  name: string;
  city?: string;
  country: string;
  lat: string;
  lng: string;
}

export interface Meta {
  latitude: number;
  longitude: number;
  timezone: string;
  method: {
    id: number;
    name: string;
    params: {
      Fajr: number;
      Isha: number;
    };
    location: {
      latitude: number;
      longitude: number;
    };
  };
  latitudeAdjustmentMethod: string;
  midnightMode: string;
  school: string;
  offset: {
    Imsak: number;
    Fajr: number;
    Sunrise: number;
    Dhuhr: number;
    Asr: number;
    Maghrib: number;
    Sunset: number;
    Isha: number;
    Midnight: number;
  };
}

interface LocationState {
  locations: Location[];
  selectedLocation: Location | null;
  locationInput: string;
  latitude: string;
  longitude: string;
  meta: Meta | null;
  prayerTimes: PrayerTimes | null;
  madhab: "shafi" | "hanafi";
  setLocationInput: (input: string) => void;
  fetchLocations: () => Promise<void>;
  setSelectedLocation: (location: Location) => void;
  fetchMeta: () => Promise<void>;
  calculatePrayerTimes: () => void;
  setMadhab: (madhab: "shafi" | "hanafi") => void;
}

export const useLocationStore = create<LocationState>()(
  persist(
    (set, get) => ({
      locations: [],
      selectedLocation: null,
      locationInput: "",
      latitude: "",
      longitude: "",
      meta: null,
      prayerTimes: null,
      madhab: "shafi",
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
      setSelectedLocation: (location) => {
        set({
          selectedLocation: location,
          latitude: location.lat,
          longitude: location.lng,
        });
        get().fetchMeta();
      },
      fetchMeta: async () => {
        const { latitude, longitude } = get();
        try {
          const response = await fetch(
            `https://api.aladhan.com/v1/calendar/2024/6?latitude=${latitude}&longitude=${longitude}`,
          );
          const data = await response.json();
          if (data.code === 200) {
            set({
              meta: data.data[0].meta,
            });
            get().calculatePrayerTimes();
          }
        } catch (error) {
          console.error("Error fetching metadata:", error);
        }
      },
      calculatePrayerTimes: () => {
        const { meta, madhab } = get();
        if (!meta) {
          return;
        }
        const coordinates = new Coordinates(meta.latitude, meta.longitude);
        const params = getCalculationMethod(meta.method.name);
        params.fajrAngle = meta.method.params.Fajr;
        params.ishaAngle = meta.method.params.Isha;
        params.madhab = madhab === "shafi" ? Madhab.Shafi : Madhab.Hanafi;
        const date = new Date();
        const prayerTimes = new PrayerTimes(coordinates, date, params);
        set({ prayerTimes });
      },
      setMadhab: (madhab) => set({ madhab }),
    }),
    {
      name: "location-storage", // unique name
      storage: createJSONStorage(() => localStorage), // using localStorage for persistence
    },
  ),
);

const getCalculationMethod = (methodName: string): CalculationParameters => {
  switch (methodName) {
    case "Muslim World League":
      return CalculationMethod.MuslimWorldLeague();
    case "Egyptian General Authority of Survey":
      return CalculationMethod.Egyptian();
    case "University of Islamic Sciences, Karachi":
      return CalculationMethod.Karachi();
    case "Umm Al-Qura University, Makkah":
      return CalculationMethod.UmmAlQura();
    case "Dubai":
      return CalculationMethod.Dubai();
    case "Moonsighting Committee":
      return CalculationMethod.MoonsightingCommittee();
    case "ISNA":
      return CalculationMethod.NorthAmerica();
    case "Kuwait":
      return CalculationMethod.Kuwait();
    case "Qatar":
      return CalculationMethod.Qatar();
    case "Singapore":
      return CalculationMethod.Singapore();
    case "Institute of Geophysics, University of Tehran":
      return CalculationMethod.Tehran();
    case "Diyanet İşleri Başkanlığı, Turkey":
      return CalculationMethod.Turkey();
    default:
      return CalculationMethod.Other();
  }
};
