import Link from "next/link";
import { Star, ArrowRight, Languages, Stethoscope } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

type Doctor = {
  id: string;
  slug: string;
  title: string;
  headline: string;
  yearsExperience: number;
  rating: number;
  reviewCount: number;
  languages: string;
  avatarUrl: string | null;
  user: { name: string };
  specializations: { specialization: { name: string } }[];
};

export function DoctorCard({ doctor }: { doctor: Doctor; index?: number }) {
  return (
    <Link href={`/doctors/${doctor.slug}`} className="group block h-full">
      <Card className="press group h-full overflow-hidden hover:-translate-y-1 hover:shadow-lift">
        <div className="relative h-56 overflow-hidden bg-mist-200">
          {doctor.avatarUrl && (
            <img
              src={doctor.avatarUrl}
              alt={doctor.user.name}
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
          )}
          <div className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-white/95 px-2.5 py-1 text-xs font-semibold text-ink-900 shadow-soft">
            <Star className="size-3 fill-amber-400 text-amber-400" />
            {doctor.rating.toFixed(1)}
            <span className="text-ink-700/60">({doctor.reviewCount})</span>
          </div>
        </div>

        <div className="p-5">
          <div className="flex flex-wrap gap-1.5">
            {doctor.specializations.slice(0, 2).map((s) => (
              <Badge key={s.specialization.name} className="text-[10px]">
                {s.specialization.name}
              </Badge>
            ))}
          </div>
          <h3 className="mt-3 font-display text-lg font-semibold leading-tight text-ink-900">
            {doctor.title} {doctor.user.name.replace(/^Dr\.\s+|^Prof\.\s+Dr\.\s+/, "")}
          </h3>
          <p className="mt-1 line-clamp-2 text-sm text-ink-700/70">{doctor.headline}</p>

          <div className="mt-4 flex flex-wrap gap-3 text-xs text-ink-700/65">
            <span className="flex items-center gap-1">
              <Stethoscope className="size-3.5" />
              {doctor.yearsExperience}+ yrs
            </span>
            <span className="flex items-center gap-1">
              <Languages className="size-3.5" />
              {doctor.languages.split(",").slice(0, 2).join(", ")}
            </span>
          </div>

          <div className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-iris-700">
            View profile
            <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-1" />
          </div>
        </div>
      </Card>
    </Link>
  );
}
