import { Navbar, Nav } from "react-bootstrap";

import NavbarUser from "./NavbarUser";
import { RootState } from "@redux/store";
import { useDispatch, useSelector } from "react-redux";
import { setOpenSidebar } from "@redux/slices/utils/sidebar/sidebarSlice";

const NavbarComponent = () => {
  const dispatch = useDispatch()
  const isOpen = useSelector((state: RootState) => state.utils.sidebar.isOpen)

  return (
    <Navbar variant="light" expand className="navbar-bg">
      <span
        className="sidebar-toggle d-flex"
        onClick={() => {
          
          dispatch(setOpenSidebar(!isOpen));
        }}
      >
        <i className="hamburger align-self-center" />
      </span>

      <Navbar.Collapse>
        <Nav className="navbar-align">
          <NavbarUser />
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default NavbarComponent;
