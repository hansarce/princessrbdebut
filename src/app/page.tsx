"use client";
import { useState, useEffect, useRef } from "react";

export default function Home() {
  const [showPopup, setShowPopup] = useState(true);
  const [fadeIn, setFadeIn] = useState(false);
  const [popupClosing, setPopupClosing] = useState(false); // NEW
  const petalsContainerRef = useRef<HTMLDivElement>(null);

  // Generate many petals with random positions and delays
  useEffect(() => {
    const petalCount = 40;
    const container = petalsContainerRef.current;
    if (!container) return;

    container.innerHTML = "";
    for (let i = 0; i < petalCount; i++) {
      const petal = document.createElement("div");
      petal.className =
        "absolute top-0 pointer-events-none animate-fall-petal";
      petal.style.left = `${Math.random() * 100}%`;
      petal.style.animationDelay = `${Math.random() * 5}s`;
      petal.style.animationDuration = `${4 + Math.random() * 4}s`;
      petal.style.opacity = `${0.7 + Math.random() * 0.3}`;
      petal.innerHTML = `<svg width="32" height="32" viewBox="0 0 32 32" fill="pink" xmlns="http://www.w3.org/2000/svg"><ellipse cx="16" cy="20" rx="6" ry="12" fill="#f9a8d4" transform="rotate(${Math.random() * 360} 16 20)"/></svg>`;
      container.appendChild(petal);
    }
  }, []);

  // Trigger fade-in after popup closes
  useEffect(() => {
    if (!showPopup) {
      setTimeout(() => setFadeIn(true), 100); // slight delay for smoothness
    }
  }, [showPopup]);

  // Handle close with fade-out
  const handleClosePopup = () => {
    setPopupClosing(true);
    setTimeout(() => {
      setShowPopup(false);
      setPopupClosing(false);
    }, 500); // match fade-out duration
  };

  // Countdown logic
  const eventDate = new Date("2025-08-23T16:00:00");
  const [countdown, setCountdown] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    function updateCountdown() {
      const now = new Date();
      const diff = eventDate.getTime() - now.getTime();
      if (diff <= 0) {
        setCountdown({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }
      setCountdown({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / (1000 * 60)) % 60),
        seconds: Math.floor((diff / 1000) % 60),
      });
    }
    updateCountdown();
    const timer = setInterval(updateCountdown, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div>
      {/* Event Section with bg.png */}
      <section
        className="flex flex-col items-center justify-center text-white text-center p-10 z-10 min-h-screen bg-no-repeat bg-cover bg-center md:bg-none relative overflow-hidden"
        style={{ backgroundImage: "url('/bg.png')" }}
      >
        {/* Popup */}
        {showPopup && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50">
            {/* Close button at the very top right */}
            <button
              className="absolute top-6 right-8 text-white hover:text-red-400 text-3xl font-bold z-50"
              onClick={handleClosePopup}
              aria-label="Close"
            >
              &times;
            </button>
            <div className="flex flex-col items-center">
              <span
                className={`text-[32px] sm:text-[100px] md:text-[80px] font-bold text-[#D4B27C] mb-4 mt-4 sm:mt-8  drop-shadow-lg z-10
                ${popupClosing
                  ? "opacity-0 animate-invited-fade-out"
                  : "opacity-0 animate-invited-fade-down"
                }`}
              >
                You are Invited to <br />
                to a Magical Night!
              </span>
              <img
                src="/envelope.png"
                alt="Envelope"
                className={`w-[340px] h-[227px] sm:w-[400px] sm:h-[400px] md:w-[800px] md:h-[800px] object-contain drop-shadow-lg 
                ${popupClosing
                  ? "animate-envelope-fade-out"
                  : "animate-envelope-pop"
                }`}
              />
            </div>
          </div>
        )}

        {/* Petals falling effect */}
        <div
          ref={petalsContainerRef}
          className="pointer-events-none absolute inset-0 z-20"
        />

        {/* Flower frame image behind the text with fade animation */}
        <img
          src="/frameflower.png"
          alt="Flower Frame"
          className={`absolute left-1/2 top-1/2 w-[1200px] h-[1200px] sm:w-[800px] sm:h-[800px] md:w-[700px] md:h-[700px] md:mb-0 object-contain z-0 pointer-events-none -translate-x-1/2 -translate-y-1/2 transition-opacity duration-1000 ${
            fadeIn ? "opacity-100 fade-in" : "opacity-0"
          }`}
        />
        <div
          className={`relative z-10 mb-10 transition-opacity duration-1000 ${
            fadeIn ? "opacity-100 fade-in" : "opacity-0"
          }`}
        >
          <h1 className="text-3xl font-bold mb-10 text-[#A26A7B]">
            Princess RB&apos;s
            <br />
            <span className="text-[#A26A7B]">18th Birthday</span>
          </h1>
          <p className="text-lg mb-1 text-[#A26A7B] ">
            <span className="font-semibold"> Dress Code:</span> Semi-Formal/Cocktail
          </p>
          <p className="text-lg mb-1 text-[#A26A7B]">
            <span className="font-semibold">Location: </span>Subic Park Hotel
          </p>
          <p className="text-lg text-[#A26A7B]">
            <span className="font-semibold"> Time: </span>August 23, 2025 @ 4:00 PM
          </p>
        </div>

        {/* Countdown Circles at the bottom of the event section */}
        <div
          className={`flex gap-6 justify-center w-full absolute left-0 ${fadeIn ? "opacity-100 fade-in-countdown" : "opacity-0"}`}
          style={{ zIndex: 10, bottom: "5rem" }} // <-- changed from bottom-10 (2.5rem) to 5rem
        >
          <div className="flex flex-col items-center">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-[#E9C2A6] border-4 border-[#E9C2A6] flex flex-col items-center justify-center shadow-lg animate-countdown-pop">
              <span className="text-3xl font-bold text-[#A26A7B]">{countdown.days}</span>
              <span className="text-xs sm:text-base font-semibold text-[#A26A7B] mt-1">Days</span>
            </div>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-[#E9C2A6] border-4 border-[#E9C2A6] flex flex-col items-center justify-center shadow-lg animate-countdown-pop">
              <span className="text-3xl font-bold text-[#A26A7B]">{countdown.minutes}</span>
              <span className="text-xs sm:text-base font-semibold text-[#A26A7B] mt-1">Minutes</span>
            </div>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-[#E9C2A6] border-4 border-[#E9C2A6] flex flex-col items-center justify-center shadow-lg animate-countdown-pop">
              <span className="text-3xl font-bold text-[#A26A7B]">{countdown.seconds}</span>
              <span className="text-xs sm:text-base font-semibold text-[#A26A7B] mt-1">Seconds</span>
            </div>
          </div>
        </div>
      </section>

      {/* Fullscreen Section with bg3.png */}
      <section
        className="w-screen h-screen flex items-center justify-center bg-no-repeat bg-cover bg-center"
        style={{ backgroundImage: "url('/bg3.png')" }}
      >
        {/* Place your content here */}
        <div className="text-4xl font-bold text-white drop-shadow-lg">
          Welcome to the Next Section!
        </div>
      </section>

      {/* Petal falling animation keyframes and fade-in */}
      <style jsx global>{`
        @keyframes fall-petal {
          0% {
            transform: translateY(-10%) rotate(0deg) scale(1);
          }
          80% {
            transform: translateY(90vh) rotate(360deg) scale(1.1);
          }
          100% {
            transform: translateY(110vh) rotate(400deg) scale(0.9);
            opacity: 0;
          }
        }
        .animate-fall-petal {
          animation-name: fall-petal;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
        }
        .fade-in {
          animation: fadeIn 1.2s ease;
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes invited-fade-down {
          0% {
            opacity: 0;
            transform: translateY(-30px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-invited-fade-down {
          animation: invited-fade-down 1s ease forwards;
          animation-delay: 1s;
        }
        @keyframes invited-fade-out {
          0% {
            opacity: 1;
            transform: translateY(0);
          }
          100% {
            opacity: 0;
            transform: translateY(30px);
          }
        }
        .animate-invited-fade-out {
          animation: invited-fade-out 0.5s ease forwards;
        }
        @keyframes envelope-pop {
          0% {
            transform: scale(0.6) rotate(-20deg);
            opacity: 0;
          }
          60% {
            transform: scale(1.1) rotate(10deg);
            opacity: 1;
          }
          100% {
            transform: scale(1) rotate(7.2deg);
            opacity: 1;
          }
        }
        .animate-envelope-pop {
          animation: envelope-pop 0.8s cubic-bezier(0.23, 1, 0.32, 1) both;
        }
        @keyframes envelope-fade-out {
          0% {
            opacity: 1;
            transform: scale(1) rotate(7.2deg);
          }
          100% {
            opacity: 0;
            transform: scale(0.8) rotate(20deg);
          }
        }
        .animate-envelope-fade-out {
          animation: envelope-fade-out 0.5s ease forwards;
        }
        .fade-in-countdown {
          animation: fadeInCountdown 1s ease forwards;
        }
        @keyframes fadeInCountdown {
          from { opacity: 0; transform: translateY(30px);}
          to { opacity: 1; transform: translateY(0);}
        }
        .animate-countdown-pop {
          animation: countdownPop 0.8s cubic-bezier(0.23, 1, 0.32, 1) both;
        }
        @keyframes countdownPop {
          0% {
            opacity: 0;
            transform: scale(0.7);
          }
          60% {
            opacity: 1;
            transform: scale(1.1);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  );
}
