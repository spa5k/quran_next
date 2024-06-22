export interface LocationResponse {
  success: boolean;
  result: Location[];
}

export interface Location {
  name: string;
  city?: string;
  country: string;
  lat: string;
  lng: string;
}
