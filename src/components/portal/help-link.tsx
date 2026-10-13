import { HelpIcon } from "@/components/icons";

export function HelpLink() {
  return (
    <a
      href="#"
      className="flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
    >
      <HelpIcon className="h-5 w-5" />
      <span className="hidden sm:inline">Help</span>
    </a>
  );
}
