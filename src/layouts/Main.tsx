import { RootState } from "@redux/store";
import { Keycloak } from "@utils/keycloak";
import { useSelector } from "react-redux";
import CoAssPage from "@pages/coass/CoAssPage";
import AdminDashboard from "@pages/admin/dashboard/AdminDashboard";

const Main = () => {
    const { profile } = useSelector((state: RootState) => state.admin.masterdata.user);

    const userRole = profile.role;

    return (
        Keycloak.COASS_ROLES.includes(userRole) 
            ? <CoAssPage/> : Keycloak.ADMIN_ROLES.includes(userRole) 
                ? <AdminDashboard /> : <div></div>
    )
}

export default Main