"use client";
import { useState, useEffect, useRef } from "react";

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
    }, 500);
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

  const handleRsvpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setRsvpSubmitted(true);
  };

  return (
    <div className="relative overflow-x-hidden">
      {/* Petals falling effect - covers first two sections */}
      <div
        ref={petalsContainerRef}
        className="pointer-events-none fixed inset-0 z-20 h-[200vh] overflow-hidden"
      />

      {/* Popup */}
{showPopup && (
  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50">
    <button
      className="absolute top-6 right-8 text-white hover:text-red-400 text-3xl font-bold z-50"
      onClick={handleClosePopup}
      aria-label="Close"
    >
      &times;
    </button>
    
    {/* Container for centered content */}
    <div className="flex flex-col items-center justify-center w-full h-full px-4">
      {/* Text that centers properly on desktop */}
      <div className="text-center mb-4 md:mb-8 w-full max-w-4xl">
        <span
          className={`block text-[32px] sm:text-[60px] md:text-[80px] font-bold text-[#D4B27C] drop-shadow-lg z-10
          ${popupClosing
            ? "opacity-0 animate-invited-fade-out"
            : "opacity-0 animate-invited-fade-down"
          }`}
        >
          You are Invited to <br className="hidden sm:block" />
          a Magical Night!
        </span>
      </div>

      {/* Envelope image with responsive sizing */}
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
      <section
        className="flex flex-col items-center text-white text-center p-10 z-10 min-h-screen bg-no-repeat bg-cover bg-center md:bg-none relative"
        style={{ backgroundImage: "url('/bg.png')" }}
      >
        {/* Card with flower frame background at the very top */}
        <div
          className={`relative z-10  max-w-2xl w-[400px] h-[550px] lg:w-[500px] lg:h-[650px] md:h-[700px] md:w-[500px] bg-contain bg-no-repeat bg-center p-8 sm:p-12 mt-5 transition-opacity duration-1000 ${
            fadeIn ? "opacity-100 fade-in" : "opacity-0"
          }`}
          style={{ 
            backgroundImage: "url('/frameflower.png')",
            backgroundSize: '100% 100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-start', // Changed to flex-start to position at top
            alignItems: 'center'
          }}
        >
          <div className="text-center mt-20"> {/* Added margin-top */}
            <h1 className="text-3xl font-bold mb-6 text-[#A26A7B]">
              Princess RB's
              <br />
              <span className="text-[#A26A7B]">18th Birthday</span>
            </h1>
            <p className="text-lg mb-2 text-[#A26A7B]">
              <span className="font-semibold">Dress Code:</span> Semi-Formal/Cocktail
            </p>
            <p className="text-lg mb-2 text-[#A26A7B]">
              <span className="font-semibold">Location:</span> Subic Park Hotel
            </p>
            <p className="text-lg text-[#A26A7B]">
              <span className="font-semibold">Time:</span> August 23, 2025 @ 4:00 PM
            </p>
          </div>
        </div>

        {/* Countdown Circles - positioned absolutely at bottom */}
        <div
          className={`flex gap-6 justify-center w-full absolute left-0 ${fadeIn ? "opacity-100 fade-in-countdown" : "opacity-0"}`}
          style={{ zIndex: 10, bottom: "5rem" }}
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

 
{/* Second Section */}
<section
  className="w-screen min-h-screen flex flex-col items-center justify-center bg-no-repeat bg-cover bg-center py-16 px-4 relative"
  style={{ backgroundImage: "url('/bg3.png')" }}
>
  <div className="flex flex-col items-center w-full max-w-4xl">
    {/* Text above the map frame - moved higher with mt-[-20px] */}
    <div className="text-center mb-4 md:mb-6 w-full mt-[-20px] md:mt-[-30px]">
      <h2 className="text-3xl md:text-4xl font-bold text-[#A26A7B] mb-2">
        Event Location
      </h2>
      <p className="text-lg md:text-xl text-[#A26A7B] mb-3 font-semibold">
        "A Night to Remember—Here's Where It Happens"
      </p>
      <p className="text-base md:text-lg text-[#A26A7B]">
        Join us for an unforgettable evening at the
        <br />
        <span className="font-bold">Subic Park Hotel</span>
        <br />
        1 Dewey Ave, Subic Bay Freeport Zone, Zambales
      </p>
    </div>

    {/* Map container with flower frame overlay */}
    <div className="relative w-full max-w-[600px] h-[400px] md:h-[500px] mt-4">
      {/* Map base */}
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
      
      {/* Perfectly centered Flower frame overlay */}
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

      {/* Third Section (RSVP) - No petals here */}
      <section className="w-screen min-h-screen flex flex-col items-center justify-center bg-[#fff7f3] py-16 px-4 relative z-10">
        <div className="max-w-lg w-full flex flex-col items-center bg-white/80 rounded-xl shadow-lg py-10 px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-[#A26A7B] mb-2 text-center">
            RSVP
          </h2>
          <p className="text-lg md:text-xl text-[#A26A7B] mb-6 text-center font-semibold">
            We'd love to celebrate with you!
          </p>
          {!rsvpSubmitted ? (
            <form className="w-full flex flex-col gap-4" onSubmit={handleRsvpSubmit}>
              <div>
                <label className="block text-[#A26A7B] font-semibold mb-1" htmlFor="rsvp-name">
                  Full Name
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
                  Number of Guests
                </label>
                <input
                  id="rsvp-guests"
                  type="number"
                  min={1}
                  required
                  value={rsvpGuests}
                  onChange={e => setRsvpGuests(Number(e.target.value))}
                  className="w-full px-4 py-2 rounded border border-[#E9C2A6] focus:outline-none focus:ring-2 focus:ring-[#A26A7B] text-[#A26A7B]"
                />
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
                className="mt-4 bg-[#A26A7B] text-white font-bold py-2 px-6 rounded shadow hover:bg-[#8b5266] transition"
              >
                Send RSVP
              </button>
            </form>
          ) : (
            <div className="text-center py-10">
              <h3 className="text-2xl font-bold text-[#A26A7B] mb-4">Thank you for confirming!</h3>
              <p className="text-lg text-[#A26A7B]">See you soon!</p>
            </div>
          )}
        </div>
      </section>

      <style jsx global>{`
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
      `}</style>
    </div>
  );
}