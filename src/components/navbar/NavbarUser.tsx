
import { Badge, Dropdown } from "react-bootstrap";

import { User } from "react-feather";

import avatar1 from "@assets/img/avatars/avatar.jpg";
import { getSession, setSession } from "@utils/jwt";
import { Keycloak } from "@utils/keycloak";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@redux/store";
import { fetchUserProfile } from "@redux/slices/admin/masterdata/user/userSlice";

const NavbarUser = () => {
  const dispatch = useDispatch<AppDispatch>()

  const [user, setUser] = useState<any>()
  const { profile } = useSelector((state: RootState) => state.admin.masterdata.user)

  useEffect(() => {
    const getUser = async () => {
      const usr = getSession();
      setUser(usr)
    }
    
    loadUserData()
    getUser();
  }, [])

  const loadUserData = async () => {
    dispatch(fetchUserProfile())
  }

  const logout = () => {
    Keycloak.signOut()
    setSession("")
  }

  const componentId = "dropdown-toggle-new";

  return (
    <Dropdown className="nav-item" align="end">
      <Dropdown.Toggle as="div" className="d-flex align-items-center gap-3 cursor-pointer" data-component-id={componentId}>
        <div className="d-flex align-items-center gap-2">
          <img
            src={avatar1}
            className="avatar img-fluid rounded-circle me-1"
            alt={ user ? user.name : "-" }
          />
          <div>
            
            {
              profile 
                ? Keycloak.ADMIN_ROLES.includes(profile.role) 
                  ? <div>
                      <div>{ user ? user.name : "-" }</div>
                      <small>CoAss: { profile ? profile.coass ? profile.coass.name : "-" : "-" }</small> 
                    </div>
                  : <div>
                      <div>{ profile.coass ? profile.coass.name : user ? user.name : "-" }</div>
                      <small>NIM : {profile.coass ? profile.coass.nim : "-"}</small> 
                    </div>
                : null
            }
            
          </div>
        </div>
      </Dropdown.Toggle>
      <style>
        {
          `[data-component-id="${componentId}"]::after {
            border: none;
            padding: 0;
            margin-left: 0;
          }`
        }
      </style>

      <Dropdown.Menu align="end">
        <Dropdown.Item onClick={() => {
          console.log(getSession())
        }}>
          <User size={18} className="align-middle me-2" />
          Profil
        </Dropdown.Item>
        <Dropdown.Divider />
        <Dropdown.Item onClick={logout}>
          <Badge bg="danger" style={{fontSize: "1em"}} className="p-2 w-100">Sign out</Badge>
        </Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default NavbarUser;
