import React, {
  useState,
  useCallback,
  useEffect,
  useMemo,
  useRef,
} from "react";
import {
  GoogleMap,
  useJsApiLoader,
  Marker,
  InfoWindow,
  DirectionsRenderer,
  Autocomplete,
  Circle,
  MarkerClusterer,
} from "@react-google-maps/api";
import { useStateContext } from "../contexts/ContextProvider";
import { FaTimes, FaLocationArrow } from "react-icons/fa";

import {
  mapStyles,
  darkMapStyles,
  darkerMapStyles,
  lightMapStyles,
} from "../mapStyles";
import churchData from "../data/churches.json";
import parkData from "../data/skateboard-parks.json";

function Map() {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY,
    libraries: ["places"],
  });

  const [map, setMap] = useState(/** @type google.maps.Map */ (null));
  // const center = useMemo(() => ({ lat: 6.95, lng: 3.23333 }), []);
  const center = useMemo(() => ({ lat: 45.421532, lng: -75.697189 }), []);

  const onLoad = useCallback(function callback(map) {
    setMap(map);
  }, []);

  const onUnmount = useCallback(function callback(map) {
    setMap(null);
  }, []);

  const { searchBox, setSearchBox, currentColor } = useStateContext();
  const [selectedChurch, setSelectedChurch] = useState(null);
  const [home, setHome] = useState(null);

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
      await setDirectionsResponse(results);
      setLoading(true);
      await setDistance(results.routes[0].legs[0].distance.text);
      await setDuration(results.routes[0].legs[0].duration.text);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
      setSearchBox(!searchBox);
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
        setSelectedChurch(null);
      }
    };
    window.addEventListener("keydown", listener);

    return () => {
      window.removeEventListener("keydown", listener);
    };
  }, []);

  return isLoaded ? (
    <div className="map relative">
      <GoogleMap
        center={center}
        zoom={10}
        onLoad={onLoad}
        onUnmount={onUnmount}
        mapContainerClassName="map-container"
        options={{
          clickableIcons: false,
          zoomControl: false,
          mapTypeControl: false,
          fullscreenControl: false,
          styles: mapStyles,
        }}
      >
        {
          <MarkerClusterer>
            {(clusterer) => {
              parkData.features.map((church) => (
                <Marker
                  key={church.properties.PARK_ID}
                  position={{
                    lat: church.geometry.coordinates[1],
                    lng: church.geometry.coordinates[0],
                  }}
                  clusterer={clusterer}
                  onClick={() => {
                    setSelectedChurch(church);
                  }}
                  icon={{
                    url: `../../church.svg`,
                    scaledSize: new window.google.maps.Size(25, 25),
                  }}
                />
              ));
            }}
          </MarkerClusterer>
        }
        {selectedChurch && (
          <InfoWindow
            onCloseClick={() => {
              setSelectedChurch(null);
            }}
            position={{
              lat: selectedChurch.geometry.coordinates[1],
              lng: selectedChurch.geometry.coordinates[0],
            }}
          >
            <div>
              <h2>{selectedChurch.properties.NAME}</h2>
              <p>{selectedChurch.properties.DESCRIPTIO}</p>
            </div>
          </InfoWindow>
        )}
        {directionsResponse && (
          <DirectionsRenderer
            directions={directionsResponse}
            options={{
              polylineOptions: {
                zIndex: 50,
                strokeColor: "#1976D2",
                strokeWeight: 5,
              },
            }}
          />
        )}
      </GoogleMap>

      {searchBox && (
        <div className="absolute right-0 md:right-4 mx-2 md:m-0 top-28 md:top-4 bg-light-gray dark:bg-main-dark-bg p-4 rounded-lg">
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
                Clear
              </span>
            </div>
          </div>
          <div className="flex flex-wrap justify-between">
            {distance && duration ? (
              <>
                <p className="text-sm text-slate-800 dark:text-gray-200">
                  Distance: {distance}{" "}
                </p>
                <p className="text-sm text-slate-800 dark:text-gray-200">
                  Duration: {`${duration} By Car`}{" "}
                </p>
              </>
            ) : (
              ""
            )}
            <span
              style={{ backgroundColor: currentColor }}
              className="rounded-lg flex justify-center items-center w-10 h-10 cursor-pointer"
              onClick={() => {
                map.panTo(center);
                map.setZoom(12);
                setSearchBox(false);
              }}
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
  ) : (
    <></>
  );
}

export default React.memo(Map);
