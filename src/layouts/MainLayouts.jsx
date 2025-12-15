import { Outlet } from "react-router";
import Navbar from "../components/Navbar";

const MainLayouts = () => {
  return (
    <>
      <Navbar />
      <main>
        <Outlet />
      </main>
    </>
  );
};

export default MainLayouts;
