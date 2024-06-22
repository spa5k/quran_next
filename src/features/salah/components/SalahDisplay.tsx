"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SettingsIcon } from "lucide-react";
import { useEffect } from "react";
import { useLocationStore } from "../store/salahStore";

export function SalahDisplay() {
  const {
    locations,
    selectedLocation,
    locationInput,
    latitude,
    longitude,
    setLocationInput,
    fetchLocations,
    setSelectedLocation,
  } = useLocationStore();

  useEffect(() => {
    if (selectedLocation) {
      console.log("Fetching prayer times for:", selectedLocation);
    }
  }, [selectedLocation]);

  return (
    <main className="flex flex-col items-center justify-center h-screen bg-gray-100 dark:bg-gray-900">
      <div className="max-w-md w-full px-6 py-8 bg-white rounded-lg shadow-md dark:bg-gray-800">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200">Today Prayer Times</h1>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="ghost" size="icon">
                <SettingsIcon className="h-6 w-6 text-gray-500 dark:text-gray-400" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Prayer Time Settings</DialogTitle>
                <div className="grid gap-4 p-4">
                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      placeholder="Enter location"
                      value={locationInput}
                      onChange={(e) => setLocationInput(e.target.value)}
                    />
                    <Button onClick={fetchLocations}>Fetch Locations</Button>
                  </div>
                  {locations.length > 0 && (
                    <Select
                      onValueChange={(value) => {
                        const location = locations.find((loc) => loc.name === value);
                        if (location) {
                          setSelectedLocation(location);
                        }
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Theme" />
                      </SelectTrigger>
                      <SelectContent>
                        {locations.map((location, index) => (
                          <SelectItem
                            key={index}
                            value={location.name}
                            onClick={() => setSelectedLocation(location)}
                          >
                            {location.name}, {location.city ? `${location.city}, ` : ""}
                            {location.country}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                  <div className="space-y-2">
                    <Label htmlFor="latitude">Latitude</Label>
                    <Input id="latitude" type="number" placeholder="Enter latitude" value={latitude} readOnly />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="longitude">Longitude</Label>
                    <Input id="longitude" type="number" placeholder="Enter longitude" value={longitude} readOnly />
                  </div>

                  <Button variant="ghost" className="w-full justify-start">
                    Save Settings
                  </Button>
                </div>
              </DialogHeader>
            </DialogContent>
          </Dialog>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
            <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-2">Fajr</h2>
            <p className="text-2xl font-bold text-gray-800 dark:text-gray-200">4:30 AM</p>
          </div>
          <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
            <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-2">Dhuhr</h2>
            <p className="text-2xl font-bold text-gray-800 dark:text-gray-200">12:30 PM</p>
          </div>
          <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
            <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-2">Asr</h2>
            <p className="text-2xl font-bold text-gray-800 dark:text-gray-200">4:00 PM</p>
          </div>
          <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
            <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-2">Maghrib</h2>
            <p className="text-2xl font-bold text-gray-800 dark:text-gray-200">6:30 PM</p>
          </div>
          <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
            <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-2">Isha</h2>
            <p className="text-2xl font-bold text-gray-800 dark:text-gray-200">8:00 PM</p>
          </div>
        </div>
      </div>
    </main>
  );
}
