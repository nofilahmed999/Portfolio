import React from 'react';

const SignatureLoader = ({ isFadingOut }) => {
  return (
    <div 
      className={`fixed inset-0 z-[9999] flex h-screen w-full items-center justify-center bg-[#2e1065] text-white transition-all duration-1000 ease-in-out ${
        isFadingOut 
          ? 'opacity-0 -translate-y-full pointer-events-none' 
          : 'opacity-100 translate-y-0'
      }`}
    >
      <style>{`
        @keyframes drawSignature {
          0% {
            stroke-dashoffset: 3000;
          }
          100% {
            stroke-dashoffset: 0;
          }
        }
        .animate-nofil-sign {
          stroke-dasharray: 3000;
          stroke-dashoffset: 3000;
          animation: drawSignature 2.2s ease-in-out forwards;
        }
      `}</style>

      <div className="flex items-center justify-center w-full h-full p-4">
        <svg
          className="w-80 h-40 sm:w-96 sm:h-48 md:w-[550px] md:h-[260px] drop-shadow-[0_0_20px_rgba(255,255,255,0.4)]"
          viewBox="0 0 650 250"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Centered White "Nofil" Signature Path */}
          <path
            className="animate-nofil-sign"
            d="M 70 170 L 70 50 L 140 170 L 140 50 C 165 90, 205 90, 205 130 C 205 165, 165 165, 165 130 C 165 105, 195 105, 215 105 C 235 105, 255 45, 255 25 C 245 25, 225 115, 225 185 C 225 215, 245 205, 255 165 L 265 120 C 275 120, 285 125, 285 160 C 285 165, 295 165, 305 155 C 315 125, 325 45, 330 35 C 330 30, 320 30, 315 75 L 315 160 C 315 165, 325 165, 340 155 M 287 90 L 287 96 M 45 190 C 180 175, 330 195, 490 160"
            stroke="#ffffff"
            strokeWidth="7"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </div>
  );
};

export default SignatureLoader;