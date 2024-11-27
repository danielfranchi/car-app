import axiosInstance from "./axiosConfig";
import { RideDetails } from "../interfaces/RideDetails";
import { ConfirmRideResponse } from "../interfaces/ConfirmRideResponse";

export const confirmRide = async (
  rideDetails: RideDetails
): Promise<ConfirmRideResponse> => {
  const response = await axiosInstance.patch<ConfirmRideResponse>(
    "/ride/confirm",
    rideDetails
  );
  return response.data;
};
