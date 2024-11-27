import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Header from "../components/Header";
import { fetchRides, fetchDrivers } from "../api/getRides";
import { Ride } from "../interfaces/Ride";
import { Driver } from "../interfaces/Driver";
import {
  Card,
  TextField,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
} from "@mui/material";
import { makeStyles } from "@mui/styles";

const useStyles = makeStyles({
  card: {
    width: "80%",
    margin: "0 auto",
    padding: "20px",
    marginTop: "50px",
  },
  formControl: {
    marginBottom: "20px !important",
  },
  table: {
    minWidth: 650,
  },
  inputContainer: {
    marginBottom: "30px",
    display: "flex",
    flexDirection: "column",
  },
  cell: {
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    maxWidth: "150px",
  },
});

const TripHistory = () => {
  const classes = useStyles();
  const { customer_id: initialCustomerId } = useParams<{
    customer_id: string;
  }>();
  const [customerId, setCustomerId] = useState(initialCustomerId || "");
  const [driverId, setDriverId] = useState("");
  const [rides, setRides] = useState<Ride[]>([]);
  const [drivers, setDrivers] = useState<Driver[]>([]);

  useEffect(() => {
    if (customerId) {
      getRides(customerId, driverId);
      getAllDrivers(customerId);
    }
  }, [customerId, driverId]);

  const getRides = async (customerId: string, driverId?: string) => {
    try {
      const data = await fetchRides(customerId, driverId);
      setRides(data.rides);
    } catch (error) {
      console.error(error);
    }
  };

  const getAllDrivers = async (customerId: string) => {
    try {
      const data = await fetchDrivers(customerId);
      const uniqueDrivers = Array.from(
        new Set<string>(
          data.rides.map((ride: Ride) => JSON.stringify(ride.driver))
        )
      ).map((driverString: string) => JSON.parse(driverString) as Driver);
      setDrivers(uniqueDrivers);
    } catch (error) {
      console.error(error);
    }
  };

  const formatDuration = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    return `${hrs}h ${mins}min`;
  };

  return (
    <div className="bg-gray min-h-screen p-8">
      <Header />
      <Card className={classes.card}>
        <Box className={classes.inputContainer}>
          <TextField
            className={classes.formControl}
            label="ID do Usuário"
            variant="outlined"
            fullWidth
            value={customerId}
            onChange={(e) => {
              setCustomerId(e.target.value);
              if (!e.target.value) {
                setRides([]);
                setDrivers([]);
              }
            }}
          />
          <TextField
            className={classes.formControl}
            label="Filtrar por Motorista"
            variant="outlined"
            fullWidth
            select
            value={driverId}
            onChange={(e) => {
              setDriverId(e.target.value as string);
            }}
          >
            <MenuItem value="">Mostrar Todos</MenuItem>
            {drivers.map((driver) => (
              <MenuItem key={driver.id} value={driver.id.toString()}>
                {driver.name}
              </MenuItem>
            ))}
          </TextField>
        </Box>

        {rides.length > 0 && (
          <TableContainer component={Paper}>
            <Table className={classes.table}>
              <TableHead>
                <TableRow>
                  <TableCell
                    style={{ color: "#F1F5F9" }}
                    className="bg-green-500 text-gray font-bold"
                  >
                    Data e Hora
                  </TableCell>
                  <TableCell
                    style={{ color: "#F1F5F9" }}
                    className="bg-green-500 text-gray font-bold"
                  >
                    Nome do Motorista
                  </TableCell>
                  <TableCell
                    style={{ color: "#F1F5F9" }}
                    className="bg-green-500 text-gray font-bold"
                  >
                    Origem
                  </TableCell>
                  <TableCell
                    style={{ color: "#F1F5F9" }}
                    className="bg-green-500 text-gray font-bold"
                  >
                    Destino
                  </TableCell>
                  <TableCell
                    style={{ color: "#F1F5F9" }}
                    className="bg-green-500 text-gray font-bold"
                  >
                    Distância
                  </TableCell>
                  <TableCell
                    style={{ color: "#F1F5F9" }}
                    className="bg-green-500 text-gray font-bold"
                  >
                    Tempo
                  </TableCell>
                  <TableCell
                    style={{ color: "#F1F5F9" }}
                    className="bg-green-500 text-gray font-bold"
                  >
                    Valor
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rides.map((ride) => (
                  <TableRow key={ride.id}>
                    <TableCell>
                      {new Date(ride.date)
                        .toLocaleString("pt-BR", {
                          dateStyle: "short",
                          timeStyle: "short",
                        })
                        .replace(",", "")}
                    </TableCell>
                    <TableCell>{ride.driver.name}</TableCell>
                    <TableCell className={classes.cell} title={ride.origin}>
                      {ride.origin}
                    </TableCell>
                    <TableCell
                      className={classes.cell}
                      title={ride.destination}
                    >
                      {ride.destination}
                    </TableCell>
                    <TableCell>{ride.distance} km</TableCell>
                    <TableCell>
                      {formatDuration(parseInt(ride.duration))}
                    </TableCell>
                    <TableCell>R$ {ride.value.toFixed(2)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Card>
    </div>
  );
};

export default TripHistory;
