import React, { useReducer } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Settings from "./components/Settings";
import Weather from "./components/Weather";

export const StateContext = React.createContext();

const initialState = { temperatureUnit: "c", currentLocation: null, savedLocations: [] };

function reducer(state, action) {
    switch (action.type) {
        // temperature units
        case "c":
            return { ...state, temperatureUnit: "c" };
        case "f":
            return { ...state, temperatureUnit: "f" };
        case "k":
            return { ...state, temperatureUnit: "k" };
        // change current location
        case "setLocation":
            return { ...state, currentLocation: action.payload };
        // saved locations
        case "saveLocation":
            // check if it is already saved
            if (state.savedLocations.some((location) => location === action.payload)) return state;

            return { ...state, savedLocations: [...state.savedLocations, action.payload] };
        case "removeLocation":
            return { ...state, savedLocations: state.savedLocations.filter((location) => location !== action.payload) };
        default:
            throw new Error();
    }
}

function App() {
    const [state, dispatch] = useReducer(reducer, initialState);

    return (
        <StateContext.Provider value={[state, dispatch]}>
            <div className="App">
                <Router>
                    <Switch>
                        <Route path="/" exact>
                            <Weather />
                        </Route>
                        <Route path="/settings">
                            <Settings />
                        </Route>
                    </Switch>
                    <Navbar />
                </Router>
            </div>
        </StateContext.Provider>
    );
}

export default App;
