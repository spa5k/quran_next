export interface LocationResponse {
  results: Result[];
  credits: string;
  status: string;
}

export interface Result {
  class: string;
  type: string;
  address_components: AddressComponents;
  formatted_address: string;
  geometry: Geometry;
  osmurl: string;
  importance: string;
}

export interface AddressComponents {
  name: string;
  island?: string;
  neighbourhood?: string;
  street: string;
  subdistrict?: string;
  district: string;
  city?: string;
  state: string;
  postcode: string;
  country: string;
}

export interface Geometry {
  location: Location;
  viewport: Viewport;
}

export interface Location {
  lat: string;
  lng: string;
}

export interface Viewport {
  northeast: Location;
  southwest: Location;
}
