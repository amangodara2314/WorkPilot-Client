import { useGlobalContext } from "@/context/GlobalContext";
import { useGoogleLogin } from "@react-oauth/google";
import { Button } from "../ui/button";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

export default function GoogleAuthButton({ type }) {
  const { API } = useGlobalContext();
  const navigate = useNavigate();
  const responseGoogle = async (response) => {
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
        if (data.status != 201) {
          toast.error(data.message);
        } else {
          toast.success(data.message);
          navigate("/");
        }
      }
    } catch (error) {
      toast.error(error.message);
    }
  };
  const googlePopup = useGoogleLogin({
    onSuccess: responseGoogle,
    onError: responseGoogle,
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
      {type ? "Login" : "Sign up"} with Google
    </Button>
  );
}
