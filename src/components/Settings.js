import { useContext, useEffect } from "react";
import { StateContext } from "../App";
import DeleteIcon from "@material-ui/icons/Delete";
import { useHistory } from "react-router-dom";

const Settings = () => {
    useEffect(() => {
        document.title = "Settings";
    }, []);

    let history = useHistory();

    const [state, dispatch] = useContext(StateContext);

    const getWeather = (city) => {
        dispatch({ type: "setLocation", payload: city });
        history.push("/");
    };

    return (
        <div>
            <div>
                Temperature Unit:
                <select value={state.temperatureUnit} onChange={(e) => dispatch({ type: e.target.value })}>
                    <option value="c">Celsius</option>
                    <option value="f">Fahrenheit</option>
                    <option value="k">Kelvin</option>
                </select>
            </div>
            <div>
                <h2>Saved Locations</h2>
                {state.savedLocations.length > 0 ? (
                    state.savedLocations.map((location) => (
                        <div key={location}>
                            <a className="Settings__city-name" onClick={() => getWeather(location)}>
                                {location.split(",").join(", ")}
                            </a>
                            <button onClick={() => dispatch({ type: "removeLocation", payload: location })}>
                                <DeleteIcon />
                            </button>
                        </div>
                    ))
                ) : (
                    <p>Empty :c</p>
                )}
            </div>
        </div>
    );
};

export default Settings;
