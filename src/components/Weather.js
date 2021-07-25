import { useContext, useEffect, useState } from "react";
import { StateContext } from "../App";
import SearchBar from "./SearchBar";

// material icons
import FavoriteIcon from "@material-ui/icons/Favorite";
import FavoriteBorderIcon from "@material-ui/icons/FavoriteBorder";
import CallMadeIcon from "@material-ui/icons/CallMade";

const API_KEY = "cc4ab46be8c995ffafc858ed7cd26383";

const Weather = ({ cities }) => {
    const [state, dispatch] = useContext(StateContext);
    const [locationWeather, setLocationWeather] = useState(null);
    const [isSaved, setIsSaved] = useState(null);
    const [statusText, setStatusText] = useState("");

    const fetchWeather = (data) => {
        setStatusText("Searching..");

        let url = "";

        // get temperature unit
        let temperatureUnit;
        switch (state.temperatureUnit) {
            case "c":
                temperatureUnit = "metric";
                break;
            case "f":
                temperatureUnit = "imperial";
                break;
            case "k":
                temperatureUnit = "standard";
                break;

            default:
                break;
        }

        // check type of location (coordinates or name) and set an url
        if (typeof data === "object") {
            url = `https://api.openweathermap.org/data/2.5/forecast?lat=${data.latitude}&lon=${data.longitude}&units=${temperatureUnit}&appid=${API_KEY}`;
        }
        if (typeof data === "string") {
            url = `https://api.openweathermap.org/data/2.5/forecast?q=${data}&units=${temperatureUnit}&APPID=${API_KEY}`;
        }

        // set location data
        fetch(url)
            .then((response) => {
                if (response.ok) {
                    return response.json();
                } else {
                    setStatusText("Location not found");
                }
            })
            .then((json) => setLocationWeather(json));
    };

    useEffect(() => {
        // change title
        document.title = "Weather";

        if (state.currentLocation) {
            return;
        }

        // get current location if user allowed and fetch weather
        function geoFindMe() {
            function success(position) {
                const latitude = position.coords.latitude;
                const longitude = position.coords.longitude;
                dispatch({ type: "setLocation", payload: { latitude, longitude } });
            }

            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(success);
            }
        }
        geoFindMe();
    }, []);

    useEffect(() => {
        // fetch weather on change location or on load
        if (state.currentLocation) {
            fetchWeather(state.currentLocation);
        }
    }, [state.currentLocation]);

    useEffect(() => {
        // dynamic title
        if (locationWeather) {
            let emoji;
            switch (locationWeather.list[0].weather[0].main) {
                case "Rain":
                    emoji = "🌧️";
                    break;
                case "Snow":
                    emoji = "❄️";
                    break;
                case "Thunderstorm":
                    emoji = "🌩️";
                    break;
                case "Drizzle":
                    emoji = "🌧️";
                    break;
                case "Clouds":
                    emoji = "☁️";
                    break;
                case "Clear":
                    // idk if this is a rigth emoji
                    emoji = "☀️";
                    break;
                default:
                    emoji = "";
                    break;
            }
            document.title = `${locationWeather.city.name} ${emoji} - Weather`;
        }

        // check if the location is already saved
        if (state?.savedLocations?.some((location) => location === `${locationWeather?.city?.name},${locationWeather?.city?.country}`)) {
            setIsSaved(true);
        } else {
            setIsSaved(false);
        }
    }, [locationWeather]);

    useEffect(() => {
        // check if the location is already saved
        if (state?.savedLocations?.some((location) => location === `${locationWeather?.city?.name},${locationWeather?.city?.country}`)) {
            setIsSaved(true);
        } else {
            setIsSaved(false);
        }
    }, [state]);

    const saveUnsaveLocation = () => {
        if (!isSaved) {
            dispatch({ type: "saveLocation", payload: `${locationWeather.city.name},${locationWeather.city.country}` });
        }
        if (isSaved) {
            dispatch({ type: "removeLocation", payload: `${locationWeather.city.name},${locationWeather.city.country}` });
        }
    };

    return (
        <div>
            <SearchBar cities={cities} />
            {locationWeather ? (
                <div>
                    <h2>
                        {locationWeather.city.name}, {locationWeather.city.country}
                    </h2>
                    <div>
                        {/* main weather */}
                        <p>{locationWeather.list[0].weather[0].description}</p>
                        <button onClick={() => saveUnsaveLocation()}>{isSaved ? <FavoriteIcon /> : <FavoriteBorderIcon />}</button>
                        <p>
                            {Math.round(locationWeather.list[0].main.temp)}°{state.temperatureUnit}
                        </p>
                        <p>Humidity: {locationWeather.list[0].main.humidity}%</p>
                        <p>
                            <CallMadeIcon
                                style={{
                                    transform: `rotate(${locationWeather.list[0].wind.deg - 45}deg)`,
                                }}
                            />
                            {locationWeather.list[0].wind.speed}
                            {state.temperatureUnit === "c" && "meter/sec"}
                            {state.temperatureUnit === "f" && "miles/hour"}
                            {state.temperatureUnit === "k" && "meter/sec"}
                        </p>

                        <p>{locationWeather.list[0]["dx_txt"]}</p>

                        <h3>
                            Sunrise: {new Date(locationWeather.city.sunrise * 1000).getHours()}:
                            {new Date(locationWeather.city.sunrise * 1000).getMinutes()}
                        </h3>
                        <h3>
                            Sunset: {new Date(locationWeather.city.sunset * 1000).getHours()}:
                            {new Date(locationWeather.city.sunset * 1000).getMinutes()}
                        </h3>
                    </div>

                    <div className="Weather__future-predictions">
                        {locationWeather &&
                            locationWeather.list.map((data) => {
                                // return on current weather
                                if (data === locationWeather.list[0]) return;
                                console.log(data.weather[0].main);
                                return (
                                    <div key={data["dt_txt"]}>
                                        {new Date(data["dt_txt"]).getHours() === 0 ? (
                                            <p>
                                                {new Date(data["dt_txt"]).getDate()}/{new Date(data["dt_txt"]).getMonth() + 1}
                                            </p>
                                        ) : (
                                            <p>{new Date(data["dt_txt"]).getHours()}:00</p>
                                        )}

                                        
                                        
                                        {data.weather[0].main === "Rain" && <p>Rain</p>}
                                        {data.weather[0].main === "Snow" && <p>Snow</p>}
                                        {data.weather[0].main === "Thunderstorm" && <p>Thunderstorm</p>}
                                        {data.weather[0].main === "Drizzle" && <p>Drizzle</p>}
                                        {data.weather[0].main === "Clouds" && <p>Clouds</p>}
                                        {data.weather[0].main === "Clear" && <p>Clear</p>}

                                        <p>
                                            {Math.round(data.main.temp)}°{state.temperatureUnit}
                                        </p>
                                        <p>
                                            <CallMadeIcon
                                                style={{
                                                    transform: `rotate(${data.wind.deg - 45}deg)`,
                                                }}
                                            />
                                            {data.wind.speed}
                                            {state.temperatureUnit === "c" && "meter/sec"}
                                            {state.temperatureUnit === "f" && "miles/hour"}
                                            {state.temperatureUnit === "k" && "meter/sec"}
                                        </p>
                                    </div>
                                );
                            })}
                    </div>
                </div>
            ) : (
                <p>{statusText}</p>
            )}
        </div>
    );
};

export default Weather;
