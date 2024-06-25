import { CalculationMethod, type CalculationParameters, Coordinates, Madhab, PrayerTimes, SunnahTimes } from "adhan";
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
  cityName: string;
  latitude: string;
  longitude: string;
  meta: Meta | null;
  prayerTimes: PrayerTimes | null;
  sunnahTimes: SunnahTimes | null;
  madhab: "shafi" | "hanafi";
  playAdhan: boolean;
  rehydrated: boolean;
  setLocationInput: (input: string) => void;
  calculatePrayerTimes: () => void;
  setMadhab: (madhab: "shafi" | "hanafi") => void;
  setCoordinates: (latitude: string, longitude: string) => void;
  toggleAdhan: () => void;
  setMeta: (meta: Meta) => void;
  setCityName: (cityName: string) => void;
}

export const useLocationStore = create<LocationState>()(
  persist(
    (set, get) => ({
      locations: [],
      selectedLocation: null,
      locationInput: "",
      latitude: "",
      longitude: "",
      cityName: "",
      meta: null,
      prayerTimes: null,
      madhab: "shafi",
      playAdhan: true,
      sunnahTimes: null,
      rehydrated: false, // Initialize rehydrated state
      setLocationInput: (input) => set({ locationInput: input }),
      setCityName: (cityName) => set({ cityName }),
      setMeta(meta) {
        set({ meta });
      },
      calculatePrayerTimes: () => {
        const { meta, madhab } = get();
        if (!meta) return;

        const coordinates = new Coordinates(meta.latitude, meta.longitude);
        const params = getCalculationMethod(meta.method.name);
        params.fajrAngle = meta.method.params.Fajr;
        params.ishaAngle = meta.method.params.Isha;
        params.madhab = madhab === "shafi" ? Madhab.Shafi : Madhab.Hanafi;

        const prayerTimes = new PrayerTimes(coordinates, new Date(), params);

        const sunnahTimes = new SunnahTimes(prayerTimes);

        set({ prayerTimes, sunnahTimes });
      },
      setMadhab: (madhab) => set({ madhab }),
      setCoordinates: (latitude, longitude) => {
        const { latitude: currentLatitude, longitude: currentLongitude } = get();
        if (!(latitude !== currentLatitude || longitude !== currentLongitude)) {
          return;
        }
        set({ latitude, longitude });
        get().calculatePrayerTimes();
      },
      toggleAdhan: () => set((state) => ({ playAdhan: !state.playAdhan })),
    }),
    {
      name: "location-storage",
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        state!.rehydrated = true;
      },
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
