export interface RideDetails {
  customer_id: string;
  origin: string;
  destination: string;
  distance: number | null;
  duration: string | null;
  driver: {
    id: number;
    name: string;
  };
  value: number;
}
