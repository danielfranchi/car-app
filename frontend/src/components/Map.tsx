import { useEffect, useRef } from "react";

interface MapProps {
  origin: string;
  destination: string;
  polyline: string | null;
}

const loadScript = (url: string) => {
  return new Promise<void>((resolve, reject) => {
    const existingScript = document.querySelector(
      `script[src^="${url.split("?")[0]}"]`
    );
    if (existingScript) {
      resolve();
      return;
    }

    const script = document.createElement("script");
    script.src = url;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = (error) => {
      console.error("Erro ao carregar o script do Google Maps:", error);
      reject(new Error("Erro ao carregar o script do Google Maps"));
    };
    document.head.appendChild(script);
  });
};

const Map = ({ origin, destination, polyline }: MapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<google.maps.Marker[]>([]);
  const polylineInstance = useRef<google.maps.Polyline | null>(null);

  const initializeMap = () => {
    if (mapRef.current && window.google) {
      mapInstance.current = new google.maps.Map(mapRef.current, {
        center: { lat: -23.55052, lng: -46.633308 },
        zoom: 12,
      });
    }
  };

  useEffect(() => {
    const apiKey = process.env.GOOGLE_API_KEY;

    if (!apiKey) {
      console.error("Chave da API do Google Maps não encontrada.");
      return;
    }

    const cleanedApiKey = apiKey.replace(/['"]/g, "");

    const mapsUrl = `https://maps.googleapis.com/maps/api/js?key=${cleanedApiKey}&libraries=places,geometry`;

    loadScript(mapsUrl)
      .then(() => {
        if (!mapInstance.current) {
          initializeMap();
        }
      })
      .catch((error) => {
        console.error("Erro ao carregar o script do Google Maps:", error);
      });
  }, []);

  useEffect(() => {
    if (mapInstance.current && window.google) {
      const map = mapInstance.current;

      markersRef.current.forEach((marker) => marker.setMap(null));
      markersRef.current = [];
      if (polylineInstance.current) {
        polylineInstance.current.setMap(null);
      }

      if (origin && origin.trim() !== "") {
        const geocoder = new google.maps.Geocoder();
        geocoder.geocode({ address: origin }, (results, status) => {
          if (status === "OK" && results) {
            const originLatLng = results[0].geometry.location;
            const originMarker = new google.maps.Marker({
              position: originLatLng,
              map,
              title: "Origem",
            });
            markersRef.current.push(originMarker);
            map.setCenter(originLatLng);
          }
        });
      }

      if (destination && destination.trim() !== "") {
        const geocoder = new google.maps.Geocoder();
        geocoder.geocode({ address: destination }, (results, status) => {
          if (status === "OK" && results) {
            const destinationLatLng = results[0].geometry.location;
            const destinationMarker = new google.maps.Marker({
              position: destinationLatLng,
              map,
              title: "Destino",
            });
            markersRef.current.push(destinationMarker);
          }
        });
      }

      if (polyline) {
        try {
          const decodedPath =
            google.maps.geometry.encoding.decodePath(polyline);
          if (decodedPath.length > 0) {
            polylineInstance.current = new google.maps.Polyline({
              path: decodedPath,
              geodesic: true,
              strokeColor: "#FF0000",
              strokeOpacity: 1.0,
              strokeWeight: 2,
            });
            polylineInstance.current.setMap(map);
          }
        } catch (error) {
          console.error("Erro ao decodificar a polyline:", error);
        }
      }
    }
  }, [origin, destination, polyline]);

  return (
    <div
      ref={mapRef}
      style={{
        width: "100%",
        height: "400px",
        borderRadius: "8px",
        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
      }}
    ></div>
  );
};

export default Map;
