import React, { ReactNode, createContext, useState } from "react";

import { LAYOUT } from "../constants";

interface LayoutContextType {
  layout: string;
  setLayout: (layout: string) => void;
}

const initialState = {
  layout: LAYOUT.FLUID,
  setLayout: (layout: string) => {}
};

const LayoutContext = createContext<LayoutContextType>(initialState);

export const LayoutProvider = ({ children }: { children: ReactNode }) => {
  const [layout, setLayout] = useState(initialState.layout);

  return (
        <LayoutContext.Provider value={{ layout, setLayout }}>
          {children}
        </LayoutContext.Provider>
      );
}

export default LayoutContext;
