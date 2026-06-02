import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

// ─── helpers ─────────────────────────────────────────────────────────
const slugify = (s: string) =>
  s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

const dayOffset = (n: number) => {
  const d = new Date();
  d.setDate(d.getDate() + n);
  d.setHours(0, 0, 0, 0);
  return d;
};

const at = (date: Date, time: string) => {
  const [h, m] = time.split(":").map(Number);
  const d = new Date(date);
  d.setHours(h, m, 0, 0);
  return d;
};

async function main() {
  console.log("🌱  Seeding database…");

  // ── wipe (order matters due to FKs) ──
  await prisma.reaction.deleteMany();
  await prisma.comment.deleteMany();
  await prisma.postTag.deleteMany();
  await prisma.postCategory.deleteMany();
  await prisma.post.deleteMany();
  await prisma.tag.deleteMany();
  await prisma.category.deleteMany();
  await prisma.appointment.deleteMany();
  await prisma.slotOverride.deleteMany();
  await prisma.timeOff.deleteMany();
  await prisma.workingHours.deleteMany();
  await prisma.doctorService.deleteMany();
  await prisma.service.deleteMany();
  await prisma.galleryImage.deleteMany();
  await prisma.credential.deleteMany();
  await prisma.doctorSpecialization.deleteMany();
  await prisma.specialization.deleteMany();
  await prisma.doctor.deleteMany();
  await prisma.patient.deleteMany();
  await prisma.contactMessage.deleteMany();
  await prisma.newsletterSignup.deleteMany();
  await prisma.session.deleteMany();
  await prisma.account.deleteMany();
  await prisma.user.deleteMany();

  // ── specializations ──
  const specsData = [
    { name: "Cardiology", iconKey: "Heart", description: "Heart and cardiovascular system care." },
    { name: "Internal Medicine", iconKey: "Stethoscope", description: "General adult medical care." },
    { name: "Dermatology", iconKey: "Sparkles", description: "Skin, hair, and nail conditions." },
    { name: "Pediatrics", iconKey: "Baby", description: "Healthcare for infants, children, and teens." },
    { name: "Orthopedics", iconKey: "Bone", description: "Bone, joint, and musculoskeletal care." },
    { name: "Psychiatry", iconKey: "Brain", description: "Mental health and behavioral care." },
    { name: "Gynecology", iconKey: "Flower2", description: "Women's reproductive health." },
    { name: "Endocrinology", iconKey: "Activity", description: "Hormonal and metabolic conditions like diabetes." },
  ];
  const specs = await Promise.all(
    specsData.map((s) =>
      prisma.specialization.create({
        data: { ...s, slug: slugify(s.name) },
      }),
    ),
  );
  const specBySlug = Object.fromEntries(specs.map((s) => [s.slug, s]));

  // ── services ──
  const servicesData = [
    {
      name: "General Consultation",
      description: "A thorough evaluation of your overall health and any current concerns.",
      durationMinutes: 30,
      price: 1200,
      iconKey: "Stethoscope",
      isFeatured: true,
      specSlug: "internal-medicine",
      image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&q=80",
    },
    {
      name: "Cardiac Checkup",
      description: "Comprehensive cardiovascular assessment with ECG and risk profiling.",
      durationMinutes: 45,
      price: 2500,
      iconKey: "Heart",
      isFeatured: true,
      specSlug: "cardiology",
      image: "https://images.unsplash.com/photo-1559757175-5700dde675bc?w=800&q=80",
    },
    {
      name: "Skin Consultation",
      description: "Diagnosis and treatment plan for acne, eczema, pigmentation, and more.",
      durationMinutes: 30,
      price: 1500,
      iconKey: "Sparkles",
      isFeatured: true,
      specSlug: "dermatology",
      image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=800&q=80",
    },
    {
      name: "Pediatric Visit",
      description: "Wellness checks, vaccinations, and care for childhood illnesses.",
      durationMinutes: 30,
      price: 1500,
      iconKey: "Baby",
      isFeatured: true,
      specSlug: "pediatrics",
      image: "https://images.unsplash.com/photo-1581595220892-b0739db3ba8c?w=800&q=80",
    },
    {
      name: "Joint Pain Assessment",
      description: "Evaluation of joint, back, and musculoskeletal pain with imaging review.",
      durationMinutes: 40,
      price: 2000,
      iconKey: "Bone",
      isFeatured: false,
      specSlug: "orthopedics",
      image: "https://images.unsplash.com/photo-1607619056574-7b8d3ee536b2?w=800&q=80",
    },
    {
      name: "Mental Health Consultation",
      description: "Confidential assessment for anxiety, depression, sleep, and stress.",
      durationMinutes: 50,
      price: 2500,
      iconKey: "Brain",
      isFeatured: false,
      specSlug: "psychiatry",
      image: "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800&q=80",
    },
    {
      name: "Diabetes Management",
      description: "Blood sugar review, lifestyle planning, and medication adjustment.",
      durationMinutes: 30,
      price: 1500,
      iconKey: "Activity",
      isFeatured: true,
      specSlug: "endocrinology",
      image: "https://images.unsplash.com/photo-1579154204601-01588f351e67?w=800&q=80",
    },
    {
      name: "Online Telehealth",
      description: "Secure video consultation from anywhere — same care, no commute.",
      durationMinutes: 25,
      price: 1000,
      iconKey: "Video",
      isFeatured: true,
      specSlug: "internal-medicine",
      image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&q=80",
    },
    {
      name: "Annual Health Checkup",
      description: "Full-body screening package including labs, ECG, and personalized report.",
      durationMinutes: 90,
      price: 4500,
      iconKey: "ClipboardCheck",
      isFeatured: false,
      specSlug: "internal-medicine",
      image: "https://images.unsplash.com/photo-1551601651-2a8555f1a136?w=800&q=80",
    },
  ];

  const services = await Promise.all(
    servicesData.map((s) =>
      prisma.service.create({
        data: {
          name: s.name,
          slug: slugify(s.name),
          description: s.description,
          durationMinutes: s.durationMinutes,
          bufferMinutes: 5,
          price: s.price,
          iconKey: s.iconKey,
          isFeatured: s.isFeatured,
          imageUrl: s.image,
          specializationId: specBySlug[s.specSlug]?.id,
        },
      }),
    ),
  );
  const serviceBySlug = Object.fromEntries(services.map((s) => [s.slug, s]));

  // ── users + doctors ──
  const password = await bcrypt.hash("password123", 10);

  type DoctorSeed = {
    name: string;
    email: string;
    title: string;
    headline: string;
    bio: string;
    yearsExperience: number;
    languages: string;
    consultationFee: number;
    isMain?: boolean;
    avatar: string;
    cover: string;
    phone: string;
    whatsapp: string;
    rating: number;
    reviewCount: number;
    specSlugs: string[];
    serviceSlugs: string[];
    credentials: { kind: string; title: string; institution: string; location?: string; yearStart?: number; yearEnd?: number; description?: string }[];
    workingHours: { weekday: number; startTime: string; endTime: string }[];
    gallery?: { url: string; caption: string }[];
  };

  const doctorsSeed: DoctorSeed[] = [
    {
      name: "Dr. Anisul Karim",
      email: "anis@anisbhai.health",
      title: "Prof. Dr.",
      headline: "Senior Cardiologist & Internist • 22+ years caring for hearts",
      bio: `For over two decades I have walked alongside patients on their heart-health journey — from anxious first visits to long-term recovery. My practice blends evidence-based cardiology with the time and attention every patient deserves.\n\nI completed my MBBS from Dhaka Medical College, my MD in Internal Medicine from BSMMU, and pursued advanced fellowship training in Interventional Cardiology in Berlin under the German Approbation programme. Today I see patients in Dhaka while continuing collaborative research with European centres.\n\nMy belief is simple: a calm, well-informed patient is the best partner in any treatment plan.`,
      yearsExperience: 22,
      languages: "English,Bangla,German,Hindi",
      consultationFee: 2500,
      isMain: true,
      avatar: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&q=80",
      cover: "https://images.unsplash.com/photo-1631815589968-fdb09a223b1e?w=1600&q=80",
      phone: "+880 1711-000001",
      whatsapp: "+880 1711-000001",
      rating: 4.9,
      reviewCount: 412,
      specSlugs: ["cardiology", "internal-medicine"],
      serviceSlugs: ["general-consultation", "cardiac-checkup", "online-telehealth", "annual-health-checkup", "diabetes-management"],
      credentials: [
        { kind: "EDUCATION", title: "MBBS", institution: "Dhaka Medical College", location: "Dhaka, BD", yearStart: 1998, yearEnd: 2003 },
        { kind: "EDUCATION", title: "MD, Internal Medicine", institution: "BSMMU", location: "Dhaka, BD", yearStart: 2005, yearEnd: 2009 },
        { kind: "CERTIFICATION", title: "German Approbation (Approbationsordnung)", institution: "Charité — Universitätsmedizin Berlin", location: "Berlin, DE", yearStart: 2011, yearEnd: 2012 },
        { kind: "CERTIFICATION", title: "Fellowship in Interventional Cardiology", institution: "Deutsches Herzzentrum", location: "Berlin, DE", yearStart: 2012, yearEnd: 2014 },
        { kind: "POSITION", title: "Senior Consultant Cardiologist", institution: "Square Hospitals Ltd.", location: "Dhaka, BD", yearStart: 2015, description: "Leading the outpatient cardiac wellness programme." },
        { kind: "POSITION", title: "Visiting Faculty", institution: "BSMMU Department of Cardiology", location: "Dhaka, BD", yearStart: 2016 },
        { kind: "AWARD", title: "Best Cardiologist (Patient Choice)", institution: "BD Health Awards", yearStart: 2022 },
      ],
      workingHours: [
        { weekday: 0, startTime: "09:00", endTime: "13:00" }, // Sun
        { weekday: 1, startTime: "09:00", endTime: "13:00" },
        { weekday: 2, startTime: "16:00", endTime: "20:00" },
        { weekday: 3, startTime: "09:00", endTime: "13:00" },
        { weekday: 4, startTime: "16:00", endTime: "20:00" },
        { weekday: 6, startTime: "10:00", endTime: "14:00" }, // Sat
      ],
      gallery: [
        { url: "https://images.unsplash.com/photo-1551190822-a9333d879b1f?w=800&q=80", caption: "Consultation room" },
        { url: "https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=800&q=80", caption: "ECG screening" },
        { url: "https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?w=800&q=80", caption: "Patient education session" },
        { url: "https://images.unsplash.com/photo-1559757175-5700dde675bc?w=800&q=80", caption: "Modern facility" },
      ],
    },
    {
      name: "Dr. Farhana Rahman",
      email: "farhana@anisbhai.health",
      title: "Dr.",
      headline: "Consultant Dermatologist • Skin you can feel confident in",
      bio: `I treat skin concerns with science and warmth — never with shame. My focus areas are acne, melasma, hair loss, and laser-based skin rejuvenation.`,
      yearsExperience: 11,
      languages: "English,Bangla",
      consultationFee: 1800,
      avatar: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=400&q=80",
      cover: "https://images.unsplash.com/photo-1666214280557-f1b5022eb634?w=1600&q=80",
      phone: "+880 1711-000002",
      whatsapp: "+880 1711-000002",
      rating: 4.8,
      reviewCount: 187,
      specSlugs: ["dermatology"],
      serviceSlugs: ["skin-consultation", "general-consultation"],
      credentials: [
        { kind: "EDUCATION", title: "MBBS", institution: "Sir Salimullah Medical College", location: "Dhaka, BD", yearStart: 2008, yearEnd: 2013 },
        { kind: "EDUCATION", title: "FCPS, Dermatology", institution: "BCPS", location: "Dhaka, BD", yearStart: 2015, yearEnd: 2018 },
        { kind: "CERTIFICATION", title: "Advanced Aesthetic Dermatology", institution: "AAD", location: "Online", yearStart: 2020 },
        { kind: "POSITION", title: "Consultant Dermatologist", institution: "Anis Bhai Practice", location: "Dhaka, BD", yearStart: 2019 },
      ],
      workingHours: [
        { weekday: 1, startTime: "10:00", endTime: "14:00" },
        { weekday: 2, startTime: "10:00", endTime: "14:00" },
        { weekday: 3, startTime: "15:00", endTime: "19:00" },
        { weekday: 5, startTime: "10:00", endTime: "13:00" },
      ],
    },
    {
      name: "Dr. Tanvir Hossain",
      email: "tanvir@anisbhai.health",
      title: "Dr.",
      headline: "Pediatrician • Gentle care for the smallest patients",
      bio: `From newborn check-ups to teenage health, I work closely with families to make every visit reassuring — for the child and the parents.`,
      yearsExperience: 9,
      languages: "English,Bangla",
      consultationFee: 1500,
      avatar: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400&q=80",
      cover: "https://images.unsplash.com/photo-1581595220892-b0739db3ba8c?w=1600&q=80",
      phone: "+880 1711-000003",
      whatsapp: "+880 1711-000003",
      rating: 4.9,
      reviewCount: 244,
      specSlugs: ["pediatrics"],
      serviceSlugs: ["pediatric-visit", "general-consultation", "online-telehealth"],
      credentials: [
        { kind: "EDUCATION", title: "MBBS", institution: "Chittagong Medical College", yearStart: 2010, yearEnd: 2015 },
        { kind: "EDUCATION", title: "DCH (Pediatrics)", institution: "BCPS", yearStart: 2017, yearEnd: 2019 },
        { kind: "POSITION", title: "Consultant Pediatrician", institution: "Anis Bhai Practice", yearStart: 2020 },
      ],
      workingHours: [
        { weekday: 0, startTime: "10:00", endTime: "13:00" },
        { weekday: 2, startTime: "10:00", endTime: "13:00" },
        { weekday: 4, startTime: "10:00", endTime: "13:00" },
        { weekday: 6, startTime: "16:00", endTime: "20:00" },
      ],
    },
    {
      name: "Dr. Sanjida Akter",
      email: "sanjida@anisbhai.health",
      title: "Dr.",
      headline: "Psychiatrist • A safe space for your mind",
      bio: `I specialise in anxiety, depression, sleep disorders and burnout. Sessions are confidential, judgement-free, and tailored to you.`,
      yearsExperience: 8,
      languages: "English,Bangla,Hindi",
      consultationFee: 2500,
      avatar: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&q=80",
      cover: "https://images.unsplash.com/photo-1521791136064-7986c2920216?w=1600&q=80",
      phone: "+880 1711-000004",
      whatsapp: "+880 1711-000004",
      rating: 4.9,
      reviewCount: 156,
      specSlugs: ["psychiatry"],
      serviceSlugs: ["mental-health-consultation", "online-telehealth"],
      credentials: [
        { kind: "EDUCATION", title: "MBBS", institution: "Dhaka Medical College", yearStart: 2009, yearEnd: 2014 },
        { kind: "EDUCATION", title: "MD, Psychiatry", institution: "BSMMU", yearStart: 2017, yearEnd: 2020 },
        { kind: "POSITION", title: "Consultant Psychiatrist", institution: "Anis Bhai Practice", yearStart: 2021 },
      ],
      workingHours: [
        { weekday: 1, startTime: "16:00", endTime: "20:00" },
        { weekday: 3, startTime: "16:00", endTime: "20:00" },
        { weekday: 5, startTime: "10:00", endTime: "14:00" },
      ],
    },
    {
      name: "Dr. Mahmudul Islam",
      email: "mahmud@anisbhai.health",
      title: "Dr.",
      headline: "Orthopedic Surgeon • Get moving again, pain-free",
      bio: `Specialising in joint pain, sports injuries, and minimally invasive arthroscopic surgery. Most consultations end with a clear, do-able home plan.`,
      yearsExperience: 14,
      languages: "English,Bangla",
      consultationFee: 2000,
      avatar: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=400&q=80",
      cover: "https://images.unsplash.com/photo-1607619056574-7b8d3ee536b2?w=1600&q=80",
      phone: "+880 1711-000005",
      whatsapp: "+880 1711-000005",
      rating: 4.7,
      reviewCount: 198,
      specSlugs: ["orthopedics"],
      serviceSlugs: ["joint-pain-assessment", "general-consultation"],
      credentials: [
        { kind: "EDUCATION", title: "MBBS", institution: "Sylhet MAG Osmani Medical College", yearStart: 2003, yearEnd: 2008 },
        { kind: "EDUCATION", title: "MS, Orthopedic Surgery", institution: "BSMMU", yearStart: 2011, yearEnd: 2014 },
        { kind: "POSITION", title: "Consultant Orthopedic Surgeon", institution: "Anis Bhai Practice", yearStart: 2016 },
      ],
      workingHours: [
        { weekday: 0, startTime: "16:00", endTime: "20:00" },
        { weekday: 2, startTime: "09:00", endTime: "13:00" },
        { weekday: 4, startTime: "09:00", endTime: "13:00" },
        { weekday: 6, startTime: "10:00", endTime: "14:00" },
      ],
    },
  ];

  const doctors: { id: string; userId: string; slug: string; isMain: boolean }[] = [];
  for (const d of doctorsSeed) {
    const user = await prisma.user.create({
      data: {
        name: d.name,
        email: d.email,
        passwordHash: password,
        role: "DOCTOR",
        image: d.avatar,
        emailVerified: new Date(),
      },
    });
    const doctor = await prisma.doctor.create({
      data: {
        userId: user.id,
        slug: slugify(d.name.replace(/^Dr\.\s+|^Prof\.\s+Dr\.\s+/, "")),
        title: d.title,
        headline: d.headline,
        bio: d.bio,
        yearsExperience: d.yearsExperience,
        languages: d.languages,
        consultationFee: d.consultationFee,
        isMain: d.isMain ?? false,
        avatarUrl: d.avatar,
        coverUrl: d.cover,
        phone: d.phone,
        whatsapp: d.whatsapp,
        rating: d.rating,
        reviewCount: d.reviewCount,
        specializations: {
          create: d.specSlugs.map((slug) => ({
            specialization: { connect: { slug } },
          })),
        },
        services: {
          create: d.serviceSlugs.map((slug) => ({
            service: { connect: { slug } },
          })),
        },
        credentials: {
          create: d.credentials.map((c, i) => ({ ...c, order: i })),
        },
        workingHours: {
          create: d.workingHours,
        },
        galleryImages: d.gallery
          ? { create: d.gallery.map((g, i) => ({ url: g.url, caption: g.caption, order: i })) }
          : undefined,
      },
    });
    doctors.push({ id: doctor.id, userId: user.id, slug: doctor.slug, isMain: doctor.isMain });
  }

  const mainDoctor = doctors.find((d) => d.isMain)!;

  // ── admin user (also acts as receptionist) ──
  await prisma.user.create({
    data: {
      name: "Practice Admin",
      email: "admin@anisbhai.health",
      passwordHash: password,
      role: "ADMIN",
      emailVerified: new Date(),
    },
  });

  // ── patients ──
  const patientsSeed = [
    { name: "Rashed Ahmed", email: "rashed@example.com", phone: "+880 1812-111111", gender: "Male", dob: "1985-04-12" },
    { name: "Nadia Sultana", email: "nadia@example.com", phone: "+880 1812-222222", gender: "Female", dob: "1992-09-22" },
    { name: "Imran Hossain", email: "imran@example.com", phone: "+880 1812-333333", gender: "Male", dob: "1978-01-05" },
    { name: "Tahmina Begum", email: "tahmina@example.com", phone: "+880 1812-444444", gender: "Female", dob: "1965-11-30" },
    { name: "Sabbir Khan", email: "sabbir@example.com", phone: "+880 1812-555555", gender: "Male", dob: "1995-07-18" },
  ];

  const patients: { id: string; userId: string; name: string }[] = [];
  for (const p of patientsSeed) {
    const user = await prisma.user.create({
      data: {
        name: p.name,
        email: p.email,
        passwordHash: password,
        role: "PATIENT",
        emailVerified: new Date(),
      },
    });
    const patient = await prisma.patient.create({
      data: {
        userId: user.id,
        phone: p.phone,
        gender: p.gender,
        dateOfBirth: new Date(p.dob),
      },
    });
    patients.push({ id: patient.id, userId: user.id, name: p.name });
  }

  // ── appointments (mix of past + upcoming) ──
  const apptSeed = [
    // past — completed
    { offset: -14, time: "09:30", doctor: 0, service: "cardiac-checkup", patient: 0, status: "COMPLETED", notes: "BP slightly elevated; recheck in 4 weeks." },
    { offset: -10, time: "10:00", doctor: 0, service: "general-consultation", patient: 1, status: "COMPLETED", notes: "Routine follow-up; labs ordered." },
    { offset: -7, time: "16:30", doctor: 1, service: "skin-consultation", patient: 2, status: "COMPLETED", notes: "Acne flare; topical regimen prescribed." },
    { offset: -5, time: "11:00", doctor: 2, service: "pediatric-visit", patient: 3, status: "NO_SHOW" },
    { offset: -3, time: "16:00", doctor: 3, service: "mental-health-consultation", patient: 4, status: "COMPLETED", notes: "Sleep hygiene plan started." },
    // upcoming
    { offset: 1, time: "10:00", doctor: 0, service: "cardiac-checkup", patient: 0, status: "CONFIRMED", notes: "Follow-up on hypertension." },
    { offset: 2, time: "11:00", doctor: 0, service: "annual-health-checkup", patient: 1, status: "CONFIRMED" },
    { offset: 2, time: "10:30", doctor: 1, service: "skin-consultation", patient: 2, status: "CONFIRMED" },
    { offset: 3, time: "17:00", doctor: 0, service: "general-consultation", patient: 3, status: "CONFIRMED" },
    { offset: 4, time: "10:30", doctor: 2, service: "pediatric-visit", patient: 4, status: "CONFIRMED" },
    { offset: 5, time: "16:30", doctor: 3, service: "mental-health-consultation", patient: 0, status: "CONFIRMED" },
    { offset: 6, time: "11:00", doctor: 4, service: "joint-pain-assessment", patient: 1, status: "CONFIRMED" },
    { offset: 7, time: "09:30", doctor: 0, service: "diabetes-management", patient: 2, status: "PENDING" },
  ];

  for (const a of apptSeed) {
    const doctor = doctors[a.doctor];
    const service = serviceBySlug[a.service];
    const patient = patients[a.patient];
    const start = at(dayOffset(a.offset), a.time);
    const end = new Date(start.getTime() + service.durationMinutes * 60 * 1000);
    await prisma.appointment.create({
      data: {
        doctorId: doctor.id,
        serviceId: service.id,
        patientId: patient.id,
        startsAt: start,
        endsAt: end,
        status: a.status,
        notes: a.notes,
      },
    });
  }

  // ── time off ──
  await prisma.timeOff.create({
    data: {
      doctorId: doctors[0].id,
      startsAt: dayOffset(10),
      endsAt: dayOffset(13),
      reason: "Conference in Singapore",
    },
  });

  // ── blog ──
  const categoriesData = [
    { name: "Heart Health", slug: "heart-health" },
    { name: "Mental Wellness", slug: "mental-wellness" },
    { name: "Pediatrics", slug: "pediatrics" },
    { name: "Skin Care", slug: "skin-care" },
    { name: "Diabetes", slug: "diabetes" },
    { name: "Lifestyle", slug: "lifestyle" },
  ];
  const categories = await Promise.all(categoriesData.map((c) => prisma.category.create({ data: c })));
  const catBySlug = Object.fromEntries(categories.map((c) => [c.slug, c]));

  const tagsData = ["prevention", "diet", "exercise", "stress", "vaccination", "screening", "summer", "myth-busting"];
  const tags = await Promise.all(
    tagsData.map((t) => prisma.tag.create({ data: { name: t, slug: slugify(t) } })),
  );
  const tagBySlug = Object.fromEntries(tags.map((t) => [t.slug, t]));

  const postsData = [
    {
      title: "5 warning signs your heart needs attention",
      excerpt: "Heart disease often whispers before it shouts. Here are the early signals you should never ignore — and what to do about each one.",
      cover: "https://images.unsplash.com/photo-1559757175-5700dde675bc?w=1200&q=80",
      author: 0,
      categories: ["heart-health"],
      tags: ["prevention", "screening"],
      readingMinutes: 6,
      publishedDaysAgo: 3,
      content: `# 5 warning signs your heart needs attention\n\nHeart disease is the leading cause of death in Bangladesh and worldwide — yet most early warning signs are quiet, easy to dismiss, and easily mistaken for stress or fatigue.\n\nHere are five signals I take very seriously in my clinic.\n\n## 1. Chest discomfort that comes with effort\n\nIf walking up stairs, brisk walking, or carrying groceries causes pressure, tightness, or a 'heavy' feeling in the chest — and it goes away when you rest — this is *exertional angina* until proven otherwise. It is a hallmark of reduced blood flow to the heart.\n\n## 2. Unusual breathlessness\n\nFeeling out of breath doing things you used to do easily is not 'just getting older'. It can be the heart's first signal that it's struggling to pump efficiently.\n\n## 3. Swollen ankles by evening\n\nFluid that pools in the lower legs by night and improves by morning can be a sign of heart failure, especially when paired with weight gain over a few days.\n\n## 4. Palpitations or irregular heartbeats\n\nAn occasional skipped beat is usually harmless. Frequent, prolonged, or sudden episodes — especially with dizziness — deserve an ECG.\n\n## 5. Fatigue that doesn't lift\n\nThis is the most under-appreciated symptom. Profound, daily fatigue that rest doesn't fix can be a marker of underlying cardiac issues, particularly in women.\n\n## What to do\n\nNone of these symptoms alone is a diagnosis. But any of them, especially after age 40 or with risk factors (diabetes, smoking, family history), is a strong reason to book a cardiac evaluation. A focused 45-minute consultation with an ECG and risk profile is enough to either reassure you, or to catch a problem while it is still small and very treatable.`,
    },
    {
      title: "Diabetes in Bangladesh: prevention and care",
      excerpt: "Why diabetes is rising so fast in our country, what risk factors to watch for, and the daily habits that genuinely move the needle.",
      cover: "https://images.unsplash.com/photo-1579154204601-01588f351e67?w=1200&q=80",
      author: 0,
      categories: ["diabetes", "lifestyle"],
      tags: ["prevention", "diet", "exercise"],
      readingMinutes: 7,
      publishedDaysAgo: 9,
      content: `# Diabetes in Bangladesh: prevention and care\n\nMore than 13 million Bangladeshi adults live with diabetes today, and that number is projected to keep rising. The good news: a large proportion of type-2 diabetes is preventable, and even after diagnosis, life can remain rich, active, and long.\n\n## Why is it rising so fast?\n\nThree forces are at play in our country: rapid urbanisation has reduced daily physical activity, our diet has shifted toward more refined carbohydrates and sugar, and we carry a strong genetic susceptibility as South Asians. Together they create a near-perfect setup for insulin resistance.\n\n## Who should be screened?\n\nAny adult over 35 should have a fasting blood sugar checked at least every two years. If you have a family history, are overweight, or had gestational diabetes, screening should start earlier and be more frequent.\n\n## What actually works\n\nThree things, done consistently, account for most of the benefit I see in my patients:\n\n1. **30 minutes of brisk walking, most days.** It doesn't need to be a gym. A walk before breakfast or after dinner is enormously effective.\n2. **Cutting sugary drinks to zero.** This single change often drops HbA1c by 0.5–1.0%.\n3. **Half your plate as vegetables, every meal.** Crowd out the rice rather than counting calories.\n\nMedication, when prescribed, makes these changes easier — not optional.`,
    },
    {
      title: "When should you take your child to a pediatrician?",
      excerpt: "A parent's guide to the symptoms that warrant a clinic visit, the ones that need urgent care, and the ones you can safely watch at home.",
      cover: "https://images.unsplash.com/photo-1581595220892-b0739db3ba8c?w=1200&q=80",
      author: 2,
      categories: ["pediatrics"],
      tags: ["vaccination", "prevention"],
      readingMinutes: 5,
      publishedDaysAgo: 14,
      content: `# When should you take your child to a pediatrician?\n\nParents often ask me: 'How do I know when this is serious?' Here is a simple framework I share in clinic.\n\n## Watch at home\n\nMild cough, runny nose, low-grade fever, occasional loose stools, normal feeding — these typically resolve in 3–5 days. Plenty of fluids, rest, and a calm room are usually enough.\n\n## Book a clinic visit within 1–2 days\n\n- Fever above 39°C lasting more than 48 hours\n- Persistent cough beyond a week\n- Ear pain\n- A rash that is spreading\n- Reduced appetite for more than 2 days\n\n## Go to emergency immediately\n\n- Difficulty breathing or fast, laboured breathing\n- Lethargy, unusually difficult to wake\n- Repeated vomiting with no fluids staying down\n- Seizures\n- Skin or lips turning blue or grey\n\nWhen in doubt, call. We would always rather reassure a worried parent than miss a serious illness.`,
    },
    {
      title: "Mental health is health: starting the conversation",
      excerpt: "Why mental health still carries stigma in our community, and how a single honest conversation can change a life.",
      cover: "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=1200&q=80",
      author: 3,
      categories: ["mental-wellness"],
      tags: ["stress", "myth-busting"],
      readingMinutes: 6,
      publishedDaysAgo: 21,
      content: `# Mental health is health\n\nIn my consulting room, the most common sentence I hear in a first session is some version of: 'I should be able to handle this on my own.'\n\nBut you don't say that about a broken arm. You wouldn't say it about diabetes. Mental health deserves the same respect — and the same access to care.\n\n## What we treat\n\nAnxiety, depression, sleep disorders, burnout, grief, panic attacks, post-trauma symptoms, and more. Most people improve significantly with a combination of therapy and — when appropriate — medication.\n\n## What a first session looks like\n\nA conversation. No tests, no judgement. We talk about what brought you in, how long it has been going on, and what feels heavy. By the end of the hour you will have a small, doable next step. Nothing more.\n\nIf you've been thinking about reaching out — this is your sign.`,
    },
    {
      title: "Sun damage: protecting your skin year-round",
      excerpt: "Sunscreen myths, the right SPF for our climate, and the small daily habits that prevent pigmentation, ageing, and skin cancer.",
      cover: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=1200&q=80",
      author: 1,
      categories: ["skin-care", "lifestyle"],
      tags: ["summer", "prevention", "myth-busting"],
      readingMinutes: 4,
      publishedDaysAgo: 28,
      content: `# Sun damage: protecting your skin year-round\n\nA huge share of the pigmentation, fine lines, and uneven skin tone I treat in clinic comes down to one cause: cumulative, daily sun exposure. And contrary to popular belief, sunscreen is not just for the beach.\n\n## The myths\n\n- **'I have brown skin, I don't need sunscreen.'** Melanin gives some protection — not enough. UV still causes pigmentation and DNA damage in darker skin.\n- **'It's cloudy today.'** Up to 80% of UV passes through clouds.\n- **'I'm indoors.'** UVA passes through glass and reaches you near windows.\n\n## What I recommend\n\n- **SPF 30–50, broad spectrum**, applied to face, neck, ears, hands every morning.\n- **Re-apply every 2–3 hours** if you are outdoors.\n- **A wide-brim hat and UV-blocking sunglasses** for extended sun exposure.\n\nDo this consistently for one year and you will visibly see the difference.`,
    },
  ];

  for (const p of postsData) {
    const author = doctors[p.author];
    await prisma.post.create({
      data: {
        title: p.title,
        slug: slugify(p.title),
        excerpt: p.excerpt,
        content: p.content,
        coverImage: p.cover,
        status: "PUBLISHED",
        publishedAt: dayOffset(-p.publishedDaysAgo),
        readingMinutes: p.readingMinutes,
        views: Math.floor(Math.random() * 2000) + 200,
        metaTitle: p.title,
        metaDescription: p.excerpt,
        ogImage: p.cover,
        authorId: author.userId,
        categories: { create: p.categories.map((slug) => ({ category: { connect: { slug } } })) },
        tags: { create: p.tags.map((slug) => ({ tag: { connect: { slug } } })) },
        comments: {
          create: [
            { authorId: patients[0].userId, body: "Thank you for writing this — it answered exactly what I was wondering about." },
            { authorId: patients[1].userId, body: "Very clear and reassuring. Will share with my family." },
          ],
        },
        reactions: {
          create: [
            { userId: patients[0].userId, emoji: "❤️" },
            { userId: patients[1].userId, emoji: "👍" },
            { userId: patients[2].userId, emoji: "💡" },
            { emoji: "🔥" },
            { emoji: "❤️" },
          ],
        },
      },
    });
  }

  // ── newsletter signups ──
  await prisma.newsletterSignup.createMany({
    data: [
      { email: "subscriber1@example.com", source: "footer" },
      { email: "subscriber2@example.com", source: "post-page" },
    ],
  });

  // ── contact messages ──
  await prisma.contactMessage.createMany({
    data: [
      { name: "Rumi Khan", email: "rumi@example.com", phone: "+880 1888-000000", subject: "Booking question", message: "Do you accept walk-in patients on Saturdays?" },
      { name: "Asif Ahmed", email: "asif@example.com", subject: "Insurance", message: "Do you accept Pragati Life insurance for cardiology consultations?" },
    ],
  });

  console.log("✅  Seed complete.");
  console.log(`    • ${doctors.length} doctors  (main: ${mainDoctor.slug})`);
  console.log(`    • ${services.length} services`);
  console.log(`    • ${patients.length} patients`);
  console.log(`    • ${postsData.length} blog posts`);
  console.log("");
  console.log("🔑  Login (any role) — password: password123");
  console.log("    admin@anisbhai.health     (ADMIN)");
  console.log("    anis@anisbhai.health      (DOCTOR — main)");
  console.log("    farhana@anisbhai.health   (DOCTOR)");
  console.log("    rashed@example.com        (PATIENT)");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
