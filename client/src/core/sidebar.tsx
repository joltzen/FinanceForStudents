/* Copyright (c) 2026, Jason Oltzen */

import React, { createContext, useState } from "react";
import { SidebarContextType } from "../types/models";

export const SidebarContext = createContext<SidebarContextType>({
  isSidebarOpen: false,
  setSidebarOpen: () => {},
});

export const SidebarProvider = ({ children }: { children: React.ReactNode }) => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  return (
    <SidebarContext.Provider value={{ isSidebarOpen, setSidebarOpen }}>
      {children}
    </SidebarContext.Provider>
  );
};
