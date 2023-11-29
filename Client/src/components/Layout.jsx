import { Outlet } from "react-router-dom";
import Nav from "./Nav";

const Layout = ({ setShowPost, setShowAlbum }) => {
  return (
    <div>
      <Nav setShowPost={setShowPost} setShowAlbum={setShowAlbum} />
      <Outlet />
    </div>
  );
};

export default Layout;
