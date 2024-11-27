import React, { useEffect, useState, useRef } from "react";
import { estimateRide } from "../api/postRideEstimate";
import { Driver } from "../interfaces/Driver";
import { EstimateRideResponse } from "../interfaces/EstimateRideResponse";
import { TextField, Box, Button } from "@mui/material";

interface FormProps {
  onDriversFetched: (
    drivers: Driver[],
    polylineData: string,
    origin: string,
    destination: string,
    distance: number,
    duration: string
  ) => void;
  resetMap: () => void;
  setCustomerId: React.Dispatch<React.SetStateAction<string>>;
}

const Form = ({ onDriversFetched, resetMap, setCustomerId }: FormProps) => {
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [userId, setUserId] = useState("");
  const [loading, setLoading] = useState(false);
  const [allowSearch, setAllowSearch] = useState(false);
  const [originSelected, setOriginSelected] = useState(false);
  const [destinationSelected, setDestinationSelected] = useState(false);
  const originRef = useRef<HTMLInputElement>(null);
  const destinationRef = useRef<HTMLInputElement>(null);

  const capitalizeFirstLetter = (text: string) =>
    text.charAt(0).toUpperCase() + text.slice(1);

  const fetchDrivers = async () => {
    setLoading(true);
    try {
      const data: EstimateRideResponse = await estimateRide(
        userId,
        origin,
        destination
      );
      onDriversFetched(
        data.options,
        data.polyline,
        origin,
        destination,
        data.distance,
        data.duration
      );
    } catch (error) {
      console.error("Erro na requisição:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!origin || !destination || !userId || !allowSearch) {
      console.error("Por favor, preencha todos os campos!");
      return;
    }
    setCustomerId(userId);
    fetchDrivers();
    setAllowSearch(false);
  };

  useEffect(() => {
    if (window.google) {
      const originInput = originRef.current;
      const destinationInput = destinationRef.current;
      if (originInput && destinationInput) {
        const originAutocomplete = new google.maps.places.Autocomplete(
          originInput
        );
        const destinationAutocomplete = new google.maps.places.Autocomplete(
          destinationInput
        );

        const handlePlaceSelect =
          (
            autocomplete: google.maps.places.Autocomplete,
            setState: React.Dispatch<React.SetStateAction<string>>,
            inputRef: React.RefObject<HTMLInputElement>,
            setSelected: React.Dispatch<React.SetStateAction<boolean>>
          ) =>
          () => {
            const place = autocomplete.getPlace();
            const address =
              place.formatted_address || inputRef.current?.value || "";
            setState(capitalizeFirstLetter(address));
            if (inputRef.current) {
              inputRef.current.value = capitalizeFirstLetter(address);
            }
            setSelected(true);
            setAllowSearch(true);
          };

        originAutocomplete.addListener(
          "place_changed",
          handlePlaceSelect(
            originAutocomplete,
            setOrigin,
            originRef,
            setOriginSelected
          )
        );
        destinationAutocomplete.addListener(
          "place_changed",
          handlePlaceSelect(
            destinationAutocomplete,
            setDestination,
            destinationRef,
            setDestinationSelected
          )
        );

        originInput.addEventListener("input", () => {
          setOrigin(originInput.value);
          setOriginSelected(false);
          if (
            originInput.value.trim().length < 3 ||
            !originInput.value.includes(",")
          ) {
            resetMap();
            setAllowSearch(false);
          }
        });

        destinationInput.addEventListener("input", () => {
          setDestination(destinationInput.value);
          setDestinationSelected(false);
          if (
            destinationInput.value.trim().length < 3 ||
            !destinationInput.value.includes(",")
          ) {
            resetMap();
            setAllowSearch(false);
          }
        });

        originInput.addEventListener("keydown", (e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            if (!originSelected && originInput.value.trim() !== "") {
              if (!originInput.value.includes(",")) {
                setOrigin("");
                originInput.value = "";
                resetMap();
              }
            } else if (originSelected) {
              originInput.blur();
            }
          }
        });

        destinationInput.addEventListener("keydown", (e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            if (!destinationSelected && destinationInput.value.trim() !== "") {
              if (!destinationInput.value.includes(",")) {
                setDestination("");
                destinationInput.value = "";
                resetMap();
              }
            } else if (destinationSelected) {
              destinationInput.blur();
            }
          }
        });

        originInput.addEventListener("blur", () => {
          if (!originSelected && originInput.value.trim() !== "") {
            if (!originInput.value.includes(",")) {
              setOrigin("");
              originInput.value = "";
              resetMap();
            }
          }
        });

        destinationInput.addEventListener("blur", () => {
          if (!destinationSelected && destinationInput.value.trim() !== "") {
            if (!destinationInput.value.includes(",")) {
              setDestination("");
              destinationInput.value = "";
              resetMap();
            }
          }
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [window.google]);

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 2,
        maxWidth: "400px",
        margin: "auto",
        padding: 3,
        border: "1px solid #ddd",
        borderRadius: "8px",
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
      }}
    >
      <TextField
        inputRef={originRef}
        id="origin"
        label="Origem"
        variant="outlined"
        value={origin}
        onChange={(e) => setOrigin(e.target.value)}
        fullWidth
      />
      <TextField
        inputRef={destinationRef}
        id="destination"
        label="Destino"
        variant="outlined"
        value={destination}
        onChange={(e) => setDestination(e.target.value)}
        fullWidth
      />
      <TextField
        label="ID de Usuário"
        variant="outlined"
        value={userId}
        onChange={(e) => setUserId(e.target.value)}
        fullWidth
      />
      <Button
        type="submit"
        variant="contained"
        disabled={!origin || !destination || !userId || !allowSearch}
        sx={{
          backgroundColor: "#07a776",
          "&:hover": {
            backgroundColor: "#06815a",
          },
        }}
        className="text-white"
      >
        {loading ? "Buscando..." : "Buscar Motoristas"}
      </Button>
    </Box>
  );
};

export default Form;
