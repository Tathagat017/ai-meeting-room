import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MantineThemeProvider } from "./components/mantine-theme-provider";
import { StoreProvider } from "./stores/store-context";
import { Dashboard } from "./components/dashboard";
import { Notifications } from "@mantine/notifications";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <StoreProvider>
        <MantineThemeProvider>
          <Notifications position="bottom-right" zIndex={2077} />
          <Dashboard />
        </MantineThemeProvider>
      </StoreProvider>
    </QueryClientProvider>
  );
}

export default App;
