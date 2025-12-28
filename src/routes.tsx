import { lazy } from "@loadable/component";

const AuthLayout = lazy(() => import("./layouts/Auth"));
import Admin from "@layouts/Admin";

const routes = [
  { 
    path: "*", 
    element: <Admin />,
  },
];

export default routes;
