'use client';

import { useState } from 'react';
import { Calendar, Heart, Info, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Navbar } from '@/components/navbar';
import { Section, SectionHeader, Grid } from '@/components/section';
import { Card, StatCard } from '@/components/card-base';

interface CalvingInfo {
  cowId: string;
  lastBreeding: string;
  estimatedCalving: string;
  daysRemaining: number;
  status: 'early' | 'on-track' | 'overdue';
}

export default function PregnancyMonitoring() {
  const [lastBreeding, setLastBreeding] = useState('');
  const [calvingInfo, setCalvingInfo] = useState<CalvingInfo | null>(null);

  const GESTATION_PERIOD = 283; // days

  const calculateCalving = () => {
    if (!lastBreeding) return;

    const breedingDate = new Date(lastBreeding);
    const calvingDate = new Date(breedingDate.getTime() + GESTATION_PERIOD * 24 * 60 * 60 * 1000);

    const today = new Date();
    const daysRemaining = Math.ceil((calvingDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    let status: 'early' | 'on-track' | 'overdue' = 'on-track';
    if (daysRemaining < 0) status = 'overdue';
    else if (daysRemaining > 300) status = 'early';

    setCalvingInfo({
      cowId: `COW-${Math.floor(Math.random() * 1000)}`,
      lastBreeding,
      estimatedCalving: calvingDate.toISOString().split('T')[0],
      daysRemaining: Math.max(daysRemaining, 0),
      status,
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'early':
        return 'text-blue-600 bg-blue-50 dark:bg-blue-900/20';
      case 'on-track':
        return 'text-green-600 bg-green-50 dark:bg-green-900/20';
      case 'overdue':
        return 'text-red-600 bg-red-50 dark:bg-red-900/20';
      default:
        return '';
    }
  };

  const getStatusMessage = (status: string, days: number) => {
    switch (status) {
      case 'early':
        return `Calving expected in ${days} days`;
      case 'on-track':
        return `On track - calving in ~${days} days`;
      case 'overdue':
        return `Overdue by ${Math.abs(days)} days - Monitor closely and contact vet`;
      default:
        return '';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="pregnancy-bg relative min-h-[350px] flex items-center justify-center text-white overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-black/35 via-black/25 to-black/35"></div>
        
        <div className="relative z-10 text-center space-y-4 px-4 py-12">
          <div className="flex justify-center mb-4">
            <div className="animate-float">
              <Heart className="w-16 h-16 text-white/90 drop-shadow-lg" />
            </div>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-white drop-shadow-lg animate-fade-in-down">Pregnancy Monitoring</h1>
          <p className="text-lg text-white/95 max-w-2xl mx-auto text-balance drop-shadow-md animate-fade-in-up">
            Calculate calving dates and track pregnancy progress for optimal herd management
          </p>
        </div>
      </section>

      <Section>

        {/* Calculator */}
        <div className="max-w-2xl mx-auto mb-12">
          <Card className="space-y-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-foreground">
                Last Breeding Date
              </label>
              <input
                type="date"
                value={lastBreeding}
                onChange={(e) => setLastBreeding(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <button
              onClick={calculateCalving}
              disabled={!lastBreeding}
              className="btn-primary w-full text-base font-semibold flex items-center justify-center gap-2"
            >
              <Calendar className="w-5 h-5" />
              Calculate Calving Date
            </button>
          </Card>

          {/* Results */}
          {calvingInfo && (
            <div className="mt-8 space-y-6">
              <Card
                className={`border-l-4 space-y-4 ${
                  calvingInfo.status === 'on-track'
                    ? 'border-primary'
                    : calvingInfo.status === 'overdue'
                      ? 'border-red-500'
                      : 'border-blue-500'
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-1">
                      Calving Information
                    </h3>
                    <p className="text-sm text-muted-foreground">Cow ID: {calvingInfo.cowId}</p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap ${getStatusColor(calvingInfo.status)}`}
                  >
                    {calvingInfo.status === 'early' && 'Early Stage'}
                    {calvingInfo.status === 'on-track' && 'On Track'}
                    {calvingInfo.status === 'overdue' && 'Overdue'}
                  </span>
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">Breeding Date</p>
                    <p className="font-semibold text-foreground">
                      {new Date(calvingInfo.lastBreeding).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">Est. Calving Date</p>
                    <p className="font-semibold text-foreground">
                      {new Date(calvingInfo.estimatedCalving).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">Days Remaining</p>
                    <p className="font-semibold text-foreground text-lg">{calvingInfo.daysRemaining}</p>
                  </div>
                </div>

                <div className="pt-4 border-t border-border">
                  <p className={`text-sm font-medium ${getStatusColor(calvingInfo.status)}`}>
                    {getStatusMessage(calvingInfo.status, calvingInfo.daysRemaining)}
                  </p>
                </div>
              </Card>

              {/* Pregnancy Stages */}
              <div className="space-y-3">
                <h3 className="font-semibold text-foreground">Pregnancy Progress</h3>
                <div className="relative">
                  <div className="flex justify-between text-xs text-muted-foreground mb-2">
                    <span>Day 0</span>
                    <span>Day 141</span>
                    <span>Day 283</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                    <div
                      className="bg-primary h-2 rounded-full transition-all"
                      style={{
                        width: `${Math.min(
                          ((GESTATION_PERIOD - calvingInfo.daysRemaining) / GESTATION_PERIOD) * 100,
                          100
                        )}%`,
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Pregnancy Stages Information */}
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-foreground mb-6">Pregnancy Timeline & Care</h2>

          <Grid cols={1} gap="md">
            <Card className="border-l-4 border-blue-500 space-y-3">
              <div className="flex gap-3">
                <div className="bg-blue-100 dark:bg-blue-900/20 px-3 py-1 rounded text-sm font-bold text-blue-700 dark:text-blue-300">
                  0-60 Days
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-foreground mb-1">Early Pregnancy</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Embryo development begins</li>
                    <li>• Minimal external signs of pregnancy</li>
                    <li>• Maintain normal nutrition and stress levels</li>
                    <li>• Avoid strenuous handling</li>
                  </ul>
                </div>
              </div>
            </Card>

            <Card className="border-l-4 border-amber-500 space-y-3">
              <div className="flex gap-3">
                <div className="bg-amber-100 dark:bg-amber-900/20 px-3 py-1 rounded text-sm font-bold text-amber-700 dark:text-amber-300">
                  60-200 Days
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-foreground mb-1">Mid Pregnancy</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Fetus grows rapidly</li>
                    <li>• Visible abdominal enlargement</li>
                    <li>• Increased nutrient requirements</li>
                    <li>• Screen for pregnancy diseases (vibriosis, trichomoniasis)</li>
                  </ul>
                </div>
              </div>
            </Card>

            <Card className="border-l-4 border-green-500 space-y-3">
              <div className="flex gap-3">
                <div className="bg-green-100 dark:bg-green-900/20 px-3 py-1 rounded text-sm font-bold text-green-700 dark:text-green-300">
                  200-283 Days
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-foreground mb-1">Late Pregnancy</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Prepare calving area and equipment</li>
                    <li>• Watch for signs of imminent calving</li>
                    <li>• Increase monitoring during final weeks</li>
                    <li>• Have veterinarian contact information ready</li>
                  </ul>
                </div>
              </div>
            </Card>
          </Grid>
        </div>

        {/* Calving Signs */}
        <Section className="bg-primary/5">
          <h2 className="text-2xl font-bold text-foreground mb-6">Signs of Imminent Calving</h2>

          <Grid cols={2} gap="lg">
            <Card className="space-y-3">
              <div className="flex gap-3">
                <Heart className="w-5 h-5 text-red-500 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-semibold text-foreground mb-1">Physical Signs</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Relaxation of pelvic ligaments</li>
                    <li>• Udder filling with colostrum</li>
                    <li>• Vulva swelling and discharge</li>
                    <li>• Restlessness and frequent posture changes</li>
                  </ul>
                </div>
              </div>
            </Card>

            <Card className="space-y-3">
              <div className="flex gap-3">
                <AlertCircle className="w-5 h-5 text-orange-500 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-semibold text-foreground mb-1">When to Call Vet</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• No progress after 2 hours of labor</li>
                    <li>• Abnormal discharge or fetal presentation</li>
                    <li>• Calf not breathing after 5 minutes</li>
                    <li>• Retained placenta after 8 hours</li>
                  </ul>
                </div>
              </div>
            </Card>
          </Grid>
        </Section>

        {/* Important Notes */}
        <Section>
          <Card className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 space-y-3">
            <div className="flex gap-3">
              <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">Important Reminders</h4>
                <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                  <li>• Gestation period is approximately 283 days (9 months)</li>
                  <li>• Individual variation can be 10-14 days from calculated date</li>
                  <li>• Regular monitoring improves calving outcomes</li>
                  <li>• Consult veterinarian for high-risk pregnancies</li>
                  <li>• Proper nutrition is crucial for dam and calf health</li>
                </ul>
              </div>
            </div>
          </Card>
        </Section>
      </Section>
    </div>
  );
}
