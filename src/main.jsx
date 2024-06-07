import ReactDOM from "react-dom/client";
import { ThemeProvider } from "./components/ThemeProvider.jsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import App from "./App.jsx";

import "./index.css";

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")).render(
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </QueryClientProvider>
);
