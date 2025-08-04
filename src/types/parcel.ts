export interface Parcel {
  id: string;
  surface: number;
  codePostal: string;
  refCadastrale: string;
  adresse: string;
  coordinates: {
    lat: number;
    lng: number;
  };
}