import React, { useState, useEffect, useRef } from "react";
import {
  withGoogleMap,
  withScriptjs,
  GoogleMap,
  Marker,
  InfoWindow,
  DirectionsRenderer,
} from "react-google-maps";
import { FaTimes, FaLocationArrow } from "react-icons/fa";
import { useStateContext } from "../contexts/ContextProvider";
import parkData from "../data/skateboard-parks.json";
import { Autocomplete } from "@react-google-maps/api";

import { mapStyles } from "../mapStyles";

function Map() {
  const { searchBox, setSearhBox, currentColor } = useStateContext();
  const [selectedPark, setSelectedPark] = useState(null);

  const [directionsResponse, setDirectionsResponse] = useState(null);
  const [distance, setDistance] = useState("");
  const [duration, setDuration] = useState("");
  const [error, setError] = useState(undefined);
  const [loading, setLoading] = useState(false);

  const originRef = useRef();
  const destinationRef = useRef();

  async function calculateRoute() {
    try {
      setError(false);
      if (
        originRef.current.value === "" ||
        destinationRef.current.value === ""
      ) {
        return;
      }
      const directionsService = new window.google.maps.DirectionsService();
      const results = await directionsService.route({
        origin: originRef.current.value,
        destination: destinationRef.current.value,
        travelMode: window.google.maps.TravelMode.DRIVING,
      });
      setDirectionsResponse(results);
      setLoading(true);
      setDistance(results.routes[0].legs[0].distance.text);
      setDuration(results.routes[0].legs[0].duration.text);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
      setSearhBox(!searchBox);
    }
  }

  function clearRoute() {
    setDirectionsResponse(null);
    setDistance("");
    setDuration("");
    originRef.current.value = "";
    destinationRef.current.value = "";
  }

  useEffect(() => {
    const listener = (e) => {
      if (e.key === "Escape") {
        setSelectedPark(null);
      }
    };
    window.addEventListener("keydown", listener);

    return () => {
      window.removeEventListener("keydown", listener);
    };
  }, []);

  return (
    <div>
      <GoogleMap
        defaultZoom={10}
        defaultCenter={{ lat: 45.4211, lng: -75.6903 }}
        defaultOptions={{ styles: mapStyles }}
      >
        {parkData.features.map((park) => (
          <Marker
            key={park.properties.PARK_ID}
            position={{
              lat: park.geometry.coordinates[1],
              lng: park.geometry.coordinates[0],
            }}
            onClick={() => {
              setSelectedPark(park);
            }}
            icon={{
              url: `../../church2.svg`,
              scaledSize: new window.google.maps.Size(25, 25),
            }}
          />
        ))}

        {selectedPark && (
          <InfoWindow
            onCloseClick={() => {
              setSelectedPark(null);
            }}
            position={{
              lat: selectedPark.geometry.coordinates[1],
              lng: selectedPark.geometry.coordinates[0],
            }}
          >
            <div>
              <h2>{selectedPark.properties.NAME}</h2>
              <p>{selectedPark.properties.DESCRIPTIO}</p>
            </div>
          </InfoWindow>
        )}
        {directionsResponse && (
          <DirectionsRenderer directions={directionsResponse} />
        )}
      </GoogleMap>

      {searchBox && (
        <div className="absolute right-0 md:right-4 mx-2 md:m-0 top-4 bg-light-gray dark:bg-main-dark-bg p-4 rounded-lg">
          <div className="flex gap-2 flex-wrap">
            <div>
              <Autocomplete>
                <input
                  type="text"
                  placeholder="Home"
                  ref={originRef}
                  className="outline-none border dark:bg-light-gray rounded-md p-2 text-slate-800"
                />
              </Autocomplete>
            </div>
            <div>
              <Autocomplete>
                <input
                  type="text"
                  placeholder="Loveworld branch"
                  ref={destinationRef}
                  className="outline-none border dark:bg-light-gray rounded-md p-2 text-slate-800"
                />
              </Autocomplete>
            </div>

            <div className="flex items-center gap-2 mb-4">
              <button
                type="submit"
                onClick={calculateRoute}
                style={{ backgroundColor: currentColor }}
                className="p-2 text-sm text-white rounded-lg"
              >
                Calculate Route
              </button>
              <span
                onClick={clearRoute}
                className="text-red-600 dark:text-red-400 border p-1 text-xs rounded-md cursor-pointer"
              >
                <FaTimes />
              </span>
            </div>
          </div>
          <div className="flex flex-wrap justify-between">
            {distance && duration ? (
              <>
                <p>Distance: {distance} </p>
                <p>Duration: {`${duration} By Car`} </p>
              </>
            ) : (
              ""
            )}
            <span
              style={{ backgroundColor: currentColor }}
              className="rounded-lg flex justify-center items-center w-10 h-10 cursor-pointer"
            >
              <FaLocationArrow className="text-white" />
            </span>
            <span>{loading && <div>Loading...</div>}</span>
          </div>
          {error && (
            <p className="text-red-500 text-xs mt-2">
              Could not calculate route. Please check if your inputs are
              correct.
            </p>
          )}
        </div>
      )}
    </div>
  );
}

const MapWrapped = withScriptjs(withGoogleMap(Map));

export default function App() {
  return (
    <div style={{ height: "100vh" }} className="relative">
      <MapWrapped
        googleMapURL={`https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places&key=${process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY}`}
        loadingElement={<div style={{ height: `100%` }} />}
        containerElement={<div style={{ height: `100%` }} />}
        mapElement={<div style={{ height: `100%` }} />}
      />
    </div>
  );
}
