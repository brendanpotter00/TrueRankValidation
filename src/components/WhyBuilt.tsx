import { Link } from "react-router-dom";
import "../styles/components/WhyBuilt.css";

export const WhyBuilt = () => {
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
      </div>
    </div>
  );
};
