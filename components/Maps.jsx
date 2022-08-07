import React, {
  useState,
  useCallback,
  useEffect,
  useMemo,
  useRef,
} from "react";
import {
  GoogleMap,
  DirectionsRenderer,
  Autocomplete,
  Circle,
  MarkerF,
  InfoWindowF,
  useLoadScript,
} from "@react-google-maps/api";
import Geocode from "react-geocode";
import { useStateContext } from "../contexts/ContextProvider";
import { FaLocationArrow } from "react-icons/fa";

import {
  mapStyles,
  darkMapStyles,
  darkerMapStyles,
  lightMapStyles,
} from "../mapStyles";
import churchData from "../data/churches.json";

function Map() {
  const [libraries] = useState(["places"]);
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY,
    libraries,
  });

  Geocode.setApiKey(process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY);
  Geocode.setLanguage("en");
  Geocode.setLocationType("ROOFTOP");
  Geocode.enableDebug();

  // const [map, setMap] = useState(/** @type google.maps.Map */ (null));
  const mapRef = useRef();
  const [mapInstance, setMapInstance] = useState(null);
  // const center = { lat: 6.95, lng: 3.23333 };
  const center = useMemo(() => ({ lat: 6.379377, lng: 5.612128 }), []);
  // const center = useMemo(() => ({ lat: 45.421532, lng: -75.697189 }), []);

  const onLoad = useCallback(function callback(map) {
    mapRef.current = map;
    setMapInstance(map);
  }, []);

  const onUnmount = useCallback(function callback(map) {
    mapRef.current = null;
    setMapInstance(null);
  }, []);

  const { searchBox, setSearchBox, currentColor } = useStateContext();
  const [selectedChurch, setSelectedChurch] = useState(null);
  const [home, setHome] = useState("");
  const [address, setAddress] = useState("");

  const [directionsResponse, setDirectionsResponse] = useState(null);
  const [distance, setDistance] = useState("");
  const [duration, setDuration] = useState("");
  const [error, setError] = useState(undefined);
  const [loading, setLoading] = useState(false);

  const originRef = useRef();

  async function calculateRoute(church) {
    try {
      setError(false);
      if (originRef.current.value === "") {
        return;
      }
      const directionsService = new window.google.maps.DirectionsService();
      const results = await directionsService.route({
        origin: originRef.current.value,
        destination: church,
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
      // setSearchBox(!searchBox);
    }
  }

  function clearRoute() {
    setDirectionsResponse(null);
    setDistance("");
    setDuration("");
    originRef.current.value = "";
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

  const getGeoCode = useCallback(() => {
    Geocode.fromAddress(originRef?.current?.value).then(
      (response) => {
        const { lat, lng } = response.results[0].geometry.location;
        setHome({...home, lat, lng });
        // home && mapRef?.current?.panTo((home));
        home && mapInstance?.panTo(home);
      },
      (error) => {
        console.error(error);
      }
    );
  }, [home]);

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
        {home && (
          <>
            <MarkerF
              position={home}
              icon={{
                url: "../../home.svg",
                scaledSize: new window.google.maps.Size(25, 25),
              }}
            />

            {churchData.features.map((church) => (
              <MarkerF
                key={church.properties.CHURCH_ID}
                position={{
                  lat: church.geometry.coordinates[0],
                  lng: church.geometry.coordinates[1],
                }}
                onClick={() => {
                  const address = church.properties.ADDRESS;
                  const name = church.properties.NAME;
                  setAddress(name);
                  setSelectedChurch(church);
                  calculateRoute(address);
                }}
                icon={{
                  url: `../../church.svg`,
                  scaledSize: new window.google.maps.Size(25, 25),
                }}
              />
            ))}

            <Circle center={home} radius={15000} options={closeOptions} />
            <Circle center={home} radius={30000} options={middleOptions} />
            <Circle center={home} radius={45000} options={farOptions} />
          </>
        )}

        {selectedChurch && (
          <InfoWindowF
            onCloseClick={() => {
              setSelectedChurch(null);
            }}
            position={{
              lat: selectedChurch.geometry.coordinates[0],
              lng: selectedChurch.geometry.coordinates[1],
            }}
          >
            <div className="p-2">
              <h2 className="p-2 font-bold text-md">
                {selectedChurch.properties.NAME}
              </h2>
              <p>{selectedChurch.properties.ADDRESS}</p>
            </div>
          </InfoWindowF>
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
              <Autocomplete onPlaceChanged={() => getGeoCode()}>
                <input
                  type="text"
                  placeholder="Enter your address"
                  ref={originRef}
                  className="outline-none border dark:bg-light-gray rounded-md p-2 text-slate-800"
                />
              </Autocomplete>
            </div>

            <div className="flex items-center gap-2 mb-4">
              <span
                onClick={clearRoute}
                className="text-red-600 dark:text-red-400 border p-1 text-xs rounded-md cursor-pointer"
              >
                Clear
              </span>
              <span
                style={{ backgroundColor: currentColor }}
                className="rounded-lg flex justify-center items-center w-10 h-10 cursor-pointer"
                onClick={() => {
                  mapRef.current?.panTo(center);
                  mapRef.current?.setZoom(12);
                  setSearchBox(false);
                }}
              >
                <FaLocationArrow className="text-white" />
              </span>
              <span>{loading && <div>Loading...</div>}</span>
            </div>
          </div>
          <div className="flex flex-wrap justify-between">
            {distance && duration ? (
              <div className="flex flex-wrap gap-2 flex-col">
                <p className="text-sm text-slate-800 dark:text-gray-200">
                  The distance between{" "}
                  <strong className="text-[16px]">
                    {originRef?.current?.value}
                  </strong>{" "}
                  and{" "}
                  <strong className="text-[16px]">{address && address}</strong>{" "}
                  is: <strong className="text-[16px]">{distance}</strong>{" "}
                </p>
                <p className="text-sm text-slate-800 dark:text-gray-200">
                  Duration: {`${duration} By Car`}{" "}
                </p>
              </div>
            ) : (
              ""
            )}
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

const defaultOptions = {
  strokeOpacity: 0.5,
  strokeWeight: 2,
  clickable: false,
  draggable: false,
  editable: false,
  visible: true,
};

const closeOptions = {
  ...defaultOptions,
  zIndex: 3,
  fillOpacity: 0.05,
  strokeColor: "#8BC34A",
  fillColor: "#8BC34A",
};

const middleOptions = {
  ...defaultOptions,
  zIndex: 2,
  fillOpacity: 0.05,
  strokeColor: "#FBC02D",
  fillColor: "#FBC02D",
};

const farOptions = {
  ...defaultOptions,
  zIndex: 1,
  fillOpacity: 0.05,
  strokeColor: "#FF5252",
  fillColor: "#FF5252",
};
