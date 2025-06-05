import { Link } from "react-router-dom";

const Header = () => {
  return (
    <div className="masthead">
      <Link to="/">
        <h1 className="site-title">chord-transposer</h1>
      </Link>
    </div>
  );
};

export default Header;
