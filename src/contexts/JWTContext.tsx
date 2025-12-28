// AuthContext.js or JWTContext.js
import { ReactNode, createContext, useState } from "react";

const AuthContext = createContext<any>(null);

export const AuthProvider = ({ children }: {children: ReactNode}) => {
  const [auth, setAuth] = useState(null);

  const resetPassword = (email: string) => {
    console.log("Reset password for:", email);
  };

  return (
    <AuthContext.Provider value={{ resetPassword }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
