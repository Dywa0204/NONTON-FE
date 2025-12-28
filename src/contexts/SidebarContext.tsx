import React, { ReactNode, createContext, useState } from "react";

import { SIDEBAR_POSITION, SIDEBAR_BEHAVIOR } from "../constants";

interface SidebarContextType {
  isOpen: boolean;
  position: string;
  behavior: string;
  setIsOpen: (behavior: boolean) => void;
  setPosition: (position: string) => void;
  setBehavior: (behavior: string) => void;
}

const initialState = {
  isOpen: true,
  position: SIDEBAR_POSITION.LEFT,
  behavior: SIDEBAR_BEHAVIOR.STICKY,
  setIsOpen: (isOpen: boolean) => {},
  setPosition: (position: string) => {},
  setBehavior: (behavior: string) => {}
};

const SidebarContext = createContext<SidebarContextType>(initialState);

export const SidebarProvider = ({ children }: { children: ReactNode }) => {
  const [isOpen, setIsOpen] = useState(initialState.isOpen);
  const [position, setPosition] = useState(initialState.position);
  const [behavior, setBehavior] = useState(initialState.behavior);

  return (
        <SidebarContext.Provider value={{ isOpen, position, behavior, setIsOpen, setPosition, setBehavior }}>
          {children}
        </SidebarContext.Provider>
      );
}

export default SidebarContext;
