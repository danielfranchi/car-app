import { useLocation } from "react-router-dom";
import Button from "./Button";

const Header = () => {
  const location = useLocation();

  const isHistoricoPage = location.pathname.includes("/historico/");

  return (
    <header className="py-6 bg-gray-100">
      <div className="max-w-screen-xl mx-auto flex justify-between items-center">
        <div className="flex-1 text-center">
          <h1 className="text-5xl font-bold text-green-500">Shopper Car.</h1>
        </div>
        <nav className="flex space-x-6">
          {isHistoricoPage && (
            <Button
              onClick={() => (window.location.href = "/")}
              sx={{ width: "130px" }}
            >
              Home
            </Button>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
