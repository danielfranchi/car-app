import { Request, Response } from "express"
import Trip from "../models/tripModel"
import { drivers } from "../models/driverModel"

const isValidDriverId = (driverId: string): boolean => {
  return drivers.some((driver) => driver.id === parseInt(driverId, 10))
}

export const getRideHistory = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { customer_id } = req.params
  const { driver_id } = req.query

  if (!customer_id) {
    res.status(400).json({
      error_code: "INVALID_CUSTOMER_ID",
      error_description: "O ID do usuário não pode estar em branco.",
    })
    return
  }

  if (driver_id) {
    const isValid = isValidDriverId(driver_id as string)
    if (!isValid) {
      res.status(400).json({
        error_code: "INVALID_DRIVER",
        error_description: "ID do motorista é inválido.",
      })
      return
    }
  }

  try {
    const query: any = { customer_id }
    if (driver_id) {
      query["driver.id"] = parseInt(driver_id as string, 10)
    }

    const rides = await Trip.find(query).sort({ date: -1 })

    if (rides.length === 0) {
      res.status(404).json({
        error_code: "NO_RIDES_FOUND",
        error_description: "Nenhum registro encontrado",
      })
      return
    }

    res.status(200).json({
      customer_id,
      rides,
    })
  } catch (error) {
    if (error instanceof Error) {
      console.error("Erro ao buscar histórico de viagens:", error.message)
    } else {
      console.error("Erro desconhecido:", error)
    }
    res.status(500).json({
      error_code: "INTERNAL_SERVER_ERROR",
      error_description: "Erro ao buscar histórico de viagens.",
    })
  }
}
