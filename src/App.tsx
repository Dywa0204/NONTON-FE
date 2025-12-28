import { Suspense } from "react";
import { useRoutes } from "react-router-dom";
import { Provider } from "react-redux";
import { HelmetProvider, Helmet } from "react-helmet-async";
import { store } from "./redux/store";

import routes from "./routes";

import Loader from "./components/reusable/Loader";

import ThemeProvider from "./contexts/ThemeProvider";
import SidebarProvider from "./contexts/SidebarProvider";
import LayoutProvider from "./contexts/LayoutProvider";
import ChartJsDefaults from "./utils/chart_js_defaults";

import AuthProvider from "./contexts/JWTProvider";
import { ToastContainer } from "react-toastify";
import 'bootstrap-icons/font/bootstrap-icons.css';
import { APP_NAME } from "./constants";

// import AuthProvider from "./contexts/FirebaseAuthProvider";
// import AuthProvider from "./contexts/Auth0Provider";
// import AuthProvider from "./contexts/CognitoProvider";

const App = () => {
  const content = useRoutes(routes);

  return (
    <HelmetProvider>
      <Helmet
        titleTemplate={APP_NAME}
        defaultTitle={APP_NAME}
      />
      <Suspense fallback={<Loader />}>
        <Provider store={store}>
          <ThemeProvider>
            <SidebarProvider>
              <LayoutProvider>
                <ChartJsDefaults />
                {content}
                <ToastContainer />
              </LayoutProvider>
            </SidebarProvider>
          </ThemeProvider>
        </Provider>
      </Suspense>
    </HelmetProvider>
  );
};

export default App;
