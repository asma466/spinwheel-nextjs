import { memo } from "react";
import { Mail } from "lucide-react";
import { Input } from "@/components/ui/input";

interface Props {
    value: string;
    disabled: boolean;
    onChange: (value: string) => void;
}

function EmailInput({
    value,
    disabled,
    onChange,
}: Props) {
    return (
        <div className="space-y-2">

            <label className="text-sm font-semibold">

                Email Address

            </label>

            <div className="relative">

                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />

                <Input
                    type="email"
                    value={value}
                    disabled={disabled}
                    onChange={(e) => onChange(e.target.value)}
                    className="pl-11 h-12 rounded-xl"
                    required
                />

            </div>

        </div>
    );
}

export default memo(EmailInput);