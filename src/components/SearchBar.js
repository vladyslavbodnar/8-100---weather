import { useContext, useState } from "react";
import { StateContext } from "../App";

const SearchBar = ({ cities }) => {
    const [inputValue, setInputValue] = useState("");
    const [citiesValue, setCitiesValue] = useState([]);

    const [, dispatch] = useContext(StateContext);

    const setLocation = (e) => {
        if (e.key === "Enter") {
            dispatch({ type: "setLocation", payload: e.target.value });
            setInputValue("");
            setCitiesValue([]);
        }
    };

    const changeInput = (e) => {
        setInputValue(e.target.value);

        if (e.target.value === "") {
            setCitiesValue([]);
            return;
        }

        const citiesValues = cities.filter((city) => city.name.startsWith(e.target.value));
        setCitiesValue(citiesValues);
    };

    return (
        <div>
            <input type="text" value={inputValue} onChange={(e) => changeInput(e)} onKeyDown={(e) => setLocation(e)} />
            {citiesValue.map((city, i) => (
                <h3 key={i} onClick={() => setLocation({ key: "Enter", target: { value: `${city.name},${city.countryCode}` } })}>
                    {city.name}, {city.countryCode}
                </h3>
            ))}
        </div>
    );
};

export default SearchBar;
