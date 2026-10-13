'use client';

import { useState, useEffect } from 'react';
import { Search, Phone, MapPin, Clock, Star } from 'lucide-react';
import { Navbar } from '@/components/navbar';
import { Section } from '@/components/section';
import { Card } from '@/components/card-base';
import { API_BASE_URL } from '@/lib/api';

interface Veterinarian {
  id: string;
  name: string;
  clinic: string;
  phone: string;
  address: string;
  distance: number;
  hours: string;
}

export default function VetFinder() {

  const [vets, setVets] = useState<Veterinarian[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {

    navigator.geolocation.getCurrentPosition(async (position) => {

      const lat = position.coords.latitude;
      const lon = position.coords.longitude;

      try {

        const res = await fetch(
          `${API_BASE_URL}/vets?lat=${lat}&lon=${lon}`
        );

        const data = await res.json();

        const mapped = (data?.nearby_vets ?? []).map((vet: any, index: number) => ({

          id: index.toString(),
          name: vet.name,
          clinic: vet.name,
          phone: vet.phone && vet.phone !== "" ? vet.phone : "Phone not available",
          address: vet.maps_link,
          distance: parseFloat(vet.distance),
          hours: vet.hours || "Unknown"

        }));

        setVets(mapped);
        setLoading(false);

      } catch (error) {

        console.error("Vet fetch error:", error);
        setLoading(false);

      }

    });

  }, []);

  const filtered = vets.filter((vet) =>
    vet.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">

      <Navbar />

      <section className="vet-finder-bg relative min-h-[350px] flex items-center justify-center text-white">

        <div className="text-center space-y-4 px-4 py-12">

          <MapPin className="w-16 h-16 mx-auto" />

          <h1 className="text-5xl font-bold">
            Find Nearby Veterinarians
          </h1>

          <p className="text-lg">
            Discover veterinary clinics around your location
          </p>

        </div>

      </section>

      <Section>

        <div className="max-w-4xl mx-auto mb-8">

          <div className="relative">

            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5" />

            <input
              type="text"
              placeholder="Search nearby veterinary clinics..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-lg border"
            />

          </div>

        </div>

        {loading && (
          <Card className="text-center py-12">
            <p>Finding nearby veterinary clinics...</p>
          </Card>
        )}

        <div className="max-w-4xl mx-auto space-y-4">

          {filtered.map((vet) => (

            <Card key={vet.id} className="space-y-4 p-5">

              <div className="flex justify-between">

                <div>

                  <h3 className="text-lg font-bold">
                    {vet.name}
                  </h3>

                  <p className="text-sm text-primary">
                    {vet.clinic}
                  </p>

                </div>

                <div className="text-right">

                  <div className="flex items-center gap-1">

                    <Star className="w-4 h-4 text-yellow-500" />

                    <span>Check Google Maps</span>

                  </div>

                  <p className="text-xs">
                    Reviews available on Maps
                  </p>

                </div>

              </div>

              <div className="grid md:grid-cols-2 gap-4 border-y py-4">

                <div className="flex gap-2">

                  <MapPin className="w-5 h-5 text-primary" />

                  <div>

                    <p className="text-sm">Veterinary Clinic</p>

                    <p className="text-xs text-primary">
                      {vet.distance.toFixed(1)} km away
                    </p>

                  </div>

                </div>

                <div className="flex gap-2">

                  <Clock className="w-5 h-5 text-primary" />

                  <p className="text-sm">{vet.hours}</p>

                </div>

              </div>

              <div className="flex gap-2">

                <a
                  href={`tel:${vet.phone}`}
                  className="flex-1 bg-purple-600 text-white px-4 py-2 rounded text-center flex items-center justify-center gap-2"
                >
                  <Phone size={16}/>
                  {vet.phone}
                </a>

                <a
                  href={vet.address}
                  target="_blank"
                  className="flex-1 border px-4 py-2 rounded text-center"
                >
                  Directions
                </a>

              </div>

            </Card>

          ))}

        </div>

      </Section>

    </div>
  );
}
