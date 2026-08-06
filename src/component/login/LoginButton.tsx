"use client";

import { memo } from "react";
import { Loader2 } from "lucide-react";
import { AppButton } from "../common/AppButton";

interface LoginButtonProps {
  loading: boolean;
}

function LoginButton({ loading }: LoginButtonProps) {
  return (
    <AppButton
      type="submit"
      loading={loading}
      className="w-full h-12 rounded-xl bg-[#CE1B22] hover:bg-[#AC141B] text-white font-bold text-base shadow-lg shadow-[#CE1B22]/25 transition-all active:scale-[0.98]"
      icon={
        loading ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : null
      }
    >
      {loading ? "Spinning..." : "Sign In"}
    </AppButton>
  );
}

export default memo(LoginButton);