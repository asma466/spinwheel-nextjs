import { memo } from "react";
import { Eye, EyeOff, Lock } from "lucide-react";
import { Input } from "@/components/ui/input";

interface Props {
    value: string;
    disabled: boolean;
    showPassword: boolean;
    togglePassword: () => void;
    onChange: (value: string) => void;
}

function PasswordInput({
    value,
    disabled,
    showPassword,
    togglePassword,
    onChange,
}: Props) {
    return (
        <div className="space-y-2">

            <label className="text-sm font-semibold">

                Password

            </label>

            <div className="relative">

                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />

                <Input
                    type={showPassword ? "text" : "password"}
                    value={value}
                    disabled={disabled}
                    onChange={(e) => onChange(e.target.value)}
                    className="pl-11 pr-11 h-12 rounded-xl"
                    required
                />

                <button
                    type="button"
                    onClick={togglePassword}
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>

            </div>

        </div>
    );
}

export default memo(PasswordInput);