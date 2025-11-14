import { BrowserRouter } from "react-router-dom";
import { AppContent } from "@/routes/Route";

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}
