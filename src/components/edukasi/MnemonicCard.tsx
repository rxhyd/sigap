import { cn } from "@/lib/utils";
import type { EdukasiMnemonic } from "@/lib/types/edukasi";

export type MnemonicTone = {
  chip: string;
  panel: string;
  reminder: string;
};

export function MnemonicCard({ mnemonic, tone }: { mnemonic: EdukasiMnemonic; tone: MnemonicTone }) {
  return (
    <div className={cn("flex flex-col gap-3 rounded-xl border p-3", tone.panel)}>
      <div className="flex flex-col gap-1.5">
        <span className="text-[11px] font-semibold tracking-wide text-muted-foreground uppercase">
          Ingat singkatannya
        </span>
        <div className="flex flex-wrap gap-1" aria-label={mnemonic.acronym}>
          {mnemonic.acronym.split("").map((char, index) => (
            <span
              key={index}
              aria-hidden
              className={cn("flex size-9 items-center justify-center rounded-lg text-lg font-extrabold", tone.chip)}
            >
              {char}
            </span>
          ))}
        </div>
      </div>

      <ol className="flex flex-col gap-2.5">
        {mnemonic.steps.map((step, index) => (
          <li key={index} className="flex items-start gap-2.5">
            <span
              className={cn(
                "flex size-6 shrink-0 items-center justify-center rounded-md text-xs font-bold",
                tone.chip
              )}
            >
              {step.letter}
            </span>
            <div className="flex min-w-0 flex-col">
              <span className="text-sm leading-snug font-semibold">{step.title}</span>
              {step.detail && <span className="text-xs text-muted-foreground">{step.detail}</span>}
            </div>
          </li>
        ))}
      </ol>

      {mnemonic.reminder && (
        <p className={cn("rounded-lg px-3 py-2 text-xs font-semibold", tone.reminder)}>
          Ingat: {mnemonic.reminder}
        </p>
      )}
    </div>
  );
}
