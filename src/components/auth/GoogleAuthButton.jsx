import { useGlobalContext } from "@/context/GlobalContext";
import { useGoogleLogin } from "@react-oauth/google";
import { Button } from "../ui/button";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function GoogleAuthButton({ type, redirect = "" }) {
  const { API } = useGlobalContext();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    console.log(redirect);
  }, [redirect]);

  const registerWithGoogle = async (response) => {
    setLoading(true);
    try {
      if (response["code"]) {
        const res = await fetch(`${API}/auth/register/google`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ code: response["code"] }),
        });
        const data = await res.json();
        if (res.status != 201) {
          toast.error(data.message);
          return;
        } else {
          toast.success("Welcome to WorkPilot!");
          sessionStorage.setItem("accessToken", JSON.stringify(data.token));
          navigate(
            redirect == ""
              ? "/workshop/" + data.user.currentWorkshop
              : "/" + redirect
          );
        }
      } else {
        toast.error("Something went wrong");
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };
  const loginWithGoogle = async (response) => {
    setLoading(true);

    try {
      if (response["code"]) {
        const res = await fetch(`${API}/auth/login/google`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ code: response["code"] }),
        });
        const data = await res.json();
        if (res.status != 200) {
          toast.error(data.message || "Something went wrong");
          return;
        } else {
          toast.success(data.message);
          sessionStorage.setItem("accessToken", JSON.stringify(data.token));

          navigate(
            redirect == ""
              ? "/workshop/" + data.user.currentWorkshop
              : "/" + redirect
          );
        }
      } else {
        toast.error("Something went wrong");
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
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
      disabled={loading}
    >
      {!loading && (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="48"
          height="48"
          viewBox="0 0 48 48"
          fill="black"
        >
          <path d="M44.5 20H24v8.5h11.8C34 34.3 29.5 38 24 38c-7.2 0-13-5.8-13-13s5.8-13 13-13c3.2 0 6.1 1.2 8.3 3.2l6.3-6.3C34.8 5.1 29.7 3 24 3 12.3 3 3 12.3 3 24s9.3 21 21 21c10.6 0 20.1-7.5 20.1-21 0-1-.1-2-.2-3Z" />
        </svg>
      )}
      {type == "login" ? (
        loading ? (
          <Loader />
        ) : (
          "Login with Google"
        )
      ) : loading ? (
        <Loader />
      ) : (
        "Sign up with Google"
      )}{" "}
    </Button>
  );
}

const Loader = () => {
  return (
    <div role="status">
      <svg
        aria-hidden="true"
        class="inline w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-gray-600 dark:fill-gray-300"
        viewBox="0 0 100 101"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
          fill="currentColor"
        />
        <path
          d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
          fill="currentFill"
        />
      </svg>
      <span class="sr-only">Loading...</span>
    </div>
  );
};
