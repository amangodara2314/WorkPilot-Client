import { useGlobalContext } from "@/context/GlobalContext";
import { useGoogleLogin } from "@react-oauth/google";
import { Button } from "../ui/button";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

export default function GoogleAuthButton({ type }) {
  const { API } = useGlobalContext();
  const navigate = useNavigate();
  const registerWithGoogle = async (response) => {
    try {
      console.log(response, "response", response["code"]);
      if (response["code"]) {
        const res = await fetch(`${API}/auth/register/google`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ code: response["code"] }),
        });
        const data = await res.json();
        console.log(data);
        if (res.status != 201) {
          toast.error(data.message);
          return;
        } else {
          toast.success("Welcome " + data.user.name);
          sessionStorage.setItem("accessToken", JSON.stringify(data.token));
          navigate("/workshop/" + data.workshop._id);
        }
      } else {
        toast.error("Something went wrong");
      }
    } catch (error) {
      toast.error(error.message);
    }
  };
  const loginWithGoogle = async (response) => {
    try {
      console.log(response, "response", response["code"]);
      if (response["code"]) {
        const res = await fetch(`${API}/auth/login/google`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ code: response["code"] }),
        });
        const data = await res.json();
        console.log(data);
        if (res.status != 200) {
          toast.error(data.message || "Something went wrong");
          return;
        } else {
          toast.success(data.message);
          sessionStorage.setItem("accessToken", JSON.stringify(data.token));
          navigate("/workshop/" + data.user.currentWorkshop);
        }
      } else {
        toast.error("Something went wrong");
      }
    } catch (error) {
      toast.error(error.message);
    }
  };
  const googlePopup = useGoogleLogin({
    onSuccess: type == "register" ? registerWithGoogle : loginWithGoogle,
    onError: type == "register" ? registerWithGoogle : loginWithGoogle,
    flow: "auth-code",
  });

  return (
    <Button
      onClick={googlePopup}
      variant="outline"
      type="button"
      className="w-full"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="48"
        height="48"
        viewBox="0 0 48 48"
        fill="black"
      >
        <path d="M44.5 20H24v8.5h11.8C34 34.3 29.5 38 24 38c-7.2 0-13-5.8-13-13s5.8-13 13-13c3.2 0 6.1 1.2 8.3 3.2l6.3-6.3C34.8 5.1 29.7 3 24 3 12.3 3 3 12.3 3 24s9.3 21 21 21c10.6 0 20.1-7.5 20.1-21 0-1-.1-2-.2-3Z" />
      </svg>
      {type == "login" ? "Login" : "Sign up"} with Google
    </Button>
  );
}
