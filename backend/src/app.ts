import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import { connectDB } from "./config/database"
import { postRoutes } from "./routes/postRoutes"
import { patchRoutes } from "./routes/patchRoutes"
import { getRoutes } from "./routes/getRoutes"

dotenv.config()

export class App {
  private express: express.Application
  private porta = 8080
  private mongoUri = process.env.MONGO_URI

  constructor() {
    if (!this.mongoUri) {
      throw new Error("Nenhuma URI de MongoDB encontrada.")
    }
    console.log("URI de MongoDB:", this.mongoUri)
    this.express = express()
    this.database(this.mongoUri)
    this.listen()
    this.middlewares()
  }

  public getApp(): express.Application {
    return this.express
  }

  private middlewares() {
    this.express.use(
      cors({
        origin: ["http://localhost", "http://localhost:80"],
        methods: ["GET", "POST", "PATCH"],
        allowedHeaders: ["Content-Type", "Authorization"],
      }),
    )
    this.express.use(express.json())
    this.express.use("/ride", postRoutes)
    this.express.use("/ride", patchRoutes)
    this.express.use("/ride", getRoutes)
  }

  private listen() {
    this.express.listen(this.porta, () => {
      console.log(`Servidor rodando na porta ${this.porta}`)
    })
  }

  private database(uri: string) {
    connectDB(uri)
  }
}
