import { useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";
import { useNavigate, Outlet } from "react-router";
import { authService } from "./Services/AuthService";
import { routePath } from "./Routes/routes";
import { useSelector } from "react-redux";
import type { RootState } from "./Redux/store";
import SignIn from "./Pages/Auth/SignIn";
import SignUp from "./Pages/Auth/SignUp";
import ForgetPassword from "./Pages/Auth/ForgetPassWord";
import ResetPassword from "./Pages/Auth/ResetPassword";
import OTPVerification from "./Pages/Auth/OTPPage";

export default function App() {
  const mode = useSelector((state: RootState) => state.auth.mode);
  const navigate = useNavigate();

  const [token, setToken] = useState<string | null>(null);


  useEffect(() => {
    const authToken = authService.getAuthToken();
    setToken(authToken);
    if (token) {
      navigate(routePath.home, { replace: true });
    }
  }, [token, navigate]);

  if (token) {

    return (
      <>
        <Outlet />
        <Toaster position="top-right" />
      </>
    );
  } else {
    return (
      <div className="h-screen w-full flex flex-col">
        <main>
          {mode === "login" && <SignIn />}
          {mode === "register" && <SignUp />}
          {mode === "OTPpage" && <OTPVerification />}
          {mode === "forgotPassword" && <ForgetPassword />}
          {mode === "resetPassword" && <ResetPassword />}

          <Toaster position="top-right" />
        </main>
      </div>
    );
  }


}
