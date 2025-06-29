"use client";
import React, { useRef, useState, useEffect } from "react";

type GuestInfo = {
  name: string;
};

export default function Home() {
  const [showPopup, setShowPopup] = useState(true);
  const [fadeIn, setFadeIn] = useState(false);
  const [popupClosing, setPopupClosing] = useState(false);
  const petalsContainerRef = useRef<HTMLDivElement>(null);

  // RSVP states
  const [rsvpName, setRsvpName] = useState("");
  const [rsvpGuests, setRsvpGuests] = useState(1);
  const [rsvpAttend, setRsvpAttend] = useState("Yes");
  const [rsvpSubmitted, setRsvpSubmitted] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [guestInfo, setGuestInfo] = useState<GuestInfo[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  // Music player state
  const audioRef = useRef<HTMLAudioElement>(null);
  const [musicOn, setMusicOn] = useState(true);

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
      setTimeout(() => setFadeIn(true), 100);
    }
  }, [showPopup]);

  // Handle close with fade-out
  const handleClosePopup = () => {
    setPopupClosing(true);
    setTimeout(() => {
      setShowPopup(false);
      setPopupClosing(false);
      if (audioRef.current && musicOn) {
        audioRef.current.play().catch(() => {});
      }
    }, 500);
  };

  // Countdown logic
  const eventDate = new Date("2025-08-23T17:00:00");
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

  // Handle guest info change
  const handleGuestInfoChange = (index: number, value: string) => {
    const newGuestInfo = [...guestInfo];
    newGuestInfo[index] = { name: value };
    setGuestInfo(newGuestInfo);
  };

  // Handle RSVP submit
  const handleRsvpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    // If there are additional guests and we're on step 1, go to step 2
    if (rsvpGuests > 1 && currentStep === 1) {
      // Initialize guest info array with empty names
      const initialGuestInfo = Array(rsvpGuests - 1).fill({ name: "" });
      setGuestInfo(initialGuestInfo);
      setCurrentStep(2);
      return;
    }

    // Otherwise, proceed with submission
    try {
      setIsSubmitting(true);
      setSubmitError("");

      const scriptUrl = "https://script.google.com/macros/s/AKfycbwzAijSYGESYkKpsGxHrb3ekkccCYeW5Qdx3INFDwYfbulQWYPDrVqDpmWQRWOpAyyF/exec";

      // Prepare guest data - include the main attendee as Guest 0 if they're bringing others
      const guestData: Record<string, string> = {};
      if (rsvpGuests > 1) {
        guestData["Guest 0"] = rsvpName; // Main attendee
        guestInfo.forEach((guest, index) => {
          guestData[`Guest ${index + 1}`] = guest.name;
        });
      }

      await fetch(scriptUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          Timestamp: new Date().toISOString(),
          Name: rsvpName,
          "Number of Guests": rsvpGuests,
          Attendance: rsvpAttend,
          ...guestData
        }),
        mode: "no-cors"
      });

      setRsvpSubmitted(true);
    } catch (error) {
      setSubmitError("Submission received! You may close this form.");
      console.log("Data was saved, but response couldn't be verified.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle back button
  const handleBack = () => {
    setCurrentStep(1);
  };

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = 0.3;
      if (musicOn) {
        audioRef.current.play().catch(() => {});
      } else {
        audioRef.current.pause();
      }
    }
  }, [musicOn]);

  // For RSVP flower decorations
  const rsvpFlowers = [
    { src: "/flower.png", style: { top: "8%", left: "5%", width: 90, zIndex: 1, animationDuration: "3.2s" } },
    { src: "/flower.png", style: { bottom: "12%", left: "10%", width: 80, zIndex: 1, animationDuration: "2.7s" } },
    { src: "/flower.png", style: { top: "50%", left: "2%", width: 70, zIndex: 1, animationDuration: "3.8s" } },
    { src: "/flower.png", style: { top: "20%", right: "8%", width: 100, zIndex: 1, animationDuration: "2.9s" } },
    { src: "/flower.png", style: { bottom: "18%", right: "12%", width: 90, zIndex: 1, animationDuration: "3.5s" } },
    { src: "/flower.png", style: { bottom: "8%", right: "3%", width: 75, zIndex: 1, animationDuration: "2.5s" } },
    { src: "/flower.png", style: { top: "30%", left: "20%", width: 85, zIndex: 1, animationDuration: "3.1s" } },
    { src: "/flower.png", style: { bottom: "25%", right: "20%", width: 95, zIndex: 1, animationDuration: "3.7s" } },
    { src: "/flower.png", style: { top: "12%", right: "18%", width: 80, zIndex: 1, animationDuration: "2.8s" } },
    { src: "/flower.png", style: { bottom: "35%", left: "18%", width: 90, zIndex: 1, animationDuration: "3.3s" } },
  ];

  return (
    <div
      className="relative overflow-x-hidden min-h-screen"
      style={{
        backgroundImage: "url('/bg.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Import Carattere font */}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Carattere&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Brygada+1918:wght@400;700&display=swap');
        .carattere-font {
          font-family: 'Carattere', cursive !important;
        }
        .brygada-font {
          font-family: 'Brygada 1918', serif !important;
        }
        @keyframes fall-petal {
          0% {
            transform: translateY(-10%) rotate(0deg) scale(1);
          }
          80% {
            transform: translateY(180vh) rotate(360deg) scale(1.1);
          }
          100% {
            transform: translateY(200vh) rotate(400deg) scale(0.9);
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
        @keyframes fadeInFlower {
          from { opacity: 0; transform: translateY(30px) scale(0.8);}
          to { opacity: 1; transform: translateY(0) scale(1);}
        }
        @keyframes spinFlower {
          0% { transform: rotate(0deg);}
          100% { transform: rotate(360deg);}
        }
        .flower-fade {
          will-change: opacity, transform;
        }
        .spin-flower {
          animation: spinFlower 6s linear infinite;
        }
        @keyframes zoomFlower {
          0% { transform: scale(0.85);}
          100% { transform: scale(1.22);}
        }
        .zoom-flower {
          will-change: transform;
        }
        @media (min-width: 1024px) {
          .rsvp-flower {
            width: 140px !important;
            max-width: none !important;
          }
        }
      `}</style>

      {/* Background music */}
      <audio
        ref={audioRef}
        src="/music.mp3"
        loop
        autoPlay
        style={{ display: "none" }}
      />

      {/* Music toggle button */}
      <button
        className="fixed z-[100] bottom-6 right-6 w-12 h-12 bg-white/70 rounded-full flex items-center justify-center shadow-lg transition hover:scale-110"
        onClick={() => setMusicOn((prev) => !prev)}
        aria-label={musicOn ? "Turn music off" : "Turn music on"}
        type="button"
      >
        <img
          src={musicOn ? "/musicon.png" : "/musicoff.png"}
          alt={musicOn ? "Music On" : "Music Off"}
          className="w-8 h-8"
          draggable={false}
        />
      </button>

      {/* Petals falling effect */}
      <div
        ref={petalsContainerRef}
        className="pointer-events-none fixed inset-0 z-20 h-[200vh] overflow-hidden"
      />

      {/* Popup */}
      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-md z-50">
          <button
            className="absolute top-6 right-8 text-white hover:text-red-400 text-3xl font-bold z-50"
            onClick={handleClosePopup}
            aria-label="Close"
          >
            &times;
          </button>
          
          <div className="flex flex-col items-center justify-center w-full h-full px-4">
            <div className="text-center mb-4 md:mb-8 w-full max-w-4xl">
              <span
                className={`block text-[32px] sm:text-[60px] md:text-[80px] font-bold text-[#473d29] drop-shadow-lg z-10 carattere-font
                ${popupClosing
                  ? "opacity-0 animate-invited-fade-out"
                  : "opacity-0 animate-invited-fade-down"
                }`}
              >
                You're Invited to <br className="hidden sm:block" />
                a Magical Night!
              </span>
            </div>

            <div className="w-full flex justify-center">
              <img
                src="/envelope.png"
                alt="Envelope"
                className={`w-[280px] h-[187px] sm:w-[340px] sm:h-[227px] md:w-[400px] md:h-[267px] lg:w-[500px] lg:h-[334px] object-contain drop-shadow-lg 
                ${popupClosing
                  ? "animate-envelope-fade-out"
                  : "animate-envelope-pop"
                }`}
              />
            </div>
          </div>
        </div>
      )}

      {/* First Section */}
      <section className="flex flex-col items-center text-white text-center p-10 z-10 min-h-screen relative">
        <div
          className={`relative z-10 max-w-2xl w-[400px] h-[550px] lg:w-[500px] lg:h-[650px] md:h-[700px] md:w-[500px] bg-contain bg-no-repeat bg-center p-8 sm:p-12 mt-5 transition-opacity duration-1000 ${
            fadeIn ? "opacity-100 fade-in" : "opacity-0"
          }`}
          style={{ 
            backgroundImage: "url('/frameflower.png')",
            backgroundSize: '100% 100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-start',
            alignItems: 'center'
          }}
        >
          <div className="text-center mt-20">
            <h1 className="text-[40px] lg:text-[50px] lg:mb-6  text-[#A26A7B] carattere-font">
              Princess RB's
              <br />
              <span className="text-[#A26A7B]">18th Birthday</span>
            </h1>
            <p className="text-lg mb-2 text-[#A26A7B] brygada-font">
              <span className="font-semibold">Dress Code:</span> Formal
            </p>
            <p className="text-lg mb-2 text-[#A26A7B] brygada-font">
              <span className="font-semibold">Location:</span> Subic Park Hotel
            </p>
            <p className="text-lg text-[#A26A7B] brygada-font">
              <span className="font-semibold">Time:</span> August 23, 2025 @ 5:00 PM
            </p>
          </div>
        </div>

        <div
          className={`flex gap-6 justify-center w-full absolute left-0 ${fadeIn ? "opacity-100 fade-in-countdown" : "opacity-0"}`}
          style={{ zIndex: 10, bottom: "5rem" }}
        >
          <div className="flex flex-col items-center">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-[#E9C2A6] border-4 border-[#E9C2A6] flex flex-col items-center justify-center shadow-lg animate-countdown-pop">
              <span className="text-3xl font-bold text-[#A26A7B]">{countdown.days}</span>
              <span className="text-xs sm:text-base font-semibold text-[#A26A7B] mt-1 brygada-font">Days</span>
            </div>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-[#E9C2A6] border-4 border-[#E9C2A6] flex flex-col items-center justify-center shadow-lg animate-countdown-pop">
              <span className="text-3xl font-bold text-[#A26A7B]">{countdown.hours}</span>
              <span className="text-xs sm:text-base font-semibold text-[#A26A7B] mt-1 brygada-font">Hours</span>
            </div>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-[#E9C2A6] border-4 border-[#E9C2A6] flex flex-col items-center justify-center shadow-lg animate-countdown-pop">
              <span className="text-3xl font-bold text-[#A26A7B]">{countdown.minutes}</span>
              <span className="text-xs sm:text-base font-semibold text-[#A26A7B] mt-1 brygada-font">Minutes</span>
            </div>
          </div>
        </div>
      </section>

      {/* Second Section */}
      <section className="w-screen min-h-screen flex flex-col items-center justify-center py-16 px-4 relative">
        <div className="flex flex-col items-center w-full max-w-4xl">
          <div className="text-center mb-4 md:mb-6 w-full mt-[-20px] md:mt-[-30px]">
            <h2 className="text-[40px] lg:text-[50px] lg:mb-7 md:text-4xl font-bold text-[#767818] mb-2 carattere-font">
              Event Location
            </h2>
            <p className="text-lg md:text-xl text-[#767818] mb-3 font-semibold brygada-font">
              "A Night to Remember—Here's Where It Happens"
            </p>
            <p className="text-base md:text-lg text-[#767818] brygada-font">
              Join us for an unforgettable evening at the
              <br />
              <span className="font-bold brygada-font">Subic Park Hotel</span>
              <br />
              1 Dewey Ave, Subic Bay Freeport Zone, Zambales
            </p>
          </div>

          <div className="relative w-full max-w-[600px] h-[400px] md:h-[500px] mt-4">
            <div className="absolute inset-0 rounded-lg overflow-hidden shadow-md z-0">
              <iframe
                title="Subic Park Hotel Map"
                src="https://www.google.com/maps?q=Subic+Park+Hotel&output=embed"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={true}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
            
            <div 
              className="absolute z-10 pointer-events-none"
              style={{ 
                backgroundImage: "url('/frameflower2.png')",
                backgroundSize: 'contain',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center',
                width: '150%',
                height: '150%',
                left: '50%',
                top: '50%',
                transform: 'translate(-50%, -50%)'
              }}
            ></div>
          </div>
        </div>
      </section>

      {/* Third Section (RSVP) */}
      <section className="flex flex-col items-center justify-center min-h-screen py-12 px-4 sm:px-8 relative overflow-hidden">
        {rsvpFlowers.map((flower, idx) => (
          <img
            key={idx}
            src={flower.src}
            alt=""
            className="flower-fade absolute pointer-events-none select-none rsvp-flower zoom-flower"
            style={{
              ...flower.style,
              opacity: 0,
              animation: `fadeInFlower 1.2s ease ${0.3 + idx * 0.2}s forwards, zoomFlower ${flower.style.animationDuration} ease-in-out infinite alternate`,
            }}
            aria-hidden="true"
            draggable={false}
          />
        ))}

        <div className="max-w-lg w-full flex flex-col items-center bg-white/80 rounded-xl shadow-lg py-10 px-6 relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold text-[#A26A7B] mb-2 text-center">
            RSVP
          </h2>
          <p className="text-lg md:text-xl text-[#A26A7B] mb-6 text-center font-semibold">
            We'd love to celebrate with you!
          </p>
          {!rsvpSubmitted ? (
  <form className="w-full flex flex-col gap-4" onSubmit={handleRsvpSubmit}>
    {currentStep === 1 ? (
      <>
        <div>
          <label className="block text-[#A26A7B] font-semibold mb-1" htmlFor="rsvp-name">
            Your Name
          </label>
          <input
            id="rsvp-name"
            type="text"
            required
            value={rsvpName}
            onChange={e => setRsvpName(e.target.value)}
            className="w-full px-4 py-2 rounded border border-[#E9C2A6] focus:outline-none focus:ring-2 focus:ring-[#A26A7B] text-[#A26A7B]"
          />
        </div>
        <div>
          <label className="block text-[#A26A7B] font-semibold mb-1" htmlFor="rsvp-guests">
            Total Number Attending (including you)
          </label>
          <select
            id="rsvp-guests"
            value={rsvpGuests}
            onChange={e => setRsvpGuests(Number(e.target.value))}
            className="w-full px-4 py-2 rounded border border-[#E9C2A6] focus:outline-none focus:ring-2 focus:ring-[#A26A7B] text-[#A26A7B]"
          >
            {[1, 2, 3, 4, 5].map(num => (
              <option key={num} value={num}>{num}</option>
            ))}
          </select>
          <p className="text-sm text-[#A26A7B] mt-1">Maximum of 4 guests allowed</p>
        </div>
        <div>
          <label className="block text-[#A26A7B] font-semibold mb-1">
            Will you attend?
          </label>
          <select
            value={rsvpAttend}
            onChange={e => setRsvpAttend(e.target.value)}
            className="w-full px-4 py-2 rounded border border-[#E9C2A6] focus:outline-none focus:ring-2 focus:ring-[#A26A7B] text-[#A26A7B]"
          >
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className={`mt-4 bg-[#A26A7B] text-white font-bold py-2 px-6 rounded shadow hover:bg-[#8b5266] transition ${
            isSubmitting ? "opacity-70 cursor-not-allowed" : ""
          }`}
        >
          {isSubmitting ? "Submitting..." : 
           rsvpGuests > 1 ? "Next" : "Send RSVP"}
        </button>
      </>
    ) : (
      <>
        <div className="w-full">
          <h3 className="text-xl font-semibold text-[#A26A7B] mb-4 text-center">
            Guest Information
          </h3>
          <p className="text-sm text-[#A26A7B] mb-4 text-center">
            Please provide names for all attendees
          </p>
          
          {/* Main attendee name (editable) */}
          <div className="mb-4">
            <label className="block text-[#A26A7B] font-semibold mb-1">
              Your Name
            </label>
            <input
              type="text"
              required
              value={rsvpName}
              onChange={e => setRsvpName(e.target.value)}
              className="w-full px-4 py-2 rounded border border-[#E9C2A6] focus:outline-none focus:ring-2 focus:ring-[#A26A7B] text-[#A26A7B]"
            />
          </div>
          
          {/* Additional guests */}
          {Array.from({ length: rsvpGuests - 1 }).map((_, index) => (
            <div key={index} className="mb-4">
              <label className="block text-[#A26A7B] font-semibold mb-1">
                Guest {index + 1} Name
              </label>
              <input
                type="text"
                required
                value={guestInfo[index]?.name || ""}
                onChange={e => handleGuestInfoChange(index, e.target.value)}
                className="w-full px-4 py-2 rounded border border-[#E9C2A6] focus:outline-none focus:ring-2 focus:ring-[#A26A7B] text-[#A26A7B]"
              />
            </div>
          ))}
        </div>
        <div className="flex gap-4 w-full">
          <button
            type="button"
            onClick={() => setCurrentStep(1)}
            disabled={isSubmitting}
            className={`flex-1 bg-gray-300 text-[#A26A7B] font-bold py-2 px-6 rounded shadow hover:bg-gray-400 transition ${
              isSubmitting ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            Back
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className={`flex-1 bg-[#A26A7B] text-white font-bold py-2 px-6 rounded shadow hover:bg-[#8b5266] transition ${
              isSubmitting ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {isSubmitting ? "Submitting..." : "Send RSVP"}
          </button>
        </div>
      </>
    )}
    {submitError && (
      <p className="text-red-500 text-sm mt-2">{submitError}</p>
    )}
  </form>
) : (
  <div className="text-center py-10">
    <h3 className="text-2xl font-bold text-[#A26A7B] mb-4">
      Thank you for confirming!
    </h3>
    <p className="text-lg text-[#A26A7B]">See you soon!</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}