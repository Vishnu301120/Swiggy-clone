import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./SignIn.css";
import { toast } from "react-toastify";

function SignIn() {
  const location = useLocation();
  const [loginMethod, setLoginMethod] = useState("otp"); // 'otp' | 'password'
  const [step, setStep] = useState("input"); // 'input' | 'otp'
  const [phone, setPhone] = useState(location.state?.registeredPhone || "");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [sentOtp, setSentOtp] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [successBanner, setSuccessBanner] = useState(location.state?.successMessage || "");

  const { sendPhoneOtp, verifyPhoneOtp, login, loginAsDemo, loading } = useAuth();
  const navigate = useNavigate();

  const redirectPath = location.state?.from || "/";

  // Step 1: Send OTP with Database check
  const handleSendOtp = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    const cleanPhone = phone.replace(/\D/g, "").slice(-10);
    if (cleanPhone.length !== 10) {
      setErrorMsg("Please enter a valid 10-digit mobile number.");
      return;
    }

    // Call send-otp with isLogin = true to strictly validate user exists in DB
    const res = await sendPhoneOtp(cleanPhone, true);
    if (res.success) {
      setSentOtp(res.otp);
      setStep("otp");
      toast.info(`📲 SMS OTP: ${res.otp}`, { autoClose: 7000 });
    } else {
      setErrorMsg(res.message || "No account found in database! Please Sign Up first.");
    }
  };

  // Step 2: Verify OTP with Database check
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    if (!otp.trim()) {
      setErrorMsg("Please enter the 6-digit OTP.");
      return;
    }

    const cleanPhone = phone.replace(/\D/g, "").slice(-10);
    const res = await verifyPhoneOtp({
      phone: cleanPhone,
      otp: otp.trim(),
    });

    if (res.success) {
      toast.success(`Welcome back to Swiggy, ${res.data.name}! 🎉`);
      navigate(redirectPath);
    } else {
      setErrorMsg(res.message || "Invalid OTP or database verification failed.");
    }
  };

  // Password Login with Database check
  const handlePasswordLogin = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    const identifier = phone.trim();
    const cleanPassword = password.trim();

    if (!identifier) {
      setErrorMsg("Please enter your registered mobile number or email.");
      return;
    }

    if (!cleanPassword) {
      setErrorMsg("Please enter your password.");
      return;
    }

    // Direct Database authentication
    const res = await login(identifier, cleanPassword);
    if (res.success) {
      toast.success(`Welcome back to Swiggy, ${res.data.name}! 🎉`);
      navigate(redirectPath);
    } else {
      setErrorMsg(res.message || "Invalid email/phone or password in database.");
    }
  };

  const handleDemoLogin = async () => {
    setErrorMsg("");
    const res = await loginAsDemo();
    if (res.success) {
      toast.success("Logged in with Demo Account! 🚀");
      navigate(redirectPath);
    } else {
      setErrorMsg(res.message);
    }
  };

  return (
    <div className="signinPage">
      <div className="signinCard">
        {/* Top Header Row matching Swiggy aesthetic */}
        <div className="swiggyTitleRow">
          <div className="titleCol">
            <h1 className="mainHeading">
              {step === "otp" ? "Verify OTP" : "Login"}
            </h1>
            <div className="subHeading">
              {step === "otp" ? (
                <span>
                  Sent to +91 {phone}{" "}
                  <button
                    type="button"
                    className="editPhoneLink"
                    onClick={() => {
                      setStep("input");
                      setErrorMsg("");
                    }}
                  >
                    Edit
                  </button>
                </span>
              ) : (
                <span>
                  or{" "}
                  <Link to="/signup" className="switchOrangeLink">
                    create an account
                  </Link>
                </span>
              )}
            </div>
            <div className="titleUnderline"></div>
          </div>

          <div className="illustrationCol">
            <div className="foodIconCircle">
              <img src="/images/shawarma.png" alt="Swiggy Food" className="wrapGraphic" />
            </div>
          </div>
        </div>

        {/* Success Banner if redirected from registration */}
        {successBanner && (
          <div className="registrationSuccessBanner">
            <span className="successCheckIcon">✓</span>
            <span>{successBanner}</span>
          </div>
        )}

        {/* Database Validation Error Banner with Sign Up Action */}
        {errorMsg && (
          <div className="swiggyErrorMsg">
            <div>{errorMsg}</div>
            {errorMsg.toLowerCase().includes("sign up") && (
              <Link to="/signup" className="errorSignUpLink">
                Create new account (Sign Up) →
              </Link>
            )}
          </div>
        )}

        {/* OTP Demo Helper Banner */}
        {step === "otp" && sentOtp && (
          <div className="otpHelperBanner">
            <span>
              🔑 Demo SMS OTP: <strong>{sentOtp}</strong>
            </span>
            <button
              type="button"
              className="autofillOtpBtn"
              onClick={() => setOtp(sentOtp)}
            >
              Auto-fill
            </button>
          </div>
        )}

        {/* Login Method Tabs (Mobile OTP vs Password) when on input step */}
        {step === "input" && (
          <div className="loginMethodTabs">
            <button
              type="button"
              className={`loginMethodTab ${loginMethod === "otp" ? "active" : ""}`}
              onClick={() => {
                setLoginMethod("otp");
                setErrorMsg("");
              }}
            >
              📱 Mobile OTP
            </button>
            <button
              type="button"
              className={`loginMethodTab ${loginMethod === "password" ? "active" : ""}`}
              onClick={() => {
                setLoginMethod("password");
                setErrorMsg("");
              }}
            >
              🔑 Password
            </button>
          </div>
        )}

        {/* Forms */}
        {step === "input" && loginMethod === "otp" && (
          <form onSubmit={handleSendOtp} className="swiggyAuthForm">
            <div className="swiggyInputBox">
              <input
                type="tel"
                placeholder="Registered phone number"
                value={phone}
                onChange={(e) => {
                  setPhone(e.target.value);
                  setErrorMsg("");
                }}
                maxLength={10}
                className="cleanInput"
                autoFocus
                required
              />
            </div>

            <button type="submit" className="swiggyOrangeSubmitBtn" disabled={loading}>
              {loading ? "VALIDATING WITH DB..." : "LOGIN WITH OTP"}
            </button>

            <p className="swiggyTermsText">
              Validates your registered mobile number in database and sends OTP.
            </p>

            <div className="swiggyDemoOption">
              <button
                type="button"
                className="quickDemoLoginBtn"
                onClick={handleDemoLogin}
                disabled={loading}
              >
                ⚡ 1-Click Demo Login (+91 98765 43210)
              </button>
            </div>
          </form>
        )}

        {step === "input" && loginMethod === "password" && (
          <form onSubmit={handlePasswordLogin} className="swiggyAuthForm">
            <div className="swiggyInputBox">
              <input
                type="text"
                placeholder="Phone number or Email"
                value={phone}
                onChange={(e) => {
                  setPhone(e.target.value);
                  setErrorMsg("");
                }}
                className="cleanInput"
                autoFocus
                required
              />
            </div>

            <div className="swiggyInputBox">
              <input
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setErrorMsg("");
                }}
                className="cleanInput"
                required
              />
            </div>

            <button type="submit" className="swiggyOrangeSubmitBtn" disabled={loading}>
              {loading ? "CHECKING DATABASE..." : "LOGIN WITH PASSWORD"}
            </button>

            <p className="swiggyTermsText">
              Directly authenticates password against MongoDB user records.
            </p>

            <div className="swiggyDemoOption">
              <button
                type="button"
                className="quickDemoLoginBtn"
                onClick={handleDemoLogin}
                disabled={loading}
              >
                ⚡ 1-Click Demo Login (+91 98765 43210)
              </button>
            </div>
          </form>
        )}

        {step === "otp" && (
          <form onSubmit={handleVerifyOtp} className="swiggyAuthForm">
            <div className="swiggyInputBox">
              <input
                type="text"
                placeholder="Enter 6-digit OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                maxLength={6}
                className="cleanInput otpInput"
                autoFocus
                required
              />
            </div>

            <button type="submit" className="swiggyOrangeSubmitBtn" disabled={loading}>
              {loading ? "VERIFYING IN DB..." : "VERIFY OTP"}
            </button>

            <div className="resendOtpRow">
              <span>Didn't receive OTP?</span>
              <button
                type="button"
                className="resendOtpBtn"
                onClick={handleSendOtp}
              >
                Resend OTP
              </button>
            </div>

            <p className="swiggyTermsText">
              By clicking on Verify OTP, your credentials are confirmed in the database.
            </p>
          </form>
        )}
      </div>
    </div>
  );
}

export default SignIn;