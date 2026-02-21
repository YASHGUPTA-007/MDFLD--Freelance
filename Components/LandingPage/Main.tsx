"use client";

import React, { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

// Component imports
import GrainOverlay from "./GrainOverlay";
import AmbientOrbs from "./AmbientOrbs";
import RollingFootball from "./RollingFootball";

import HeroSection from "./HeroSection";
import MarqueeSection from "./MarqueeSection";
import BentoGridSection from "./BentoGridSection";
import HorizontalScrollSection from "./HorizontalScrollSection";

import PostsSection from "./PostsSection";
import NewsletterSection from "./NewsletterSection";
import GlobalStyles from "./GlobalStyles";
import Navbar from "../Navbar";
import ManifestoSection from "./ManifestoSection";
import FooterSection from "./FooterSection";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function LandingPage() {
  const mainRef = useRef<HTMLDivElement>(null);
  const ballRef = useRef<HTMLDivElement>(null);
  const horizontalSectionRef = useRef<HTMLDivElement>(null);
  const horizontalTrackRef = useRef<HTMLDivElement>(null);
  const goalSectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const goalSection = goalSectionRef.current;

      if (!goalSection || !ballRef.current) return;

      // Master timeline for ball animation
      const masterTl = gsap.timeline({
        scrollTrigger: {
          trigger: mainRef.current,
          start: "top top",
          end: "bottom bottom",
          scrub: 1.5,
        },
      });

      // Ball journey animation
      masterTl
        .to(ballRef.current, {
          x: "28vw",
          y: "18vh",
          rotation: 300,
          scale: 1.15,
          ease: "none",
          duration: 10,
        })
        .to(ballRef.current, {
          x: "-25vw",
          y: "35vh",
          rotation: 600,
          scale: 0.95,
          ease: "none",
          duration: 10,
        })
        .to(ballRef.current, {
          x: "32vw",
          y: "48vh",
          rotation: 900,
          scale: 1.2,
          ease: "none",
          duration: 10,
        })
        .to(ballRef.current, {
          x: "-15vw",
          y: "28vh",
          rotation: 1180,
          scale: 1.0,
          ease: "none",
          duration: 10,
        })
        .to(ballRef.current, {
          x: "22vw",
          y: "55vh",
          rotation: 1440,
          scale: 0.9,
          ease: "none",
          duration: 10,
        })
        .to(ballRef.current, {
          x: "5vw",
          y: "40vh",
          rotation: 1680,
          scale: 1.05,
          ease: "none",
          duration: 10,
        })
        .to(ballRef.current, {
          x: "0vw",
          y: "72vh",
          rotation: 2160,
          scale: 0.55,
          opacity: 0,
          ease: "power2.in",
          duration: 15,
        });

      // Horizontal scroll
      if (horizontalSectionRef.current && horizontalTrackRef.current) {
        const getScrollAmount = () => {
          let trackWidth = horizontalTrackRef.current?.scrollWidth || 0;
          return -(trackWidth - window.innerWidth);
        };
        gsap.to(horizontalTrackRef.current, {
          x: getScrollAmount,
          ease: "none",
          scrollTrigger: {
            trigger: horizontalSectionRef.current,
            pin: true,
            start: "top top",
            end: () => `+=${getScrollAmount() * -1}`,
            scrub: 1,
            invalidateOnRefresh: true,
          },
        });
      }

      // Scroll reveals
      gsap.utils.toArray(".reveal-up").forEach((elem: any) => {
        gsap.from(elem, {
          scrollTrigger: { trigger: elem, start: "top 88%" },
          y: 70,
          opacity: 0,
          duration: 1.2,
          ease: "power3.out",
        });
      });

      // Parallax images
      gsap.utils.toArray(".parallax-img").forEach((img: any) => {
        gsap.to(img, {
          scrollTrigger: {
            trigger: img.parentElement,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
          y: "20%",
          ease: "none",
        });
      });

      // Floating elements
      gsap.utils.toArray(".float-element").forEach((elem: any) => {
        gsap.to(elem, {
          y: "random(-25, 25)",
          x: "random(-15, 15)",
          duration: "random(3, 6)",
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });
      });

      // Hero text stagger
      gsap.from(".hero-word", {
        y: 120,
        opacity: 0,
        duration: 1.4,
        stagger: 0.12,
        ease: "power4.out",
        delay: 0.3,
      });

      gsap.from(".hero-sub", {
        y: 40,
        opacity: 0,
        duration: 1,
        delay: 0.9,
        ease: "power3.out",
      });
    },
    { scope: mainRef },
  );

  return (
    <main
      ref={mainRef}
      className="relative bg-[#050505] text-white font-sans selection:bg-[#00d4b6] selection:text-black overflow-x-hidden"
    >
      <GrainOverlay />
      <AmbientOrbs />
      <RollingFootball ballRef={ballRef} />
      <Navbar />
      <HeroSection />
      <MarqueeSection />
      <BentoGridSection />
      <HorizontalScrollSection
        horizontalSectionRef={horizontalSectionRef}
        horizontalTrackRef={horizontalTrackRef}
      />
      <ManifestoSection />
      <PostsSection />
      <NewsletterSection />
      <FooterSection goalSectionRef={goalSectionRef} />
      <GlobalStyles />
    </main>
  );
}
