'use client';
import { motion } from 'framer-motion';

export function BirthdaySpinwheelLoader() {
  const segments = ['#F87171', '#FBBF24', '#34D399', '#60A5FA', '#A78BFA', '#F472B6'];

  return (
    <div className="flex flex-col items-center  justify-center h-screen w-full">
      <div className="relative w-32 h-32">
        {segments.map((color, idx) => (
          <motion.div
            key={idx}
            className="absolute w-1/2 h-1/2 origin-bottom-left rounded-tr-full"
            style={{ backgroundColor: color, top: '50%', left: '50%' }}
            animate={{ rotate: [0, 360] }}
            transition={{
              repeat: Infinity,
              duration: 2 + idx * 0.3, // slightly staggered speed per segment
              ease: 'linear',
            }}
          />
        ))}

        <div className="absolute top-1/2 left-1/2 w-6 h-6 bg-white rounded-full -translate-x-1/2 -translate-y-1/2 shadow-md" />
      </div>
      {/* <p className="mt-4 text-sm text-muted-foreground animate-pulse">
        Loading gifts... spin the wheel!
      </p> */}
    </div>
  );
}