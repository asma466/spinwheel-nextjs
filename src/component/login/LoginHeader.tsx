import Image from "next/image";
import { memo } from "react";
import { PartyPopper } from "lucide-react";
import {
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/components/ui/card";

function LoginHeader() {
    return (
        <CardHeader className="space-y-4 pt-8 pb-4">

            <div className="flex flex-col items-center gap-4">

                <div className="relative w-40 h-16">
                    <Image
                        src="/logo.png"
                        alt="Zeta Technologies Logo"
                        fill
                        priority
                        quality={80}
                        sizes="160px"
                        className="object-contain"
                    />
                </div>

                <div className="px-4 py-1.5 bg-linear-to-r from-[#CE1B22]/10 to-slate-500/10 border border-[#CE1B22]/20 rounded-full text-xs font-bold uppercase tracking-widest text-[#CE1B22] flex items-center gap-2">

                    <PartyPopper size={16} />

                    Birthday Wheel System

                </div>

            </div>

            <div className="text-center">

                <CardTitle className="text-3xl font-extrabold">

                    Admin Portal

                </CardTitle>

                <CardDescription>

                    Sign in to manage employee birthdays 🎡

                </CardDescription>

            </div>

        </CardHeader>
    );
}

export default memo(LoginHeader);