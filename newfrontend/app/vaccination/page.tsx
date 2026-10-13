'use client';

import { useState, useEffect } from 'react';
import { Calendar, Syringe, AlertCircle, Clock, Plus, X } from 'lucide-react';
import { Navbar } from '@/components/navbar';
import { Section } from '@/components/section';
import { Card } from '@/components/card-base';

interface VaccineRecord {
  id: string;
  name: string;
  date: string;
  nextDue: string;
  veterinarian: string;
}

interface VaccineSchedule {
  name: string;
  age: string;
  description: string;
}

const vaccineSchedules: VaccineSchedule[] = [
  {
    name: 'Clostridium C & D (Blackleg)',
    age: '4-6 months',
    description: 'Primary protection against deadly clostridiosis. Annual booster required.',
  },
  {
    name: 'Respiratory Complex (IBR, PI3, BVD, BRSV)',
    age: '6-8 months',
    description: 'Protection against major respiratory pathogens. Booster at 12 months.',
  },
  {
    name: 'Brucellosis (Females)',
    age: '4-12 months',
    description: 'Required for female cattle before breeding age.',
  },
  {
    name: 'Leptospirosis',
    age: '6-12 months',
    description: 'Protects against kidney disease. Annual booster recommended.',
  },
];

export default function VaccinationGuide() {

  const [records, setRecords] = useState<VaccineRecord[]>([]);
  const [showForm, setShowForm] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    date: '',
    nextDue: '',
    veterinarian: ''
  });

  /* LOAD SAVED RECORDS */

  useEffect(() => {

    const saved = localStorage.getItem("vaccinationRecords");

    if (saved) {
      setRecords(JSON.parse(saved));
    }

  }, []);

  /* SAVE RECORDS */

  const saveRecords = (data: VaccineRecord[]) => {

    setRecords(data);

    localStorage.setItem(
      "vaccinationRecords",
      JSON.stringify(data)
    );
  };

  /* ADD RECORD */

  const handleAddRecord = () => {

    if (!formData.name || !formData.date || !formData.nextDue || !formData.veterinarian) {
      return;
    }

    const newRecord: VaccineRecord = {
      id: Date.now().toString(),
      ...formData
    };

    const updated = [...records, newRecord];

    saveRecords(updated);

    setFormData({
      name: '',
      date: '',
      nextDue: '',
      veterinarian: ''
    });

    setShowForm(false);
  };

  /* DELETE RECORD */

  const handleDeleteRecord = (id: string) => {

    const updated = records.filter((r) => r.id !== id);

    saveRecords(updated);
  };

  /* CHECK OVERDUE */

  const isOverdue = (nextDue: string) => {
    return new Date(nextDue) < new Date();
  };

  const daysUntilDue = (nextDue: string) => {

    const due = new Date(nextDue);
    const today = new Date();

    const diff = Math.ceil(
      (due.getTime() - today.getTime()) /
      (1000 * 60 * 60 * 24)
    );

    return diff;
  };

  return (

    <div className="min-h-screen bg-background">

      <Navbar />

      {/* HERO */}

      <section className="vaccination-bg relative min-h-[350px] flex items-center justify-center text-white">

        <div className="text-center space-y-4">

          <Syringe className="w-16 h-16 mx-auto" />

          <h1 className="text-5xl font-bold">
            Vaccination Guide
          </h1>

          <p className="text-lg">
            Track vaccination schedules and keep your cattle healthy
          </p>

        </div>

      </section>

      <Section>

        {/* RECORDS */}

        <div className="max-w-4xl mx-auto mb-12">

          <div className="flex justify-between items-center mb-6">

            <h2 className="text-2xl font-bold">
              Vaccination Records
            </h2>

            <button
              onClick={() => setShowForm(!showForm)}
              className="btn-primary flex gap-2"
            >
              <Plus size={16} /> Add Record
            </button>

          </div>

          {/* ADD FORM */}

          {showForm && (

            <Card className="mb-6 space-y-4">

              {/* Vaccine Name */}

              <div>
                <label className="text-sm font-medium">
                  Vaccine Name
                </label>
                <input
                  type="text"
                  placeholder="Enter vaccine name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full border rounded px-3 py-2 mt-1"
                />
              </div>

              {/* Vaccination Date */}

              <div>
                <label className="text-sm font-medium">
                  Vaccination Date
                </label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) =>
                    setFormData({ ...formData, date: e.target.value })
                  }
                  className="w-full border rounded px-3 py-2 mt-1"
                />
              </div>

              {/* Next Due Date */}

              <div>
                <label className="text-sm font-medium">
                  Next Due Date
                </label>
                <input
                  type="date"
                  value={formData.nextDue}
                  onChange={(e) =>
                    setFormData({ ...formData, nextDue: e.target.value })
                  }
                  className="w-full border rounded px-3 py-2 mt-1"
                />
              </div>

              {/* Veterinarian */}

              <div>
                <label className="text-sm font-medium">
                  Veterinarian
                </label>
                <input
                  type="text"
                  placeholder="Enter veterinarian name"
                  value={formData.veterinarian}
                  onChange={(e) =>
                    setFormData({ ...formData, veterinarian: e.target.value })
                  }
                  className="w-full border rounded px-3 py-2 mt-1"
                />
              </div>

              {/* Buttons */}

              <div className="flex gap-2">

                <button
                  onClick={handleAddRecord}
                  className="btn-primary flex-1"
                >
                  Save Record
                </button>

                <button
                  onClick={() => setShowForm(false)}
                  className="btn-secondary flex-1"
                >
                  Cancel
                </button>

              </div>

            </Card>

          )}

          {/* RECORD LIST */}

          <div className="space-y-3">

            {records.length === 0 ? (

              <Card className="text-center py-8">

                <Syringe className="w-12 h-12 mx-auto opacity-50 mb-3" />

                <p>No vaccination records yet.</p>

              </Card>

            ) : (

              records.map((record) => (

                <Card key={record.id} className="flex justify-between">

                  <div>

                    <h3 className="font-semibold">
                      {record.name}
                    </h3>

                    <p className="text-sm flex items-center gap-2">
                      <Calendar size={14}/>
                      Vaccinated: {new Date(record.date).toLocaleDateString()}
                    </p>

                    <p className="text-sm flex items-center gap-2">
                      <Clock size={14}/>
                      Next Due: {new Date(record.nextDue).toLocaleDateString()}
                    </p>

                    <p className="text-sm">
                      Vet: {record.veterinarian}
                    </p>

                    {isOverdue(record.nextDue) && (
                      <p className="text-red-500 text-xs">
                        Overdue
                      </p>
                    )}

                    {!isOverdue(record.nextDue) && daysUntilDue(record.nextDue) <= 30 && (
                      <p className="text-amber-500 text-xs">
                        Due Soon
                      </p>
                    )}

                  </div>

                  <button
                    onClick={() => handleDeleteRecord(record.id)}
                    className="text-red-500"
                  >
                    <X />
                  </button>

                </Card>

              ))

            )}

          </div>

        </div>

        {/* VACCINE SCHEDULE */}

        <div className="max-w-4xl mx-auto">

          <h2 className="text-2xl font-bold mb-6">
            Recommended Vaccination Schedule
          </h2>

          {vaccineSchedules.map((v, i) => (

            <Card key={i} className="mb-3">

              <h3 className="font-semibold">
                {v.name}
              </h3>

              <p className="text-sm text-primary">
                Age: {v.age}
              </p>

              <p className="text-sm">
                {v.description}
              </p>

            </Card>

          ))}

        </div>

      </Section>

    </div>
  );
}