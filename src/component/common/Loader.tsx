// 'use client';
// import { motion } from 'framer-motion';

// export function BirthdaySpinwheelLoader() {
//   const segments = ['#F87171', '#FBBF24', '#34D399', '#60A5FA', '#A78BFA', '#F472B6'];

//   return (
//     <div className="flex flex-col items-center  justify-center h-screen w-full">
//       <div className="relative w-32 h-32">
//         {segments.map((color, idx) => (
//           <motion.div
//             key={idx}
//             className="absolute w-1/2 h-1/2 origin-bottom-left rounded-tr-full"
//             style={{ backgroundColor: color, top: '50%', left: '50%' }}
//             animate={{ rotate: [0, 360] }}
//             transition={{
//               repeat: Infinity,
//               duration: 2 + idx * 0.3, // slightly staggered speed per segment
//               ease: 'linear',
//             }}
//           />
//         ))}

//         <div className="absolute top-1/2 left-1/2 w-6 h-6 bg-white rounded-full -translate-x-1/2 -translate-y-1/2 shadow-md" />
//       </div>
//       {/* <p className="mt-4 text-sm text-muted-foreground animate-pulse">
//         Loading gifts... spin the wheel!
//       </p> */}
//     </div>
//   );
// }



// 'use client';

// import React from 'react';
// import { Gift } from 'lucide-react';

// export const BirthdaySpinwheelLoader = () => {
//   return (
//     <div className="flex flex-col items-center justify-center h-[300px] w-full">
//       {/* Gift Box Animation */}
//       <div className="relative w-20 h-20 animate-bounce">
//         <div className="absolute inset-0 bg-gradient-to-r from-[#CE1B22] to-[#FF5733] rounded-lg shadow-lg transform rotate-6"></div>
//         <div className="absolute inset-0 bg-gradient-to-r from-[#F7DC6F] to-[#F4D03F] rounded-lg shadow-md animate-pulse"></div>
//         <div className="absolute inset-0 flex items-center justify-center">
//           <Gift className="w-10 h-10 text-white animate-spin-slow" />
//         </div>
//       </div>

//       {/* Loader Text */}
//       <p className="mt-6 text-xl font-bold text-gray-700 animate-pulse">
//         Loading gifts...
//       </p>

//       {/* Sparkles */}
//       <div className="absolute w-full h-full pointer-events-none">
//         {Array.from({ length: 6 }).map((_, idx) => (
//           <span
//             key={idx}
//             className={`absolute w-2 h-2 bg-yellow-400 rounded-full animate-ping`}
//             style={{
//               top: `${Math.random() * 80 + 10}%`,
//               left: `${Math.random() * 80 + 10}%`,
//               animationDelay: `${Math.random() * 1.5}s`,
//             }}
//           />
//         ))}
//       </div>
//     </div>
//   );
// };

'use client';

import React, { useEffect, useState } from 'react';
import { Gift } from 'lucide-react';

export const BirthdaySpinwheelLoader = () => {
  const [sparkles, setSparkles] = useState<{ top: number; left: number; size: number; delay: number }[]>([]);

  useEffect(() => {
    // Generate random sparkles positions for animation
    const generated = Array.from({ length: 6 }).map(() => ({
      top: Math.random() * 60 + 10,
      left: Math.random() * 60 + 10,
      size: Math.random() * 4 + 2,
      delay: Math.random() * 1.5,
    }));
    setSparkles(generated);
  }, []);

  return (
    <div className="relative flex flex-col items-center justify-center w-32 h-32">
      {/* Floating sparkles */}
      {sparkles.map((s, idx) => (
        <span
          key={idx}
          className="absolute bg-red-500 rounded-full opacity-70 animate-ping-slow"
          style={{
            width: `${s.size}px`,
            height: `${s.size}px`,
            top: `${s.top}%`,
            left: `${s.left}%`,
            animationDelay: `${s.delay}s`,
          }}
        />
      ))}

      {/* Gift box */}
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 rounded-lg bg-gradient-to-tr from-gray-300 to-red-500 shadow-lg transform animate-bounce-slow" />

        {/* Ribbon shine */}
        <div className="absolute top-0 left-1/2 w-1 h-full bg-white/30 rounded animate-shimmer" />

        <div className="absolute inset-0 flex items-center justify-center">
          <Gift className="w-8 h-8 text-white animate-pulse-slow" />
        </div>
      </div>

      {/* Loader text */}
      <p className="mt-3 text-gray-600 font-medium text-sm animate-pulse-slow">
        Loading gifts...
      </p>

      {/* Animations */}
      <style jsx>{`
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        .animate-bounce-slow { animation: bounce-slow 1.2s ease-in-out infinite; }

        @keyframes pulse-slow {
          0%, 100% { opacity: 0.7; }
          50% { opacity: 1; }
        }
        .animate-pulse-slow { animation: pulse-slow 1.5s ease-in-out infinite; }

        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-shimmer { animation: shimmer 1s linear infinite; }

        @keyframes ping-slow {
          0% { transform: scale(0.5); opacity: 0.6; }
          50% { transform: scale(1); opacity: 1; }
          100% { transform: scale(0.5); opacity: 0.6; }
        }
        .animate-ping-slow { animation: ping-slow 1.2s ease-in-out infinite; }
      `}</style>
    </div>
  );
};