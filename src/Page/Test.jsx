import { useLocation } from "react-router-dom";

const Header = () => {
  const location = useLocation();

  // Define different item lists based on the current route
  const menuItems = {
    "/": ["Home", "About", "Contact"],
    "/dashboard": ["Overview", "Stats", "Settings"],
    "/profile": ["Account", "Edit Profile", "Logout"],
  };

  // Get the current path items, defaulting to home items
  const items = menuItems[location.pathname] || ["Home", "About", "Contact"];

  return (
    <header className="bg-gray-800 text-white p-4">
      <nav>
        <ul className="flex space-x-4">
          {items.map((item, index) => (
            <li key={index} className="cursor-pointer">{item}</li>
          ))}
        </ul>
      </nav>
    </header>
  );
};

export default Header;
