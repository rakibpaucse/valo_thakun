import {
  Activity, Baby, Bone, Brain, ClipboardCheck, Flower2, Heart, Sparkles, Stethoscope, Video,
  type LucideIcon,
} from "lucide-react";

const map: Record<string, LucideIcon> = {
  Activity, Baby, Bone, Brain, ClipboardCheck, Flower2, Heart, Sparkles, Stethoscope, Video,
};

export function ServiceIcon({ name, className }: { name?: string | null; className?: string }) {
  const Icon = (name && map[name]) || Stethoscope;
  return <Icon className={className} />;
}
