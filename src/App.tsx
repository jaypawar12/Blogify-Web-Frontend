import { useEffect } from "react";
import { Toaster } from "react-hot-toast";
import { useNavigate, Outlet } from "react-router";
import { authService } from "./Services/AuthService";
import { routePath } from "./Routes/routes";

export default function App() {
  const navigate = useNavigate();

  useEffect(() => {
    const authToken = authService.getAuthToken();
    if (authToken) {
      navigate(routePath.home, { replace: true });
    }
  }, [navigate]);
  return (
    <>
      <Outlet />
      <Toaster position="top-right" />
    </>
  );


}
