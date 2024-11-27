import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { confirmRide } from "../api/patchRideConfirm";
import { Driver } from "../interfaces/Driver";
import { Card, CardContent, Typography, Rating, Button } from "@mui/material";

interface DriverCardProps {
  driver: Driver;
  distance: number | null;
  duration: string | null;
  customer_id: string;
  origin: string;
  destination: string;
}

const formatDuration = (seconds: number) => {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  return `${hrs}h ${mins}min`;
};

const DriverCard = ({
  driver,
  distance,
  duration,
  customer_id,
  origin,
  destination,
}: DriverCardProps) => {
  const [showButtons, setShowButtons] = useState(false);
  const [choosing, setChoosing] = useState(false);
  const navigate = useNavigate();

  const handleChoose = async () => {
    setChoosing(true);
    try {
      const requestBody = {
        customer_id,
        origin,
        destination,
        distance,
        duration,
        driver: { id: driver.id, name: driver.name },
        value: driver.value ?? 0,
      };
      await confirmRide(requestBody);

      navigate(`/historico/${customer_id}`);
    } catch (error) {
      console.error("Erro ao confirmar a viagem:", error);
    } finally {
      setChoosing(false);
    }
  };

  const handleCancel = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setShowButtons(false);
  };

  return (
    <Card
      sx={{
        marginBottom: 2,
        display: "inline-block",
        width: "300px",
        marginRight: 2,
        padding: 2,
        boxShadow: 2,
      }}
      onClick={() => setShowButtons(true)}
    >
      <CardContent>
        <Typography variant="h6" sx={{ marginBottom: 1 }}>
          {driver.name}
        </Typography>
        <Typography variant="body2" sx={{ marginBottom: 1 }}>
          {driver.description || "Descrição não disponível"}
        </Typography>
        <Typography variant="body2" sx={{ marginBottom: 1 }}>
          <strong>Veículo:</strong> {driver.vehicle || "Veículo não disponível"}
        </Typography>
        <Rating
          value={driver.review?.rating ?? 0}
          readOnly
          sx={{ marginBottom: 1 }}
        />
        <Typography variant="body2" sx={{ marginBottom: 1 }}>
          {driver.review?.comment || "Comentário não disponível"}
        </Typography>
        <Card
          sx={{
            marginTop: 2,
            backgroundColor: "#f5f5f5",
            padding: 1,
            display: "inline-block",
            borderRadius: 1,
            width: "100%",
            textAlign: "center",
            boxShadow: 1,
          }}
        >
          <Typography variant="body2" sx={{ marginBottom: 1 }}>
            <strong>Distância:</strong> {distance} km
          </Typography>
          <Typography variant="body2" sx={{ marginBottom: 1 }}>
            <strong>Duração:</strong>{" "}
            {duration && formatDuration(parseInt(duration))}
          </Typography>
          <Typography variant="h6" sx={{ fontWeight: "bold" }}>
            R${driver.value ?? "Valor não disponível"}
          </Typography>
        </Card>
        {showButtons && !choosing && (
          <div>
            <Button
              variant="contained"
              onClick={handleChoose}
              sx={{
                marginTop: 2,
                marginRight: 1,
                backgroundColor: "#07a776",
                color: "white",
                "&:hover": {
                  backgroundColor: "#06815a",
                },
              }}
            >
              Escolher
            </Button>
            <Button
              variant="outlined"
              onClick={handleCancel}
              sx={{
                marginTop: 2,
                borderColor: "#07a776",
                color: "#07a776",
                "&:hover": {
                  borderColor: "#06815a",
                  color: "#06815a",
                },
              }}
            >
              Cancelar
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DriverCard;
