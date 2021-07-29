import { Link } from "react-router-dom";

const Navbar = () => {
    return (
        <div className="Navbar">
            <Link className="Navbar__link" to="/">Weather</Link>
            <Link className="Navbar__link" to="/settings">Settings</Link>
        </div>
    );
};

export default Navbar;
