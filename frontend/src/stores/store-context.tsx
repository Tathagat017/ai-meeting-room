import { createContext, ReactNode } from "react";
import { TaskStore } from "./task-store";
import { QueryClient } from "@tanstack/react-query";

const queryClient = new QueryClient();

// eslint-disable-next-line react-refresh/only-export-components
export const store = {
  taskStore: new TaskStore(queryClient),
  queryClient,
};

// eslint-disable-next-line react-refresh/only-export-components
export const StoreContext = createContext(store);

export const StoreProvider = ({ children }: { children: ReactNode }) => (
  <StoreContext.Provider value={store}>{children}</StoreContext.Provider>
);
