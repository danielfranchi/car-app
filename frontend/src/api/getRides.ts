import axiosInstance from "./axiosConfig";
import {
  FetchRidesResponse,
  FetchDriversResponse,
} from "../interfaces/rideResponses";

export const fetchRides = async (
  customerId: string,
  driverId?: string
): Promise<FetchRidesResponse> => {
  const response = await axiosInstance.get<FetchRidesResponse>(
    `/ride/${customerId}`,
    {
      params: {
        driver_id: driverId,
      },
    }
  );
  return response.data;
};

export const fetchDrivers = async (
  customerId: string
): Promise<FetchDriversResponse> => {
  const response = await axiosInstance.get<FetchDriversResponse>(
    `/ride/${customerId}`
  );
  return response.data;
};
