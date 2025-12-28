import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "@redux/store";
import GeneralHelper from "@utils/general_helper";
import { Spinner } from "react-bootstrap";

const ProtectedRoute = () => {
    const { profile } = useSelector((state: RootState) => state.admin.masterdata.user);
    const { data } = useSelector((state: RootState) => state.admin.settings.menu);

    const menus = data?.data || [];
    const userRole = profile?.role;

    const location = useLocation();
    const currentPath = location.pathname;

    if (!profile || !userRole || menus.length === 0) {
        return <div className="text-center"><Spinner/></div>
    }

    const allowedRoles = GeneralHelper.findRolesByPath(menus, currentPath);

    if (!allowedRoles) return <Navigate to="/" replace />;
    if (!allowedRoles.includes(userRole)) return <Navigate to="/" replace />;

    return <Outlet />;
};


export default ProtectedRoute;
