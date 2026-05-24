"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

// Define the type for a single review
type Review = {
  id: string | number;
  name: string;
  affiliation: string;
  quote: string;
  imageSrc: string;
  thumbnailSrc: string;
};

const gradientTitleClassName = 'bg-[linear-gradient(135deg,#12E1C5_0%,#18C7E5_50%,#0771FC_100%)] bg-clip-text text-transparent';
const carouselAutoplayIntervalMs = 5000;

// Define the props for the slider component
interface TestimonialSliderProps {
  reviews: Review[];
  /** Optional class name for the container */
  className?: string;
}

/**
 * A reusable, animated testimonial slider component.
 * It uses framer-motion for animations and is styled with
 * shadcn/ui theme variables.
 */
export const TestimonialSlider = ({
  reviews,
  className,
}: TestimonialSliderProps) => {
  const [currentIndex, setCurrentIndex] = React.useState(0);
  // 'direction' helps framer-motion understand slide direction (next vs. prev)
  const [direction, setDirection] = React.useState<"left" | "right">("right");

  const activeReview = reviews[currentIndex];
  React.useEffect(() => {
    if (reviews.length <= 1) {
      return undefined;
    }

    const intervalId = window.setInterval(() => {
      setDirection("right");
      setCurrentIndex((prev) => (prev + 1) % reviews.length);
    }, carouselAutoplayIntervalMs);

    return () => window.clearInterval(intervalId);
  }, [reviews.length]);

  const handleThumbnailClick = (index: number) => {
    // Determine direction for animation
    setDirection(index > currentIndex ? "right" : "left");
    setCurrentIndex(index);
  };

  // Get the other reviews for the thumbnails, excluding the current one
  const thumbnailReviews = reviews
    .filter((_, i) => i !== currentIndex);

  // Animation variants for the main image
  const imageVariants = {
    enter: (direction: "left" | "right") => ({
      y: direction === "right" ? "100%" : "-100%",
      opacity: 0,
    }),
    center: { y: 0, opacity: 1 },
    exit: (direction: "left" | "right") => ({
      y: direction === "right" ? "-100%" : "100%",
      opacity: 0,
    }),
  };

  // Animation variants for the text content
  const textVariants = {
    enter: (direction: "left" | "right") => ({
      x: direction === "right" ? 50 : -50,
      opacity: 0,
    }),
    center: { x: 0, opacity: 1 },
    exit: (direction: "left" | "right") => ({
      x: direction === "right" ? -50 : 50,
      opacity: 0,
    }),
  };

  return (
    <div
      className={cn(
        "relative w-full min-h-[650px] md:min-h-[600px] overflow-hidden bg-background text-foreground p-8 md:p-12",
        className
      )}
    >
      <div className="grid min-h-[inherit] grid-cols-1 gap-8 md:grid-cols-12 md:gap-x-[22px] md:gap-y-8">
        {/* === Left Column: Meta and Thumbnails === */}
        <div className="md:col-span-2 flex flex-col justify-between order-2 md:order-1">
          <div className="flex flex-row items-start justify-between space-x-4 md:flex-col md:justify-start md:space-x-0 md:space-y-4">
            {/* Pagination */}
            <span className="text-sm text-muted-foreground font-mono">
              {String(currentIndex + 1).padStart(2, "0")} /{" "}
              {String(reviews.length).padStart(2, "0")}
            </span>
            {/* Vertical "Reviews" Text */}
            <h2 className="hidden text-sm font-medium uppercase tracking-widest [writing-mode:vertical-rl] md:block">
              六大能力
            </h2>
          </div>

          {/* Thumbnail Navigation */}
          <div className="flex space-x-2 mt-8 md:mt-0">
            {thumbnailReviews.map((review) => {
              // Find the original index to navigate to
              const originalIndex = reviews.findIndex(
                (r) => r.id === review.id
              );
              return (
                <button
                  key={review.id}
                  onClick={() => handleThumbnailClick(originalIndex)}
                  className="overflow-hidden rounded-[0.5em] w-16 h-20 md:w-20 md:h-24 opacity-70 hover:opacity-100 transition-opacity duration-300 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background"
                  aria-label={`View review from ${review.name}`}
                >
                  <img
                    src={review.thumbnailSrc}
                    alt={review.name}
                    className="w-full h-full object-contain"
                  />
                </button>
              );
            })}
          </div>
        </div>

        {/* === Center Column: Main Image === */}
        <div className="md:col-span-4 relative aspect-square w-full max-w-[350px] mx-auto order-1 md:order-2 flex justify-end md:mt-[80px]">
          <AnimatePresence initial={false} custom={direction}>
            <motion.img
              key={currentIndex}
              src={activeReview.imageSrc}
              alt={activeReview.name}
              custom={direction}
              variants={imageVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }} // Cubic bezier for smooth ease
              className="absolute inset-0 w-full h-full object-contain rounded-lg"
            />
          </AnimatePresence>
        </div>

        {/* === Right Column: Text === */}
        <div className="md:col-span-4 flex flex-col justify-start md:-ml-[30px] md:pl-[13px] order-3 md:order-3 md:mt-[80px]">
          {/* Text Content */}
          <div className="relative min-h-[200px] overflow-hidden pt-4 md:pt-10 md:w-full">
            <AnimatePresence initial={false} custom={direction} mode="wait">
              <motion.div
                key={currentIndex}
                custom={direction}
                variants={textVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
              >
                {activeReview.affiliation ? (
                  <p className="text-sm font-medium text-muted-foreground">
                    {activeReview.affiliation}
                  </p>
                ) : null}
                <h3 className="mt-1 w-full flex-none whitespace-nowrap text-[30px] font-semibold leading-[1.4] md:text-[42px] md:leading-[58px]">
                  <span className={gradientTitleClassName}>{activeReview.name}</span>
                </h3>
                <blockquote className="mt-6 text-[15px] md:text-[17px] font-normal leading-[2]">
                  "{activeReview.quote}"
                </blockquote>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};
