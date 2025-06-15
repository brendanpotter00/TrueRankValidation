import {
  InstagramLogoIcon,
  LinkedInLogoIcon,
  GitHubLogoIcon,
  EnvelopeClosedIcon,
} from "@radix-ui/react-icons";
import { useState, useEffect } from "react";
import "../styles/components/Footer.css";
import { subscribeEmail } from "../supabase/supabaseEndpoints";

export const Footer = () => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<{
    type: "success" | "error" | "duplicate" | "validation" | null;
    message: string;
  }>({ type: null, message: "" });

  // Clear status message after 2 seconds
  useEffect(() => {
    if (status.type) {
      const timer = setTimeout(() => {
        setStatus({ type: null, message: "" });
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [status.type]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus({ type: null, message: "" });

    const result = await subscribeEmail(email);

    if (result.success) {
      if (result.isDuplicate) {
        setStatus({
          type: "duplicate",
          message: "You're already subscribed!",
        });
      } else {
        setStatus({
          type: "success",
          message: "Thanks for subscribing!",
        });
        setEmail("");
      }
    } else {
      setStatus({
        type: result.error?.includes("valid email") ? "validation" : "error",
        message: result.error || "Something went wrong. Please try again.",
      });
    }
  };

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-grid">
          {/* Email Signup Section */}
          <div className="footer-section">
            <h3 className="footer-title">see how the project evolves</h3>
            <p className="footer-subtitle">only important updates</p>
            <form onSubmit={handleSubmit} className="footer-form">
              <div className="footer-input-container">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="email"
                  className={`footer-input ${
                    status.type === "validation" ? "footer-input-error" : ""
                  }`}
                  required
                />
                {status.type && (
                  <p
                    className={`footer-status ${
                      status.type === "error"
                        ? "footer-status-error"
                        : status.type === "success"
                        ? "footer-status-success"
                        : status.type === "validation"
                        ? "footer-status-validation"
                        : "footer-status-duplicate"
                    }`}
                  >
                    {status.message}
                  </p>
                )}
              </div>
              <button type="submit" className="footer-button">
                sign up
              </button>
            </form>
          </div>

          {/* Social Links Section */}
          <div className="footer-social">
            <h3 className="footer-title">keep in touch</h3>
            <div className="footer-social-links">
              <a
                href="https://www.instagram.com/brendanpotter00/"
                target="_blank"
                rel="noopener noreferrer"
                className="footer-social-link"
                aria-label="Instagram"
              >
                <InstagramLogoIcon className="footer-icon" />
              </a>
              <a
                href="https://www.linkedin.com/in/brendan-potter00/"
                target="_blank"
                rel="noopener noreferrer"
                className="footer-social-link"
                aria-label="LinkedIn"
              >
                <LinkedInLogoIcon className="footer-icon" />
              </a>
              <a
                href="https://github.com/brendanpotter00"
                target="_blank"
                rel="noopener noreferrer"
                className="footer-social-link"
                aria-label="GitHub"
              >
                <GitHubLogoIcon className="footer-icon" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
