import { Link } from "react-router-dom";

const Navbar = () => {
    return (
        <div>
            <Link to="/">Weather</Link>
            <Link to="/settings">Settings</Link>
        </div>
    );
};

export default Navbar;
