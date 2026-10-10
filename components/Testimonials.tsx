"use client";
import { useRef, useState } from "react";
import { Star, ArrowUpRight } from "lucide-react";
import { useFeedbackMotion } from "@/hooks/useFeedbackMotion";
import { reviews } from "@/lib/content";
import { useReducedMotion } from "@/hooks/useMedia";
import Reveal from "./Reveal";
import dynamic from "next/dynamic";
const ReviewForm = dynamic(() => import("./ReviewForm"), {
  loading: () => (
    <p role="status" className="sr-only">
      Opening the review form…
    </p>
  ),
});
export default function Testimonials() {
  const viewport = useRef<HTMLDivElement>(null),
    track = useRef<HTMLDivElement>(null),
    original = useRef<HTMLDivElement>(null),
    [repeat, setRepeat] = useState(1),
    [open, setOpen] = useState(false);
  const reduced = useReducedMotion();
  useFeedbackMotion(viewport, track, original, reduced, setRepeat);
  const cards = () => (
    <>
      {reviews.map((r, i) => (
        <article className="testimonial-card" key={i}>
          <div className="testimonial-top">
            <span>CLIENT FEEDBACK</span>
            <span
              className="review-stars"
              aria-label={`${r.rating} out of 5 stars`}
            >
              {Array.from({ length: r.rating }, (_, i) => (
                <Star
                  key={i}
                  size={13}
                  fill="currentColor"
                  aria-hidden="true"
                />
              ))}
            </span>
          </div>
          <blockquote>“{r.review}”</blockquote>
          <div className="testimonial-person">
            <img
              src={r.avatar}
              width="42"
              height="42"
              alt=""
              loading="lazy"
              draggable={false}
            />
            <div>
              <strong>{r.name}</strong>
              {"company" in r && <small>{r.company}</small>}
            </div>
          </div>
        </article>
      ))}
    </>
  );
  return (
    <section id="testimonials" className="section testimonials">
      <Reveal className="section-heading">
        <div>
          <p className="eyebrow">09 / CLIENT FEEDBACK</p>
          <h2>
            What clients <span>say.</span>
          </h2>
        </div>
        <p>
          Feedback from people I’ve worked with on web development, technical
          projects, and digital experiences.
        </p>
      </Reveal>
      <p id="feedback-instructions" className="sr-only">
        Hold to pause. Drag or swipe left and right to explore reviews. With
        keyboard focus, use the left and right arrow keys.
      </p>
      <div
        ref={viewport}
        tabIndex={0}
        role="region"
        aria-label="Client feedback"
        aria-describedby="feedback-instructions"
        className={`testimonial-viewport ${reduced ? "motion-reduced" : ""}`}
      >
        <div className="testimonial-track" ref={track}>
          <div ref={original} className="testimonial-group">
            {cards()}
          </div>
          {!reduced &&
            Array.from({ length: repeat }, (_, i) => (
              <div key={i} className="testimonial-group" aria-hidden="true">
                {cards()}
              </div>
            ))}
        </div>
      </div>
      <div className="feedback-footer">
        <button className="button secondary" onClick={() => setOpen(true)}>
          Leave a Review <ArrowUpRight size={15} />
        </button>
        <p>Reviews are published only after I’ve read and approved them.</p>
      </div>
      {open && <ReviewForm open={open} onClose={() => setOpen(false)} />}
    </section>
  );
}
