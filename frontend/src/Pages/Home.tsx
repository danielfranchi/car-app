import { useState } from "react";
import Header from "../components/Header";
import Form from "../components/Form";
import Map from "../components/Map";
import DriverCard from "../components/DriverCard";
import { Driver } from "../interfaces/Driver";

const Home = () => {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [polyline, setPolyline] = useState<string | null>(null);
  const [origin, setOrigin] = useState<string>("São Paulo, SP, Brasil");
  const [destination, setDestination] = useState<string>("");
  const [distance, setDistance] = useState<number | null>(null);
  const [duration, setDuration] = useState<string | null>(null);
  const [customerId, setCustomerId] = useState<string>("");

  const resetMap = () => {
    setPolyline(null);
    setDrivers([]);
    setOrigin("São Paulo, SP, Brasil");
    setDestination("");
    setDistance(null);
    setDuration(null);
    setCustomerId("");
  };

  const handleDriversResponse = (
    driversData: Driver[],
    polylineData: string,
    origin: string,
    destination: string,
    distance: number,
    duration: string
  ) => {
    setDrivers(driversData);
    setPolyline(polylineData);
    setOrigin(origin);
    setDestination(destination);
    setDistance(distance);
    setDuration(duration);
  };

  return (
    <div className="bg-gray min-h-screen flex flex-col">
      <Header />
      <main className="flex justify-center items-center gap-8 p-8 flex-wrap">
        <section className="flex-1 max-w-lg">
          <Form
            onDriversFetched={handleDriversResponse}
            resetMap={resetMap}
            setCustomerId={setCustomerId}
          />
        </section>
        <section className="flex-1 max-w-lg">
          <Map
            origin={origin}
            destination={destination}
            polyline={polyline || ""}
          />
        </section>
      </main>

      {drivers.length > 0 && (
        <section className="mt-8 flex justify-center gap-4 flex-wrap">
          {drivers.map((driver) => (
            <DriverCard
              key={driver.id}
              driver={driver}
              distance={distance}
              duration={duration}
              customer_id={customerId}
              origin={origin}
              destination={destination}
            />
          ))}
        </section>
      )}
    </div>
  );
};

export default Home;
