import { useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";
import { useNavigate, Outlet } from "react-router";
import { authService } from "./Services/AuthService";
import { routePath } from "./Routes/routes";

export default function App() {
  const navigate = useNavigate();

  const [token, setToken] = useState<string | null>(null);


  useEffect(() => {
    const authToken = authService.getAuthToken();
    setToken(authToken);
    if (token) {
      navigate(routePath.home, { replace: true });
    }
  }, []);
  return (
    <>
      <Outlet />
      <Toaster position="top-right" />
    </>
  );


}
