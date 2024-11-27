import { Request, Response } from "express"
import axios from "axios"
import { drivers } from "../models/driverModel"

export const estimateRide = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { customer_id, origin, destination } = req.body

  if (!customer_id || !origin || !destination) {
    res.status(400).json({
      error_code: "INVALID_DATA",
      error_description:
        "Os campos customer_id, origin e destination são obrigatórios.",
    })
    return
  }

  if (origin === destination) {
    res.status(400).json({
      error_code: "INVALID_DATA",
      error_description:
        "Os endereços de origem e destino não podem ser os mesmos!",
    })
    return
  }

  try {
    const response = await axios.post(
      "https://routes.googleapis.com/directions/v2:computeRoutes",
      {
        origin: { address: origin },
        destination: { address: destination },
        travelMode: "DRIVE",
      },
      {
        headers: {
          "Content-Type": "application/json",
          "X-Goog-Api-Key": process.env.GOOGLE_API_KEY,
          "X-Goog-FieldMask":
            "routes.distanceMeters,routes.duration,routes.polyline",
        },
      },
    )

    const { routes } = response.data

    if (!routes || routes.length === 0) {
      res.status(404).json({ error: "Nenhuma rota encontrada." })
      return
    }

    const route = routes[0]
    const distanceInKm = route.distanceMeters / 1000
    const duration = route.duration

    const availableDrivers = drivers
      .filter((driver) => distanceInKm >= driver.min_km)
      .map((driver) => ({
        id: driver.id,
        name: driver.name,
        description: driver.description,
        vehicle: driver.vehicle,
        review: driver.review,
        value: parseFloat((distanceInKm * driver.rate_per_km).toFixed(2)),
      }))
      .sort((a, b) => a.value - b.value)

    res.json({
      distance: parseFloat(distanceInKm.toFixed(2)),
      duration: duration,
      polyline: route.polyline.encodedPolyline,
      options: availableDrivers,
      routeResponse: response.data,
    })
  } catch (error) {
    if (error instanceof Error) {
      console.error("Erro ao chamar a API do Google:", error.message)
    } else {
      console.error("Erro desconhecido:", error)
    }
    res.status(500).json({ error: "Erro ao calcular a rota." })
  }
}
