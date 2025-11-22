import { useEffect } from "react";
import { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router";
import { authService } from "./Services/AuthService";
import { routePath } from "./Routes/routes";
import { useSelector } from "react-redux";
import type { RootState } from "./Redux/store";
import SignIn from "./Pages/Auth/SignIn";
import SignUp from "./Pages/Auth/SignUp";
import ForgetPassword from "./Pages/Auth/ForgetPassWord";
import OTPVerification from "./Pages/Auth/OTPPage";
import ResetPassword from "./Pages/Auth/ResetPassword";

export default function App() {

  const mode = useSelector(((state: RootState) => state.auth.mode))
  const navigate = useNavigate();
  useEffect(() => {
    if (authService.getAuthToken()) {
      navigate(routePath.home, { replace: true });
    }
  }, [])
  return (
    <div className="h-screen w-full flex flex-col">
      <main>
        {mode === 'login' && <SignIn />}
        {mode === 'register' && <SignUp />}
        {mode === 'forgotPassword' && <ForgetPassword />}
        {mode === 'OTPpage' && <OTPVerification />}
        {mode === 'resetPassword' && <ResetPassword />}
        <Toaster position="top-right"
          reverseOrder={false} />
      </main>
    </div>
  );
}