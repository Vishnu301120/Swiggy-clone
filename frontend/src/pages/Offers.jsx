import { useState } from "react";
import "./Offers.css";
import { FiCopy, FiCheck, FiTag, FiGift } from "react-icons/fi";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

const OFFERS_LIST = [
  {
    code: "SWIGGY50",
    discount: "50% OFF",
    upTo: "Up to ₹100",
    minOrder: "Min order ₹199",
    description: "Get 50% discount on all popular restaurants in Madurai. Valid once per user.",
    color: "#fc8019",
  },
  {
    code: "WELCOME20",
    discount: "20% OFF",
    upTo: "Up to ₹60",
    minOrder: "Min order ₹149",
    description: "Special welcome treat for food lovers! Applicable on all foods & drinks.",
    color: "#1ba672",
  },
  {
    code: "FREEDEL",
    discount: "FREE DELIVERY",
    upTo: "Save ₹30",
    minOrder: "Min order ₹199",
    description: "Zero delivery fees on your lunch & dinner orders today!",
    color: "#3b82f6",
  },
  {
    code: "SUPER60",
    discount: "60% OFF",
    upTo: "Up to ₹120",
    minOrder: "Min order ₹249",
    description: "Super saver discount on select biryani & pizza restaurants.",
    color: "#8b5cf6",
  },
  {
    code: "MADURAI100",
    discount: "₹100 FLAT OFF",
    upTo: "Flat ₹100",
    minOrder: "Min order ₹399",
    description: "Special city promo for top restaurant chains across Madurai.",
    color: "#ec4899",
  },
];

const PAYMENT_OFFERS = [
  {
    bank: "HDFC Bank Credit Cards",
    offer: "Flat ₹75 instant cashback on orders above ₹399",
  },
  {
    bank: "Cred Pay UPI",
    offer: "Up to ₹50 cashback directly credited to your wallet",
  },
  {
    bank: "ICICI Bank Net Banking",
    offer: "10% off up to ₹80 on minimum bill value of ₹300",
  },
  {
    bank: "Paytm Wallet",
    offer: "Assured scratch card with rewards up to ₹100",
  },
];

function Offers() {
  const [copiedCode, setCopiedCode] = useState("");

  const copyCode = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    toast.success(`Coupon code "${code}" copied! Apply it in your cart. 🎉`);
    setTimeout(() => setCopiedCode(""), 3000);
  };

  return (
    <div className="offersPage">
      {/* Header Banner */}
      <div className="offersHero">
        <div className="heroTag">
          <FiGift /> Exclusive Vouchers
        </div>
        <h1>Restaurants Offers & Promo Codes</h1>
        <p>Save big on your next meal with handpicked discount coupons and payment rewards</p>
      </div>

      {/* Coupons Section */}
      <div className="sectionTitleRow">
        <FiTag className="secIcon" />
        <h2>Best Available Coupons</h2>
      </div>

      <div className="couponsGrid">
        {OFFERS_LIST.map((coupon) => {
          const isCopied = copiedCode === coupon.code;
          return (
            <div className="couponCardModern" key={coupon.code}>
              <div className="couponLeftBorder" style={{ background: coupon.color }}></div>

              <div className="couponCardContent">
                <div className="couponTopRow">
                  <span className="couponDiscount" style={{ color: coupon.color }}>
                    {coupon.discount}
                  </span>
                  <span className="minOrderTag">{coupon.upTo}</span>
                </div>

                <p className="couponDesc">{coupon.description}</p>
                <small className="minOrderDesc">{coupon.minOrder}</small>

                <div className="couponActionRow">
                  <div className="couponCodeBadge">
                    <strong>{coupon.code}</strong>
                  </div>

                  <button
                    className={`copyCouponBtn ${isCopied ? "copied" : ""}`}
                    onClick={() => copyCode(coupon.code)}
                  >
                    {isCopied ? (
                      <>
                        <FiCheck /> COPIED
                      </>
                    ) : (
                      <>
                        <FiCopy /> COPY CODE
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bank Offers Section */}
      <div className="sectionTitleRow paymentSecTitle">
        <h2>Bank & Wallet Partnerships</h2>
      </div>

      <div className="paymentOffersGrid">
        {PAYMENT_OFFERS.map((po, idx) => (
          <div className="bankCard" key={idx}>
            <h4>{po.bank}</h4>
            <p>{po.offer}</p>
          </div>
        ))}
      </div>

      <div className="offersCtaBanner">
        <h3>Ready to satisfy your cravings?</h3>
        <p>Explore thousands of dishes delivered hot to your doorstep.</p>
        <Link to="/" className="exploreFoodBtn">
          Order Food Now
        </Link>
      </div>
    </div>
  );
}

export default Offers;