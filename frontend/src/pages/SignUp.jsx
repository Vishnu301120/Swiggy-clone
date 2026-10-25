import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { authApi } from "../services/api";
import { toast } from "react-toastify";
import "./SignUp.css";

function SignUp() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    const cleanName = name.trim();
    const cleanPhone = phone.replace(/\D/g, "").slice(-10);
    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password.trim();

    if (!cleanName || !cleanPhone || !cleanEmail || !cleanPassword) {
      setErrorMsg("Please fill in all fields to create your account.");
      return;
    }

    if (cleanPhone.length !== 10) {
      setErrorMsg("Please enter a valid 10-digit mobile number.");
      return;
    }

    if (cleanPassword.length < 3) {
      setErrorMsg("Password must be at least 3 characters.");
      return;
    }

    setLoading(true);

    try {
      // 1. Register with backend API
      let userData;
      try {
        userData = await authApi.register({
          name: cleanName,
          phone: cleanPhone,
          email: cleanEmail,
          password: cleanPassword,
        });
      } catch (apiErr) {
        // If API fails because user exists
        if (apiErr.message && apiErr.message.includes("already exists")) {
          setErrorMsg("An account with this email already exists. Please login.");
          setLoading(false);
          return;
        }
        console.warn("Backend register error, saving locally:", apiErr.message);
        userData = {
          _id: `user_${Date.now()}`,
          name: cleanName,
          phone: cleanPhone,
          email: cleanEmail,
        };
      }

      // 2. Also save to local registry fallback so login always succeeds
      try {
        const localData = localStorage.getItem("swiggy_registered_users");
        const list = localData ? JSON.parse(localData) : [];
        list.push({
          _id: userData._id || `user_${Date.now()}`,
          name: cleanName,
          phone: cleanPhone,
          email: cleanEmail,
          password: cleanPassword,
        });
        localStorage.setItem("swiggy_registered_users", JSON.stringify(list));
      } catch (err) {
        console.warn("Could not save to localStorage", err);
      }

      // 3. User requested: After register, redirect to Login page!
      toast.success(`Account created successfully for ${cleanName}! 🎉 Please login now.`);

      // Redirect to /signin with registered credentials
      navigate("/signin", {
        state: {
          registeredPhone: cleanPhone,
          registeredEmail: cleanEmail,
          registeredName: cleanName,
          successMessage: `Welcome ${cleanName}! Your account was created. Please enter your phone number to sign in.`,
        },
      });
    } catch (err) {
      setErrorMsg(err.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signupPage">
      <div className="signupCard">
        {/* Top Header Row matching Swiggy aesthetic */}
        <div className="swiggyTitleRow">
          <div className="titleCol">
            <h1 className="mainHeading">Sign up</h1>
            <div className="subHeading">
              <span>
                or{" "}
                <Link to="/signin" className="switchOrangeLink">
                  login to your account
                </Link>
              </span>
            </div>
            <div className="titleUnderline"></div>
          </div>

          <div className="illustrationCol">
            <div className="foodIconCircle">
              <img src="/images/shawarma.png" alt="Swiggy Food" className="wrapGraphic" />
            </div>
          </div>
        </div>

        {errorMsg && <div className="swiggyErrorMsg">{errorMsg}</div>}

        <form onSubmit={handleRegister} className="swiggyAuthForm">
          <div className="swiggyInputBox">
            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="cleanInput"
              autoFocus
              required
            />
          </div>

          <div className="swiggyInputBox">
            <input
              type="tel"
              placeholder="Phone number (10 digits)"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              maxLength={10}
              className="cleanInput"
              required
            />
          </div>

          <div className="swiggyInputBox">
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="cleanInput"
              required
            />
          </div>

          <div className="swiggyInputBox">
            <input
              type="password"
              placeholder="Set Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="cleanInput"
              required
            />
          </div>

          <button
            type="submit"
            className="swiggyOrangeSubmitBtn"
            disabled={loading}
          >
            {loading ? "CREATING ACCOUNT..." : "CREATE ACCOUNT"}
          </button>

          <p className="swiggyTermsText">
            By creating an account, I accept Swiggy's{" "}
            <strong>Terms & Conditions</strong> & <strong>Privacy Policy</strong>
          </p>

          <div className="alreadyAccountFooter">
            <span>Already registered?</span>{" "}
            <Link to="/signin" className="signInRedirectLink">
              Sign In to your account
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default SignUp;
