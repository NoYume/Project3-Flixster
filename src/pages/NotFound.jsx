import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { FilmIcon } from "../components/icons.jsx";

// 404 catch-all for any unmatched route (CLAUDE.md §5).
export default function NotFound() {
  return (
    <div className="flex flex-1 items-center justify-center px-4 pb-12 pt-24">
      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 24 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 220, damping: 26 }}
        className="flex max-w-md flex-col items-center gap-4 rounded-squircle-lg glass p-10 text-center"
        style={{ boxShadow: "var(--shadow-glass)" }}
      >
        <FilmIcon className="h-12 w-12 text-accent-bright" />
        <p
          className="text-6xl font-extrabold tracking-tight text-ink"
          style={{ textShadow: "var(--shadow-glow-amber)" }}
        >
          404
        </p>
        <h1 className="text-xl font-bold text-ink">Unable to be found :(</h1>
        <p className="text-sm leading-relaxed text-muted">
          The page you’re looking for isn’t playing here. It may have moved, or
          the link might be broken.
        </p>
        <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
          <Link
            to="/"
            className="mt-2 inline-block rounded-full px-7 py-3 text-sm font-semibold text-ink"
            style={{
              background: "var(--color-accent)",
              boxShadow: "var(--shadow-glow-amber)",
            }}
          >
            Back to Home
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}
