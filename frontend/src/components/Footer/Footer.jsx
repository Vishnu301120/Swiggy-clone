import { useState } from "react";
import "./Footer.css";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import {
  FaInstagram,
  FaFacebook,
  FaTwitter,
  FaLinkedin,
  FaPinterest,
  FaQrcode,
  FaMobileAlt,
  FaTimes,
  FaCheckCircle,
} from "react-icons/fa";

function Footer() {
  const [showQrModal, setShowQrModal] = useState(false);
  const [activeModal, setActiveModal] = useState(null); // 'about', 'terms', 'privacy', 'partner'

  const PLAY_STORE_URL =
    "https://play.google.com/store/apps/details?id=in.swiggy.android";
  const APP_STORE_URL =
    "https://apps.apple.com/in/app/swiggy-food-instamart-dineout/id989524771";

  const handlePlayStoreClick = () => {
    toast.info("Opening Google Play Store to download Swiggy... 📲", {
      autoClose: 2500,
    });
  };

  const handleAppStoreClick = () => {
    toast.info("Opening Apple App Store to download Swiggy... 🍎", {
      autoClose: 2500,
    });
  };

  return (
    <footer>
      {/* APP DOWNLOAD SECTION */}
      <div className="downloadSection">
        <div className="downloadText">
          <h2>For better experience, download the Swiggy app now</h2>
        </div>

        <div className="storeActionGroup">
          <div className="storeButtons">
            {/* Google Play Store Badge */}
            <a
              href={PLAY_STORE_URL}
              target="_blank"
              rel="noopener noreferrer"
              onClick={handlePlayStoreClick}
              className="storeBadgeLink"
              title="Download on Google Play Store"
            >
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg"
                alt="Get it on Google Play"
              />
            </a>

            {/* Apple App Store Badge */}
            <a
              href={APP_STORE_URL}
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleAppStoreClick}
              className="storeBadgeLink"
              title="Download on Apple App Store"
            >
              <img
                src="https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg"
                alt="Download on the App Store"
              />
            </a>
          </div>

          {/* QR Code Quick Scan Button */}
          <button
            type="button"
            className="qrCodeTriggerBtn"
            onClick={() => setShowQrModal(true)}
            title="Scan QR Code to download"
          >
            <FaQrcode className="qrIcon" /> Scan QR to Download
          </button>
        </div>
      </div>

      {/* FOOTER MAIN CONTENT */}
      <div className="footerContent">
        <div className="brandCol">
          <Link to="/" className="brandLink">
            <img
              className="footerLogo"
              src="https://upload.wikimedia.org/wikipedia/commons/1/13/Swiggy_logo.png"
              alt="Swiggy"
            />
            <h2>Swiggy</h2>
          </Link>
          <p className="copyrightText">© 2026 Swiggy Limited</p>
          <p className="tagline">Crafted with passion in Madurai & Bengaluru.</p>
        </div>

        <div>
          <h3>Company</h3>
          <p onClick={() => setActiveModal("about")}>About Us</p>
          <p onClick={() => setActiveModal("careers")}>Careers</p>
          <p onClick={() => setActiveModal("team")}>Team</p>
          <Link to="/offers" className="footerNavLink">
            Swiggy One
          </Link>
          <Link to="/offers" className="footerNavLink">
            Instamart Deals
          </Link>
        </div>

        <div>
          <h3>Contact Us</h3>
          <Link to="/help" className="footerNavLink">
            Help & Support
          </Link>
          <p onClick={() => setActiveModal("partner")}>Partner with us</p>
          <p onClick={() => setActiveModal("ride")}>Ride with us</p>
        </div>

        <div>
          <h3>Legal</h3>
          <p onClick={() => setActiveModal("terms")}>Terms & Conditions</p>
          <p onClick={() => setActiveModal("cookie")}>Cookie Policy</p>
          <p onClick={() => setActiveModal("privacy")}>Privacy Policy</p>
          <p onClick={() => setActiveModal("investor")}>Investor Relations</p>
        </div>

        <div>
          <h3>Social Links</h3>
          <div className="socialIcons">
            <a
              href="https://www.linkedin.com/company/swiggy-in/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="socialIconLink"
            >
              <FaLinkedin />
            </a>
            <a
              href="https://www.instagram.com/swiggyindia/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="socialIconLink"
            >
              <FaInstagram />
            </a>
            <a
              href="https://www.facebook.com/swiggy.in/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="socialIconLink"
            >
              <FaFacebook />
            </a>
            <a
              href="https://www.pinterest.com/swiggyindia/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Pinterest"
              className="socialIconLink"
            >
              <FaPinterest />
            </a>
            <a
              href="https://twitter.com/swiggy"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Twitter"
              className="socialIconLink"
            >
              <FaTwitter />
            </a>
          </div>
        </div>
      </div>

      {/* QR CODE MODAL */}
      {showQrModal && (
        <div className="footerModalOverlay" onClick={() => setShowQrModal(false)}>
          <div
            className="footerModalContent qrModal"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="closeModalBtn"
              onClick={() => setShowQrModal(false)}
            >
              <FaTimes />
            </button>
            <FaQrcode className="bigQrIcon" />
            <h3>Scan QR Code to Download</h3>
            <p>
              Point your smartphone camera at this QR code to download the official Swiggy mobile app.
            </p>
            <div className="qrMockContainer">
              <img
                src="https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=https://www.swiggy.com/app"
                alt="Swiggy App QR Code"
                className="generatedQrImg"
              />
            </div>
            <div className="modalBadgeLinks">
              <a
                href={PLAY_STORE_URL}
                target="_blank"
                rel="noopener noreferrer"
                onClick={handlePlayStoreClick}
              >
                Google Play
              </a>
              <span className="dot">•</span>
              <a
                href={APP_STORE_URL}
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleAppStoreClick}
              >
                App Store
              </a>
            </div>
          </div>
        </div>
      )}

      {/* INFORMATION MODAL */}
      {activeModal && (
        <div
          className="footerModalOverlay"
          onClick={() => setActiveModal(null)}
        >
          <div
            className="footerModalContent"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="closeModalBtn"
              onClick={() => setActiveModal(null)}
            >
              <FaTimes />
            </button>

            {activeModal === "about" && (
              <div>
                <h3>About Swiggy Clone</h3>
                <p>
                  Swiggy is India’s leading on-demand convenience delivery platform, helping millions of foodies order food, groceries, and dining reservations in minutes.
                </p>
                <p>
                  Built with high performance MERN architecture, supporting 24+ restaurants and 500+ fresh menu items.
                </p>
              </div>
            )}

            {activeModal === "careers" && (
              <div>
                <h3>Careers at Swiggy</h3>
                <p>
                  We are always looking for passionate builders, designers, and engineers to join our team!
                </p>
                <p>Send your resume to <strong>careers@swiggy.com</strong> to explore opportunities.</p>
              </div>
            )}

            {activeModal === "team" && (
              <div>
                <h3>Our Leadership Team</h3>
                <p>
                  Driven by founders and engineers dedicated to elevating the everyday lives of urban consumers through hyper-fast logistics.
                </p>
              </div>
            )}

            {activeModal === "partner" && (
              <div>
                <h3>Partner with Swiggy</h3>
                <p>
                  Grow your restaurant revenue by 3x with millions of customers across India.
                </p>
                <button
                  className="partnerActionBtn"
                  onClick={() => {
                    toast.success("Thank you for your interest! Our onboarding team will contact you shortly.");
                    setActiveModal(null);
                  }}
                >
                  Apply as Restaurant Partner
                </button>
              </div>
            )}

            {activeModal === "ride" && (
              <div>
                <h3>Ride with Swiggy</h3>
                <p>
                  Become a delivery hero, earn flexible incentives with comprehensive insurance, and deliver happiness to doorsteps!
                </p>
                <button
                  className="partnerActionBtn"
                  onClick={() => {
                    toast.success("Registration initiated! Download the Swiggy Delivery Partner app to start.");
                    setActiveModal(null);
                  }}
                >
                  Join as Delivery Partner
                </button>
              </div>
            )}

            {activeModal === "terms" && (
              <div>
                <h3>Terms & Conditions</h3>
                <p>
                  All orders are subject to restaurant preparation time and partner availability. Prices and taxes are governed by local regulatory norms.
                </p>
              </div>
            )}

            {activeModal === "privacy" && (
              <div>
                <h3>Privacy Policy</h3>
                <p>
                  We protect your personal data with end-to-end industry-grade encryption. Your location is used solely to facilitate accurate, timely food delivery.
                </p>
              </div>
            )}

            {activeModal === "cookie" && (
              <div>
                <h3>Cookie Policy</h3>
                <p>
                  Cookies are used to maintain your shopping cart, preferred delivery address, and personalized cuisine recommendations.
                </p>
              </div>
            )}

            {activeModal === "investor" && (
              <div>
                <h3>Investor Relations</h3>
                <p>
                  Swiggy Limited is listed on public stock exchanges, delivering solid quarterly growth and expanding rapid commerce reach.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </footer>
  );
}

export default Footer;