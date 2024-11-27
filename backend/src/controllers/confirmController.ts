import { Request, Response } from "express"
import { drivers } from "../models/driverModel"
import Trip from "../models/tripModel"

export const confirmRide = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const {
    customer_id,
    origin,
    destination,
    distance,
    duration,
    driver,
    value,
  } = req.body

  if (
    !customer_id ||
    !origin ||
    !destination ||
    !distance ||
    !duration ||
    !driver ||
    !value
  ) {
    res.status(400).json({
      error_code: "INVALID_DATA",
      error_description: "Todos os campos são obrigatórios.",
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
    let selectedDriver = drivers.find((d) => d.name === driver.name)

    if (!selectedDriver) {
      res.status(404).json({
        error_code: "DRIVER_NOT_FOUND",
        error_description: "Motorista não encontrado.",
      })
      return
    }

    if (distance < selectedDriver.min_km) {
      res.status(406).json({
        error_code: "INVALID_DISTANCE",
        error_description:
          "Quilometragem inválida para o motorista selecionado.",
      })
      return
    }

    const newTrip = new Trip({
      customer_id,
      origin,
      destination,
      distance,
      duration,
      driver: {
        id: selectedDriver.id,
        name: selectedDriver.name,
      },
      value,
    })

    await newTrip.save()

    res.status(200).json({ success: true })
  } catch (error) {
    if (error instanceof Error) {
      console.error("Erro ao confirmar a viagem:", error.message)
    } else {
      console.error("Erro desconhecido:", error)
    }

    res.status(500).json({ error: "Erro ao confirmar a viagem." })
  }
}
