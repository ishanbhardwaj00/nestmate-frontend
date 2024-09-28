import { AuthContext } from "../contexts/authContext";
import axios from "axios";
import { useContext } from "react";
import { IoIosArrowBack } from "react-icons/io";
import { LuSettings2 } from "react-icons/lu";
import { useNavigate } from "react-router-dom";

const Header = ({ selected }: { selected: number }) => {
  const { setAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();
  return (
    <div className="flex h-20 py-2 px-4 bg-nav-light text-primary items-center justify-between">
      {/* <IoIosArrowBack size={36} /> */}
      <img
        onClick={() => {
          navigate("/");
        }}
        src="/images/logo-text.svg"
        alt=""
        className="image-filter h-10"
      />
      {selected === 1 && (
        <LuSettings2
          onClick={async () => {
            await axios.post(
              "http://localhost:5000/api/users/logout",
              {},
              { withCredentials: true }
            );
            setAuthenticated(false);
          }}
          size={28}
        />
      )}
    </div>
  );
};

export default Header;
