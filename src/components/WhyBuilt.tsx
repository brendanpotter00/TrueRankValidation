import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import "../styles/components/WhyBuilt.css";
import { subscribeEmail } from "../supabase/supabaseEndpoints";

export const WhyBuilt = () => {
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
    <div className="why-built">
      <div className="why-built-container">
        <Link to="/" className="why-built-back-link">
          ← back
        </Link>
        <div className="why-built-content">
          <p>
            Humans struggle when asked to rank long lists of items but are
            surprisingly good at choosing between two options. That insight
            drove the creation of this website: instead of presenting a daunting
            list of national parks, it lets you compare just two at a time. By
            focusing on simple pairwise matchups, you can more confidently
            decide which park you prefer without feeling overwhelmed.
          </p>
          <p>
            At its core, the app asks "Park A or Park B?" over and over, then
            assembles your choices into a complete ranking. Because national
            parks vary so much—from the desert landscapes of Joshua Tree to the
            misty forests of Olympic—pairwise comparisons feel intuitive and
            even fun.
          </p>
          <p>
            But why stop at parks? This approach can work for anything you care
            to list and share: favorite books, best coffee shops, dream vacation
            spots, or even team members' project ideas. Imagine gathering your
            friends' ranked lists, merging them into a combined leaderboard, and
            then diving back into head-to-head comparisons to refine the
            results. By extending pairwise ranking to all kinds of shared lists
            and allowing people to compare, contrast, and combine preferences,
            we turn any collection of things into an organized, crowd-sourced
            hierarchy—without the headache of traditional long-list sorting.
          </p>
        </div>

        {/* Email Signup Section */}
        <div className="why-built-signup">
          <h3 className="why-built-signup-title">
            sign up for only important updates
          </h3>
          <p className="why-built-signup-subtitle">
            of how this project evolves because this is just a validation of the
            idea
          </p>
          <form onSubmit={handleSubmit} className="why-built-form">
            <div className="why-built-input-container">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email"
                className={`why-built-input ${
                  status.type === "validation" ? "why-built-input-error" : ""
                }`}
                required
              />
              {status.type && (
                <p
                  className={`why-built-status ${
                    status.type === "error"
                      ? "why-built-status-error"
                      : status.type === "success"
                      ? "why-built-status-success"
                      : status.type === "validation"
                      ? "why-built-status-validation"
                      : "why-built-status-duplicate"
                  }`}
                >
                  {status.message}
                </p>
              )}
            </div>
            <button type="submit" className="why-built-button">
              sign up
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
