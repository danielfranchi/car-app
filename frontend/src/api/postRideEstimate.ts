import axiosInstance from "./axiosConfig";
import { EstimateRideResponse } from "../interfaces/EstimateRideResponse";

export const estimateRide = async (
  customerId: string,
  origin: string,
  destination: string
): Promise<EstimateRideResponse> => {
  const response = await axiosInstance.post<EstimateRideResponse>(
    "/ride/estimate",
    {
      customer_id: customerId,
      origin,
      destination,
    }
  );
  return response.data;
};
