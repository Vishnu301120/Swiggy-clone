import { useState } from "react";
import "./LoginDrawer.css";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-toastify";

function LoginDrawer({ isOpen, closeDrawer }) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [step, setStep] = useState("input"); // 'input' | 'otp'
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [sentOtp, setSentOtp] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const { sendPhoneOtp, verifyPhoneOtp, loginAsDemo, loading } = useAuth();

  if (!isOpen) return null;

  const resetForm = () => {
    setStep("input");
    setPhone("");
    setName("");
    setEmail("");
    setOtp("");
    setSentOtp("");
    setErrorMsg("");
  };

  const handleClose = () => {
    resetForm();
    closeDrawer();
  };

  // Step 1: Send OTP to Phone number
  const handleSendOtp = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    const cleanPhone = phone.replace(/\D/g, "").slice(-10);
    if (cleanPhone.length !== 10) {
      setErrorMsg("Please enter a valid 10-digit mobile number.");
      return;
    }

    if (isSignUp && !name.trim()) {
      setErrorMsg("Please enter your name to create an account.");
      return;
    }

    const res = await sendPhoneOtp(cleanPhone, !isSignUp);
    if (res.success) {
      setSentOtp(res.otp);
      setStep("otp");
      toast.info(`📲 SMS OTP: ${res.otp}`, { autoClose: 7000 });
    } else {
      setErrorMsg(res.message || "Failed to send OTP. Please try again.");
    }
  };

  // Step 2: Verify OTP and log in
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    if (!otp.trim()) {
      setErrorMsg("Please enter the 6-digit OTP sent to your phone.");
      return;
    }

    const cleanPhone = phone.replace(/\D/g, "").slice(-10);
    const res = await verifyPhoneOtp({
      phone: cleanPhone,
      otp: otp.trim(),
      name: name.trim(),
      email: email.trim(),
    });

    if (res.success) {
      toast.success(`Welcome back, ${res.data.name}! 🍔`);
      handleClose();
    } else {
      setErrorMsg(res.message || "Invalid OTP. Please check and try again.");
    }
  };

  // 1-Click Demo Login
  const handleDemoLogin = async () => {
    setErrorMsg("");
    const res = await loginAsDemo();
    if (res.success) {
      toast.success("Logged in with Demo Account! 🚀");
      handleClose();
    } else {
      setErrorMsg(res.message);
    }
  };

  return (
    <>
      <div className="swiggyDrawerOverlay" onClick={handleClose}></div>

      <div className="swiggyDrawer open">
        {/* Top Close Button */}
        <div className="drawerTopClose">
          <button className="swiggyCloseIconBtn" onClick={handleClose} aria-label="Close">
            ✕
          </button>
        </div>

        <div className="swiggyDrawerBody">
          {/* Header Row: Title on Left, Illustration on Right */}
          <div className="swiggyTitleRow">
            <div className="titleCol">
              <h1 className="mainHeading">
                {step === "otp" ? "Verify OTP" : isSignUp ? "Sign up" : "Login"}
              </h1>
              <div className="subHeading">
                {step === "otp" ? (
                  <span>
                    Sent to +91 {phone}{" "}
                    <button
                      type="button"
                      className="editPhoneLink"
                      onClick={() => setStep("input")}
                    >
                      Edit
                    </button>
                  </span>
                ) : isSignUp ? (
                  <span>
                    or{" "}
                    <button
                      type="button"
                      className="switchOrangeLink"
                      onClick={() => {
                        setIsSignUp(false);
                        setErrorMsg("");
                      }}
                    >
                      login to your account
                    </button>
                  </span>
                ) : (
                  <span>
                    or{" "}
                    <button
                      type="button"
                      className="switchOrangeLink"
                      onClick={() => {
                        setIsSignUp(true);
                        setErrorMsg("");
                      }}
                    >
                      create an account
                    </button>
                  </span>
                )}
              </div>
              <div className="titleUnderline"></div>
            </div>

            {/* Top Right Wrap / Roll Illustration */}
            <div className="illustrationCol">
              <div className="foodIconCircle">
                <img src="/images/shawarma.png" alt="Swiggy Food" className="wrapGraphic" />
              </div>
            </div>
          </div>

          {/* Error Message Banner */}
          {errorMsg && <div className="swiggyErrorMsg">{errorMsg}</div>}

          {/* OTP Helper Banner with Auto-fill */}
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

          {/* Form */}
          {step === "input" ? (
            <form onSubmit={handleSendOtp} className="swiggyAuthForm">
              <div className="swiggyInputBox">
                <input
                  type="tel"
                  placeholder="Phone number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  maxLength={10}
                  className="cleanInput"
                  autoFocus
                  required
                />
              </div>

              {isSignUp && (
                <>
                  <div className="swiggyInputBox">
                    <input
                      type="text"
                      placeholder="Name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="cleanInput"
                      required
                    />
                  </div>

                  <div className="swiggyInputBox">
                    <input
                      type="email"
                      placeholder="Email (Optional)"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="cleanInput"
                    />
                  </div>
                </>
              )}

              <button type="submit" className="swiggyOrangeSubmitBtn" disabled={loading}>
                {loading ? "SENDING OTP..." : isSignUp ? "CONTINUE" : "LOGIN"}
              </button>

              <p className="swiggyTermsText">
                By clicking on {isSignUp ? "Continue" : "Login"}, I accept the{" "}
                <strong>Terms & Conditions</strong> & <strong>Privacy Policy</strong>
              </p>

              {/* 1-Click Demo Login option */}
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
          ) : (
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
                {loading ? "VERIFYING..." : "VERIFY OTP"}
              </button>

              <div className="resendOtpRow">
                <span>Didn't receive OTP?</span>
                <button
                  type="button"
                  className="resendOtpBtn"
                  onClick={() => handleSendOtp({ preventDefault: () => {} })}
                >
                  Resend OTP
                </button>
              </div>

              <p className="swiggyTermsText">
                By clicking on Verify OTP, I accept the <strong>Terms & Conditions</strong> &{" "}
                <strong>Privacy Policy</strong>
              </p>
            </form>
          )}
        </div>
      </div>
    </>
  );
}

export default LoginDrawer;