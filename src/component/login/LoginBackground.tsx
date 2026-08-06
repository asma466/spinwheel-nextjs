import { memo } from "react";

function LoginBackground() {
  return (
    <>
      {/* Glow */}
      <div className="hidden lg:block absolute top-[10%] left-[15%] w-100 h-100 bg-[#CE1B22]/10 rounded-full blur-[80px] -translate-x-1/2 -translate-y-1/2 mix-blend-multiply" />

      <div className="hidden lg:block absolute bottom-[10%] right-[10%] w-125 h-125 bg-slate-500/10 rounded-full blur-[100px] translate-x-1/2 translate-y-1/2 mix-blend-multiply" />

      {/* Wheels */}
      <div className="absolute w-225 h-225 border-40 border-dashed border-[#CE1B22]/5 rounded-full animate-[spin_80s_linear_infinite] pointer-events-none" />

      <div className="absolute w-150 h-150 border-20 border-dashed border-slate-500/15 rounded-full animate-[spin_50s_linear_infinite_reverse] pointer-events-none" />
    </>
  );
}

export default memo(LoginBackground);