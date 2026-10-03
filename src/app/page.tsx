import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, BookOpen, ShieldCheck, Users, Star } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 px-4 text-center bg-gradient-to-b from-indigo-50/50 via-background to-background">
        <div className="container mx-auto max-w-4xl space-y-6">
          
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 text-xs font-bold uppercase tracking-wider border border-indigo-500/20 shadow-sm">
            <Star className="size-3.5 fill-indigo-600 text-indigo-600" /> Empowering Personalized Education
          </div>

          <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-6xl lg:text-7xl">
            Connect with Expert <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">Tutors</span> Anytime
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            SkillBridge bridges the gap between ambitious learners and world-class mentors. Book 1-on-1 sessions, master new skills, and accelerate your growth.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link href="/tutors" className="w-full sm:w-auto">
              <Button size="lg" className="w-full sm:w-auto rounded-xl px-8 py-6 font-semibold bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 shadow-lg shadow-indigo-500/25 transition-all">
                Explore Tutors <ArrowRight className="ml-2 size-4" />
              </Button>
            </Link>
            <Link href="/register" className="w-full sm:w-auto">
              <Button variant="outline" size="lg" className="w-full sm:w-auto rounded-xl px-8 py-6 font-semibold border-border/80 hover:bg-muted/50 transition-all">
                Join as a Tutor
              </Button>
            </Link>
          </div>

        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-muted/20 border-t border-border/40">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <h2 className="text-3xl font-bold tracking-tight">Why Choose SkillBridge?</h2>
            <p className="text-sm text-muted-foreground">
              Designed to provide seamless interaction between students and mentors with cutting-edge features.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="rounded-3xl border border-border/60 bg-background p-8 shadow-sm space-y-4 transition-all hover:shadow-md">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-600/10 text-indigo-600 font-bold">
                <Users className="size-6" />
              </div>
              <h3 className="text-xl font-bold">Verified Expert Mentors</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Learn from industry professionals and vetted educators who are passionate about teaching and mentoring.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="rounded-3xl border border-border/60 bg-background p-8 shadow-sm space-y-4 transition-all hover:shadow-md">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-600/10 text-violet-600 font-bold">
                <BookOpen className="size-6" />
              </div>
              <h3 className="text-xl font-bold">Flexible 1-on-1 Sessions</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Book sessions according to your custom schedule and learn at your own comfortable pace with individual attention.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="rounded-3xl border border-border/60 bg-background p-8 shadow-sm space-y-4 transition-all hover:shadow-md">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-600/10 text-emerald-600 font-bold">
                <ShieldCheck className="size-6" />
              </div>
              <h3 className="text-xl font-bold">Secure & Reliable Platform</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Advanced authentication and session tracking ensuring a safe, transparent, and dependable learning environment.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}