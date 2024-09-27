"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
// import getCopilot from '@/app/dataLoaders/copilot';
import initializeCoPilot from "@/app/dataLoaders/copilot"


type CopilotContextType = {
  copilotClient: ReturnType<typeof getCopilot> | null;
};

const CopilotContext = createContext<CopilotContextType>({
  copilotClient: null,
});

export const useCopilot = () => useContext(CopilotContext);

export const CopilotProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [copilotClient, setCopilotClient] = useState<ReturnType<typeof getCopilot> | null>(null);

//   useEffect(() => {
//     // const copilot = getCopilot({searchParams: ""}); // Initialize the copilot on the server (via singleton)
//     const copilot = initializeCoPilot({searchParams:""})
//     setCopilotClient(copilot); // Set it in the state
//   }, []);

  return (
    <CopilotContext.Provider value={{ copilotClient }}>
      {children}
    </CopilotContext.Provider>
  );
};
