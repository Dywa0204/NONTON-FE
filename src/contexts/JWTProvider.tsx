import { useEffect, useReducer } from "react";

import { isValidToken, setSession } from "@utils/jwt";

import AuthContext from "./JWTContext";
import { login } from "@api/auth/auth";

const INITIALIZE = "INITIALIZE";
const SIGN_IN = "SIGN_IN";
const SIGN_OUT = "SIGN_OUT";
const SIGN_UP = "SIGN_UP";

const initialState = {
  isAuthenticated: false,
  isInitialized: false,
  user: null,
};

const JWTReducer = (state: any, action: { type: any; payload: { isAuthenticated: any; user: any; }; }) => {
  switch (action.type) {
    case INITIALIZE:
      return {
        isAuthenticated: action.payload.isAuthenticated,
        isInitialized: true,
        user: action.payload.user,
      };
    case SIGN_IN:
      return {
        ...state,
        isAuthenticated: true,
        user: null
      };
    case SIGN_OUT:
      return {
        ...state,
        isAuthenticated: false,
        user: null,
      };

    case SIGN_UP:
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload.user,
      };

    default:
      return state;
  }
};

function AuthProvider({ children }: { children: any }) {
  const [state, dispatch] = useReducer(JWTReducer, initialState);

  useEffect(() => {
    const initialize = async () => {
      try {
        const accessToken = window.localStorage.getItem("accessToken");

        if (accessToken && isValidToken(accessToken)) {
          setSession(accessToken);

          dispatch({
            type: INITIALIZE,
            payload: {
              isAuthenticated: true,
              user: undefined
            },
          });
        } else {
          dispatch({
            type: INITIALIZE,
            payload: {
              isAuthenticated: false,
              user: null,
            },
          });
        }
      } catch (err) {
        console.error(err);
        dispatch({
          type: INITIALIZE,
          payload: {
            isAuthenticated: false,
            user: null,
          },
        });
      }
    };

    initialize();
  }, []);

  const signIn = async (email: any, password: any) => {
    const response = await login();
    const token = response.data.data.token;
    const user = response.data.data

    setSession(token);
    dispatch({
      type: SIGN_IN,
      payload: {
        user,
        isAuthenticated: undefined
      },
    });
  };

  const signOut = async () => {
    setSession("");
    dispatch({
      type: SIGN_OUT,
      payload: {
        isAuthenticated: undefined,
        user: undefined
      }
    });
  };

  const signUp = async (email: any, password: any, firstName: any, lastName: any) => {
    // const response = await axios.post("/api/auth/sign-up", {
    //   email,
    //   password,
    //   firstName,
    //   lastName,
    // });
    // const { accessToken, user } = response.data;

    // window.localStorage.setItem("accessToken", accessToken);
    // dispatch({
    //   type: SIGN_UP,
    //   payload: {
    //     user,
    //     isAuthenticated: undefined
    //   },
    // });
  };

  const resetPassword = (email: any) => console.log(email);

  return (
    <AuthContext.Provider
      value={{
        ...state,
        method: "jwt",
        signIn,
        signOut,
        signUp,
        resetPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;
