import { useState } from "react";
import "./Help.css";
import { FiChevronDown, FiHelpCircle, FiMessageSquare, FiMail, FiPhone } from "react-icons/fi";
import { toast } from "react-toastify";

const FAQ_SECTIONS = [
  {
    category: "Partner Onboarding & Swiggy One",
    items: [
      {
        q: "What is Swiggy One membership?",
        a: "Swiggy One is our premium membership that offers unlimited free deliveries on food orders above ₹149, extra discounts at top dining restaurants, and zero surge fee.",
      },
      {
        q: "How do I update my delivery location?",
        a: "You can click on the Location pin in the top navigation bar and choose your delivery address or set a new one on the map.",
      },
    ],
  },
  {
    category: "Orders & Delivery",
    items: [
      {
        q: "Can I edit my order after placing it?",
        a: "Once the restaurant confirms your order and starts kitchen preparation, items cannot be edited. However, you can call the delivery partner directly from the live tracking page.",
      },
      {
        q: "How do I track my delivery partner in real-time?",
        a: "Navigate to 'My Orders' and click 'Track Order'. You'll see live status updates from Order Confirmed to Cooking, Out for Delivery, and Delivery ETA.",
      },
      {
        q: "What if my delivery is delayed?",
        a: "Our delivery heroes strive to reach you in 25-30 mins. During heavy rain or peak rush hours, ETAs might adjust dynamically to ensure safe rider travel.",
      },
    ],
  },
  {
    category: "Payment & Refunds",
    items: [
      {
        q: "Which payment options are supported?",
        a: "We support Cash on Delivery (COD), UPI (Google Pay, PhonePe, Paytm), Credit & Debit Cards, and Net Banking.",
      },
      {
        q: "When will I receive my refund if an order is cancelled?",
        a: "Refunds initiated for UPI payments take 2-4 hours, while Net Banking and Card refunds reflect in 3-5 business days.",
      },
    ],
  },
];

function Help() {
  const [activeAccordion, setActiveAccordion] = useState("Orders & Delivery-0");
  const [contactMessage, setContactMessage] = useState("");

  const toggleAccordion = (id) => {
    setActiveAccordion(activeAccordion === id ? null : id);
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!contactMessage.trim()) return;
    toast.success("Message received! Our customer support hero will reply shortly. 📩");
    setContactMessage("");
  };

  return (
    <div className="helpPage">
      <div className="helpHero">
        <FiHelpCircle className="helpHeroIcon" />
        <h1>Swiggy Help & Support</h1>
        <p>Let's take a step ahead and help you with your order, payment, and delivery questions</p>
      </div>

      <div className="helpLayout">
        {/* Left: FAQs Accordion */}
        <div className="faqSection">
          <h2>Frequently Asked Questions</h2>

          {FAQ_SECTIONS.map((sec) => (
            <div className="faqCategoryGroup" key={sec.category}>
              <h3>{sec.category}</h3>

              <div className="accordionList">
                {sec.items.map((item, idx) => {
                  const itemId = `${sec.category}-${idx}`;
                  const isOpen = activeAccordion === itemId;

                  return (
                    <div
                      className={`accordionItem ${isOpen ? "open" : ""}`}
                      key={itemId}
                    >
                      <button
                        className="accordionHeader"
                        onClick={() => toggleAccordion(itemId)}
                      >
                        <span>{item.q}</span>
                        <FiChevronDown className="accArrow" />
                      </button>

                      {isOpen && (
                        <div className="accordionBody">
                          <p>{item.a}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Right: Quick Contact Support Card */}
        <div className="contactSupportSidebar">
          <div className="contactCard">
            <div className="contactCardIcon">
              <FiMessageSquare />
            </div>
            <h3>Need Quick Assistance?</h3>
            <p>Send a message directly to our Madurai operations team.</p>

            <form onSubmit={handleSendMessage} className="helpContactForm">
              <textarea
                placeholder="Describe your issue or feedback..."
                rows="4"
                value={contactMessage}
                onChange={(e) => setContactMessage(e.target.value)}
                required
              ></textarea>
              <button type="submit" className="sendHelpMsgBtn">
                Send to Support
              </button>
            </form>

            <hr />

            <div className="supportChannels">
              <div className="channelItem">
                <FiMail /> <span>support@swiggy.com</span>
              </div>
              <div className="channelItem">
                <FiPhone /> <span>1800-208-1234 (Toll Free)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Help;