"use client";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CalculationMethod, Coordinates, PrayerTimes } from "adhan";
import { SettingsIcon } from "lucide-react";
import { useState } from "react";

const calculationMethods = {
  MuslimWorldLeague: CalculationMethod.MuslimWorldLeague(),
  Egyptian: CalculationMethod.Egyptian(),
  Karachi: CalculationMethod.Karachi(),
  UmmAlQura: CalculationMethod.UmmAlQura(),
  Dubai: CalculationMethod.Dubai(),
  Qatar: CalculationMethod.Qatar(),
  Kuwait: CalculationMethod.Kuwait(),
  MoonsightingCommittee: CalculationMethod.MoonsightingCommittee(),
  Singapore: CalculationMethod.Singapore(),
  Turkey: CalculationMethod.Turkey(),
  Tehran: CalculationMethod.Tehran(),
  NorthAmerica: CalculationMethod.NorthAmerica(),
  Other: CalculationMethod.Other(),
};

export function SalahDisplay() {
  const [location, setLocation] = useState("");
  const [latitude, setLatitude] = useState(35.7897507);
  const [longitude, setLongitude] = useState(-78.6912485);
  const [calculationMethod, setCalculationMethod] = useState("MoonsightingCommittee");
  const [prayerTimes, setPrayerTimes] = useState(() => {
    const coordinates = new Coordinates(latitude, longitude);
    const params = calculationMethods[calculationMethod];
    const date = new Date();
    return new PrayerTimes(coordinates, date, params);
  });

  const handleSaveSettings = async () => {
    const coordinates = await fetchCoordinates(location);
    if (coordinates) {
      setLatitude(coordinates.lat);
      setLongitude(coordinates.lon);
      const params = calculationMethods[calculationMethod];
      const date = new Date();
      const newPrayerTimes = new PrayerTimes(new Coordinates(coordinates.lat, coordinates.lon), date, params);
      setPrayerTimes(newPrayerTimes);
    }
  };

  const fetchCoordinates = async (city: string) => {
    try {
      const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=YOUR_API_KEY`);
      const data = await response.json();
      if (data.coord) {
        return { lat: data.coord.lat, lon: data.coord.lon };
      }
    } catch (error) {
      console.error("Error fetching coordinates:", error);
    }
    return null;
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <main className="flex flex-col items-center justify-center h-screen bg-gray-100 dark:bg-gray-900">
      <div className="max-w-md w-full px-6 py-8 bg-white rounded-lg shadow-md dark:bg-gray-800">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200">Today Prayer Times</h1>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <SettingsIcon className="h-6 w-6 text-gray-500 dark:text-gray-400" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-72">
              <DropdownMenuLabel>Prayer Time Settings</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <div className="grid gap-4 p-4">
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    placeholder="Enter location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="latitude">Latitude</Label>
                  <Input
                    id="latitude"
                    type="number"
                    placeholder="Enter latitude"
                    value={latitude}
                    onChange={(e) => setLatitude(parseFloat(e.target.value))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="longitude">Longitude</Label>
                  <Input
                    id="longitude"
                    type="number"
                    placeholder="Enter longitude"
                    value={longitude}
                    onChange={(e) => setLongitude(parseFloat(e.target.value))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="calculationMethod">Calculation Method</Label>
                  <Select
                    value={calculationMethod}
                    onValueChange={(value) => setCalculationMethod(value)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select calculation method" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.keys(calculationMethods).map((method) => (
                        <SelectItem key={method} value={method}>
                          {method}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Button variant="ghost" className="w-full justify-start" onClick={handleSaveSettings}>
                  Save Settings
                </Button>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
            <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-2">Fajr</h2>
            <p className="text-2xl font-bold text-gray-800 dark:text-gray-200">
              {formatTime(prayerTimes.fajr)}
            </p>
          </div>
          <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
            <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-2">Dhuhr</h2>
            <p className="text-2xl font-bold text-gray-800 dark:text-gray-200">
              {formatTime(prayerTimes.dhuhr)}
            </p>
          </div>
          <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
            <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-2">Asr</h2>
            <p className="text-2xl font-bold text-gray-800 dark:text-gray-200">
              {formatTime(prayerTimes.asr)}
            </p>
          </div>
          <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
            <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-2">Maghrib</h2>
            <p className="text-2xl font-bold text-gray-800 dark:text-gray-200">
              {formatTime(prayerTimes.maghrib)}
            </p>
          </div>
          <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
            <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-2">Isha</h2>
            <p className="text-2xl font-bold text-gray-800 dark:text-gray-200">
              {formatTime(prayerTimes.isha)}
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
