import { User } from "lucide-react";
import { ProfileFormStatic } from "@/components/profil/ProfileFormStatic";

export default function ProfilPage() {
  return (
    <div className="flex flex-col gap-4 px-4 pt-6">
      <div className="flex items-center gap-3">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <User className="size-5" />
        </span>
        <h1 className="text-lg font-bold tracking-tight">Profil</h1>
      </div>
      <ProfileFormStatic />
    </div>
  );
}
