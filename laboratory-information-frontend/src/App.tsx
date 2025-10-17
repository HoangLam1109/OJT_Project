
import { AppRoutes } from "./routes/AppRoutes";
import { Toaster } from "sonner";

function App() {
  return (
    <>
      {/* Toaster sẽ hiển thị tất cả toast trong app */}
      <Toaster position="top-right" richColors />
      
      {/* Các route khác */}
      <AppRoutes />
    </>
  );
}

export default App;
