import { Driver } from "./Driver";

export interface EstimateRideResponse {
  options: Driver[];
  polyline: string;
  distance: number;
  duration: string;
}
