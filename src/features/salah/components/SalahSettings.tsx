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
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import { Pause, PencilIcon, Play, SettingsIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
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
    playAdhan,
    toggleAdhan,
    cityName,
  } = useLocationStore();

  const [isEditing, setIsEditing] = useState(false);
  const [tempLatitude, setTempLatitude] = useState(latitude);
  const [tempLongitude, setTempLongitude] = useState(longitude);
  const [locationSelected, setLocationSelected] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false); // Track if Adhan is playing
  const [hasSearched, setHasSearched] = useState(false); // Track if user has searched for location
  const adhanAudioRef = useRef<HTMLAudioElement>(null);

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

  const showNotification = (prayerName: string) => {
    if (Notification.permission === "granted") {
      new Notification("Prayer Time", {
        body: `It's time for ${prayerName} prayer.`,
        icon: "/path/to/icon.png", // Replace with your icon path
      });
    }
  };

  const handlePlayPauseAdhan = () => {
    if (adhanAudioRef.current) {
      if (isPlaying) {
        adhanAudioRef.current.pause();
        adhanAudioRef.current.currentTime = 0;
        setIsPlaying(false);
      } else {
        adhanAudioRef.current.play();
        // send notification to user that adhan is playing
        showNotification(prayerTimes?.currentPrayer() || "Fajr");
        setIsPlaying(true);
      }
    }
  };

  const handleFetchLocations = async () => {
    await fetchLocations();
    setHasSearched(true); // Set hasSearched to true when user searches for location
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          Salah Settings
          <SettingsIcon className="h-6 w-6 ml-4" />
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
                <Button onClick={handleFetchLocations}>Fetch Locations</Button>
              </div>
              {hasSearched && locations.length > 0 && !locationSelected && (
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
              <Label htmlFor="playAdhan">Play Adhan</Label>
              <div className="flex justify-between items-center">
                <Switch
                  id="playAdhan"
                  checked={playAdhan}
                  onCheckedChange={toggleAdhan}
                />
                <Button onClick={handlePlayPauseAdhan} size="icon">
                  {isPlaying ? <Pause /> : <Play />}
                </Button>
              </div>

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
      <audio ref={adhanAudioRef} src="/azan1.mp3" />
    </Dialog>
  );
};
