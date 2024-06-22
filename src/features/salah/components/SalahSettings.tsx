import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import { PencilIcon, SettingsIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { Location, useLocationStore } from "../store/salahStore";

dayjs.extend(utc);
dayjs.extend(timezone);

export const SalahSettingsDialog = () => {
  const {
    locations,
    selectedLocation,
    locationInput,
    latitude,
    longitude,
    meta,
    setLocationInput,
    fetchLocations,
    setSelectedLocation,
    prayerTimes,
    madhab,
    setMadhab,
    calculatePrayerTimes,
    setCoordinates,
    fetchCityName,
  } = useLocationStore();

  const [isEditing, setIsEditing] = useState(false);
  const [tempLatitude, setTempLatitude] = useState(latitude);
  const [tempLongitude, setTempLongitude] = useState(longitude);
  const [locationSelected, setLocationSelected] = useState(false);

  useEffect(() => {
    setTempLatitude(latitude);
    setTempLongitude(longitude);
  }, [latitude, longitude]);

  const handleUpdatePrayerTimes = () => {
    setIsEditing(false);
    setCoordinates(tempLatitude, tempLongitude);
    calculatePrayerTimes();
  };

  const handleFetchLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setTempLatitude(latitude.toString());
          setTempLongitude(longitude.toString());
          setCoordinates(latitude.toString(), longitude.toString());
          fetchCityName(latitude.toString(), longitude.toString());
          calculatePrayerTimes();
        },
        (error) => {
          console.error("Error fetching location:", error);
        },
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  };

  const handleLocationSelect = (location: Location) => {
    setSelectedLocation(location);
    setLocationSelected(true);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <SettingsIcon className="h-6 w-6 text-gray-500 dark:text-gray-400" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogDescription className="sr-only">
          Prayer Time Settings
        </DialogDescription>
        <DialogHeader>
          <DialogTitle className="dialog-description">Prayer Time Settings</DialogTitle>
        </DialogHeader>
        <Tabs defaultValue="settings" className="w-full">
          <TabsList>
            <TabsTrigger value="settings">Settings</TabsTrigger>
            <TabsTrigger value="meta">Meta</TabsTrigger>
          </TabsList>
          <TabsContent value="settings">
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
              {locations.length > 0 && !locationSelected && (
                <>
                  <Label htmlFor="location">Select Location</Label>
                  <Select
                    onValueChange={(value) => {
                      const location = locations.find((loc) => loc.name === value);
                      if (location) {
                        handleLocationSelect(location);
                      }
                    }}
                    defaultValue={selectedLocation?.name}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Location" />
                    </SelectTrigger>
                    <SelectContent>
                      {locations.map((location, index) => (
                        <SelectItem
                          key={index}
                          value={location.name}
                          onClick={() => handleLocationSelect(location)}
                        >
                          {location.name}, {location.city ? `${location.city}, ` : ""}
                          {location.country}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </>
              )}
              <Label htmlFor="madhab">Madhab</Label>
              <Select
                defaultValue={madhab}
                onValueChange={(value) => {
                  if (value === "shafi" || value === "hanafi") {
                    setMadhab(value);
                    calculatePrayerTimes();
                  }
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Madhab" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="hanafi">Hanafi</SelectItem>
                  <SelectItem value="shafi">Shafi</SelectItem>
                </SelectContent>
              </Select>
              <div className="space-y-2">
                <Label htmlFor="latitude">Latitude</Label>
                <div className="flex items-center">
                  <Input
                    id="latitude"
                    type="number"
                    placeholder="Enter latitude"
                    value={isEditing ? tempLatitude : latitude}
                    onChange={(e) => setTempLatitude(e.target.value)}
                    readOnly={!isEditing}
                    disabled={!isEditing}
                  />
                  <Button variant="ghost" size="icon" onClick={() => setIsEditing(!isEditing)}>
                    <PencilIcon className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="longitude">Longitude</Label>
                <div className="flex items-center">
                  <Input
                    id="longitude"
                    type="number"
                    placeholder="Enter longitude"
                    value={isEditing ? tempLongitude : longitude}
                    onChange={(e) => setTempLongitude(e.target.value)}
                    readOnly={!isEditing}
                    disabled={!isEditing}
                  />
                  <Button variant="ghost" size="icon" onClick={() => setIsEditing(!isEditing)}>
                    <PencilIcon className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                  </Button>
                </div>
              </div>
              {isEditing && <Button onClick={handleUpdatePrayerTimes}>Update Prayer Times</Button>}
              <Button onClick={handleFetchLocation}>Use My Location</Button>
              <DialogFooter className="text-muted-foreground text-sm">
                Changes are automatically saved
              </DialogFooter>
            </div>
          </TabsContent>
          <TabsContent value="meta">
            {meta && (
              <Card className="w-[450px] overflow-auto">
                <CardHeader className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-2">
                  Metadata
                </CardHeader>
                <CardContent className="overflow-auto w-full">
                  <pre className="text-gray-800 dark:text-gray-200">
                    {JSON.stringify(meta, null, 2)}
                  </pre>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
