import Link from 'next/link';
import {
  Activity,
  Leaf,
  Microscope,
  Syringe,
  Heart,
  MessageCircle,
  MapPin,
  ArrowRight,
  Zap,
} from 'lucide-react';
import { Navbar } from '@/components/navbar';
import { Section, SectionHeader, Grid } from '@/components/section';
import { FeatureCard, Card } from '@/components/card-base';

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="relative min-h-[500px] md:min-h-[600px] flex items-center justify-center text-white overflow-hidden" style={{
        backgroundImage: 'linear-gradient(135deg, rgba(124, 58, 237, 0.65) 0%, rgba(167, 139, 250, 0.55) 100%), url(/home-hero-cattle.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundBlendMode: 'overlay',
      }}>
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/40"></div>
        
        {/* Animated cattle silhouettes background */}
        <div className="absolute inset-0 overflow-hidden opacity-20">
          <div className="absolute bottom-0 left-10 animate-float" style={{ animationDelay: '0s' }}>
            <Activity className="w-32 h-32 text-white" />
          </div>
          <div className="absolute bottom-20 right-20 animate-float" style={{ animationDelay: '1s' }}>
            <Heart className="w-24 h-24 text-white" />
          </div>
          <div className="absolute top-20 left-1/3 animate-float" style={{ animationDelay: '2s' }}>
            <Leaf className="w-20 h-20 text-white" />
          </div>
        </div>

        <div className="relative z-10 text-center space-y-6 py-12 md:py-20 px-4">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full border border-white/30 animate-fade-in-down">
            <Zap className="w-4 h-4 text-yellow-300" />
            <span className="text-sm font-medium text-white">AI-Powered Livestock Care</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold text-white text-balance leading-tight drop-shadow-lg animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            Intelligent Cattle Health Management
          </h1>

          <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto text-balance drop-shadow-md animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
            Harness the power of artificial intelligence to monitor, diagnose, and manage your cattle's health with unprecedented accuracy and ease.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4 animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
            <Link
              href="/scanner"
              className="btn-primary inline-flex items-center justify-center gap-2 text-base shadow-lg hover:scale-105 transform transition-all"
            >
              Start Scanning <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/diseases"
              className="bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 px-6 py-3 rounded-lg font-medium transition-all border border-white/30 inline-flex items-center justify-center gap-2"
            >
              Browse Diseases
            </Link>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <Section className="bg-gradient-to-b from-muted/30 to-background">
        <SectionHeader
          title="Complete Livestock Management"
          description="Everything you need to keep your cattle healthy and productive"
        />

        <Grid cols={3}>
          <div className="animate-fade-in-up" style={{ animationDelay: '0s' }}>
            <FeatureCard
              icon={<Microscope className="w-8 h-8" />}
              title="Disease Scanner"
              description="Upload images to detect cattle diseases using advanced AI vision technology"
              href="/scanner"
            />
          </div>

          <div className="animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            <FeatureCard
              icon={<Activity className="w-8 h-8" />}
              title="Disease Library"
              description="Explore comprehensive database of cattle diseases, symptoms, and treatments"
              href="/diseases"
            />
          </div>

          <div className="animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <FeatureCard
              icon={<Syringe className="w-8 h-8" />}
              title="Vaccination Guide"
              description="Track vaccination schedules and get personalized recommendations"
              href="/vaccination"
            />
          </div>

          <div className="animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            <FeatureCard
              icon={<Heart className="w-8 h-8" />}
              title="Pregnancy Monitor"
              description="Calculate calving dates and monitor pregnancy progress"
              href="/pregnancy"
            />
          </div>

          <div className="animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
            <FeatureCard
              icon={<MessageCircle className="w-8 h-8" />}
              title="AI Vet Assistant"
              description="Chat with an intelligent veterinary assistant for instant guidance"
              href="/chatbot"
            />
          </div>

          <div className="animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
            <FeatureCard
              icon={<MapPin className="w-8 h-8" />}
              title="Find Local Vets"
              description="Discover veterinary clinics and professionals near you"
              href="/vet-finder"
            />
          </div>
        </Grid>
      </Section>

      {/* Benefits Section */}
      <Section className="bg-gradient-to-r from-primary/10 via-primary-light/5 to-accent/10">
        <SectionHeader
          title="Why Choose CattleCare AI?"
      
        />

        <Grid cols={2} gap="lg">
          <div className="space-y-4">
            <Card className="bg-white dark:bg-slate-800 border-l-4 border-primary">
              <div className="space-y-2">
                <h3 className="font-semibold text-lg text-foreground">Instant Diagnosis</h3>
                <p className="text-muted-foreground">Get rapid disease identification and recommended treatments within seconds.</p>
              </div>
            </Card>

            <Card className="bg-white dark:bg-slate-800 border-l-4 border-primary">
              <div className="space-y-2">
                <h3 className="font-semibold text-lg text-foreground">24/7 Support</h3>
                <p className="text-muted-foreground">Access veterinary guidance anytime with our AI assistant, even outside business hours.</p>
              </div>
            </Card>

            <Card className="bg-white dark:bg-slate-800 border-l-4 border-primary">
              <div className="space-y-2">
                <h3 className="font-semibold text-lg text-foreground">Cost Effective</h3>
                <p className="text-muted-foreground">Reduce veterinary visit costs with early disease detection and prevention strategies.</p>
              </div>
            </Card>
          </div>

          <div className="space-y-4">
            <Card className="bg-white dark:bg-slate-800 border-l-4 border-accent">
              <div className="space-y-2">
                <h3 className="font-semibold text-lg text-foreground">Accurate Detection</h3>
                <p className="text-muted-foreground">Powered by advanced machine learning trained on thousands of cattle health cases.</p>
              </div>
            </Card>

            <Card className="bg-white dark:bg-slate-800 border-l-4 border-accent">
              <div className="space-y-2">
                <h3 className="font-semibold text-lg text-foreground">Easy to Use</h3>
                <p className="text-muted-foreground">Intuitive interface designed for farmers, no technical expertise required.</p>
              </div>
            </Card>

            <Card className="bg-white dark:bg-slate-800 border-l-4 border-accent">
              <div className="space-y-2">
                <h3 className="font-semibold text-lg text-foreground">Comprehensive Records</h3>
                <p className="text-muted-foreground">Track health history and vaccination records for your entire herd in one place.</p>
              </div>
            </Card>
          </div>
        </Grid>
      </Section>

      {/* CTA Section */}
      <Section className="py-16 md:py-24">
        <div className="bg-gradient-to-r from-primary via-primary-light to-primary text-primary-foreground text-center space-y-8 p-12 md:p-16 rounded-2xl shadow-lg relative overflow-hidden">
          {/* Animated background elements */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-10 right-20 animate-float">
              <Leaf className="w-16 h-16" />
            </div>
            <div className="absolute bottom-10 left-20 animate-float" style={{ animationDelay: '1s' }}>
              <Heart className="w-16 h-16" />
            </div>
          </div>

          <div className="relative z-10 space-y-6">
            <h2 className="text-4xl md:text-5xl font-bold text-balance">Ready to Transform Your Cattle Care?</h2>
            <p className="text-lg text-balance text-white/90 max-w-2xl mx-auto">
              Join hundreds of farmers using CattleCare AI to keep their herds healthy and productive.
            </p>
            <Link
              href="/scanner"
              className="inline-flex items-center justify-center gap-2 bg-white text-primary hover:bg-gray-100 px-8 py-4 rounded-lg font-bold transition-all transform hover:scale-105 shadow-lg"
            >
              Get Started Now <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </Section>

     {/* Footer */}
<footer className="bg-card border-t border-border py-8 mt-12">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="flex flex-col items-center gap-4 text-sm text-muted-foreground">
      
      <p className="text-center">&copy; 2026 CattleCare AI.</p>

      <div className="flex gap-6">
        <a href="#" className="hover:text-primary transition-colors"></a>
        <a href="#" className="hover:text-primary transition-colors"></a>
        <a href="#" className="hover:text-primary transition-colors"></a>
      </div>

    </div>
  </div>
</footer>
    </div>
  );
}
