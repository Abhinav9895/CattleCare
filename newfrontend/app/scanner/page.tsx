'use client';

import { useState, useRef, useEffect } from 'react';
import { Upload, AlertCircle, CheckCircle, Loader2, X, Microscope } from 'lucide-react';
import { Navbar } from '@/components/navbar';
import { Section } from '@/components/section';
import { Card } from '@/components/card-base';
import { API_BASE_URL } from '@/lib/api';

interface ScanResult {
  disease: string;
  confidence: number | null;
  description: string;
  treatments: string[];
  severity: 'mild' | 'moderate' | 'severe';
}

interface HistoryItem {
  disease: string;
  confidence: number | null;
  date: string;
}

export default function DiseaseScanner() {

  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [symptoms, setSymptoms] = useState('');
  const [result, setResult] = useState<ScanResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [scanHistory, setScanHistory] = useState<HistoryItem[]>([]);

  const fileInputRef = useRef<HTMLInputElement>(null);

  /* LOAD HISTORY */

  useEffect(() => {
    const saved = localStorage.getItem("scanHistory");
    if (saved) {
      setScanHistory(JSON.parse(saved));
    }
  }, []);

  /* DELETE SINGLE HISTORY ITEM */

  const removeHistoryItem = (index: number) => {

    const updatedHistory = scanHistory.filter((_, i) => i !== index);

    setScanHistory(updatedHistory);

    localStorage.setItem("scanHistory", JSON.stringify(updatedHistory));

  };

  /* CLEAR ALL HISTORY */

  const clearAllHistory = () => {

    localStorage.removeItem("scanHistory");

    setScanHistory([]);

  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {

    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please upload an image file");
      return;
    }

    setImage(file);
    setError(null);
    setResult(null);

    const reader = new FileReader();

    reader.onloadend = () => {
      setPreview(reader.result as string);
    };

    reader.readAsDataURL(file);
  };

  const handleScan = async () => {

    if (!image && !symptoms) {
      setError("Please upload an image or enter symptoms.");
      return;
    }

    setLoading(true);
    setError(null);

    try {

      const formData = new FormData();

      if (image) formData.append("file", image);
      if (symptoms) formData.append("symptoms", symptoms);

      const response = await fetch(`${API_BASE_URL}/predict`, {
        method: "POST",
        body: formData
      });

      const data = await response.json();

      const formattedResult: ScanResult = {
        disease: data.final_diagnosis,
        confidence: data.confidence_percent ? data.confidence_percent / 100 : null,
        description: "AI detected this condition based on the provided data.",
        treatments: data.recommended_actions || [],
        severity: (data.severity_level?.toLowerCase() || "moderate") as 'mild' | 'moderate' | 'severe'
      };

      setResult(formattedResult);

      /* SAVE HISTORY */

      const history = JSON.parse(localStorage.getItem("scanHistory") || "[]");

      const newEntry = {
        disease: formattedResult.disease,
        confidence: formattedResult.confidence,
        date: new Date().toISOString()
      };

      const updatedHistory = [newEntry, ...history];

      localStorage.setItem("scanHistory", JSON.stringify(updatedHistory));

      setScanHistory(updatedHistory);

    } catch (err) {

      setError("Failed to analyze. Please try again.");

    } finally {

      setLoading(false);

    }
  };

  const handleRemoveImage = () => {

    setImage(null);
    setPreview(null);
    setResult(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

  };

  const getSeverityColor = (severity: string) => {

    switch (severity) {
      case 'mild':
        return 'text-amber-600 bg-amber-50';
      case 'moderate':
        return 'text-orange-600 bg-orange-50';
      case 'severe':
        return 'text-red-600 bg-red-50';
      default:
        return '';
    }

  };

  return (

    <div className="min-h-screen bg-background">

      <Navbar />

      {/* HERO */}

      <section className="scanner-bg relative min-h-[400px] flex items-center justify-center text-white">

        <div className="text-center space-y-4 px-4">

          <Microscope className="w-16 h-16 mx-auto" />

          <h1 className="text-5xl font-bold">
            AI Disease Scanner
          </h1>

          <p className="text-lg max-w-xl mx-auto">
            Upload an image or enter symptoms to detect cattle diseases
          </p>

        </div>

      </section>

      <Section>

        <div className="max-w-2xl mx-auto">

          {/* IMAGE UPLOAD */}

          <Card className="mb-6">

            <div className="space-y-6">

              {!preview ? (

                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed rounded-lg p-10 text-center cursor-pointer hover:border-primary"
                >

                  <Upload className="w-14 h-14 mx-auto text-primary mb-4" />

                  <h3 className="font-bold text-lg">
                    Click to Upload Image
                  </h3>

                  <p className="text-sm text-muted-foreground">
                    Upload a clear JPG or PNG image for better accuracy
                  </p>

                </div>

              ) : (

                <div className="space-y-4">

                  <div className="relative">

                    <img
                      src={preview}
                      className="w-full rounded-lg max-h-96 object-cover"
                    />

                    <button
                      onClick={handleRemoveImage}
                      className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full"
                    >

                      <X className="w-4 h-4" />

                    </button>

                  </div>

                </div>

              )}

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />

            </div>

          </Card>

          {/* SYMPTOMS INPUT */}

          <Card className="mb-6">

            <h3 className="font-bold mb-3">
              Enter Symptoms (Optional)
            </h3>

            <textarea
              value={symptoms}
              onChange={(e) => setSymptoms(e.target.value)}
              placeholder="Example: fever, skin nodules, swelling in legs..."
              className="w-full border rounded-lg p-3 min-h-[100px]"
            />

          </Card>

          {/* SCAN BUTTON */}

          <button
            onClick={handleScan}
            disabled={loading}
            className="w-full btn-primary flex items-center justify-center gap-2 mb-6"
          >

            {loading ? (
              <>
                <Loader2 className="animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Microscope />
                Analyze Disease
              </>
            )}

          </button>

          {/* RESULT */}

          {result && (

            <Card className="space-y-4">

              <h3 className="font-bold text-lg">
                {result.disease}
              </h3>

              {result.confidence !== null && (
                <p>
                  Confidence: {(result.confidence * 100).toFixed(0)}%
                </p>
              )}

              <span className={`px-3 py-1 rounded ${getSeverityColor(result.severity)}`}>
                {result.severity}
              </span>

              <div>

                <h4 className="font-semibold">
                  
                </h4>

                {result.treatments.map((t, i) => (

                  <p key={i} className="flex gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500"/>
                    {t}
                  </p>

                ))}

              </div>

            </Card>

          )}

          {/* HISTORY */}

          {scanHistory.length > 0 && (

            <Card className="mt-6">

              <div className="flex justify-between items-center mb-3">

                <h3 className="font-bold">
                  Previous Scan History
                </h3>

                <button
                  onClick={clearAllHistory}
                  className="text-red-500 text-sm hover:underline"
                >
                  Clear All
                </button>

              </div>

              {scanHistory.map((item, index) => (

                <div key={index} className="border-b py-2 flex justify-between">

                  <div>

                    <p><strong>Disease:</strong> {item.disease}</p>

                    {item.confidence !== null && (
                      <p>
                        <strong>Confidence:</strong> {(item.confidence * 100).toFixed(0)}%
                      </p>
                    )}

                    <p className="text-xs text-muted-foreground">
                      {new Date(item.date).toLocaleString()}
                    </p>

                  </div>

                  <button
                    onClick={() => removeHistoryItem(index)}
                    className="text-red-500 text-xs hover:underline"
                  >
                    Delete
                  </button>

                </div>

              ))}

            </Card>

          )}

          {/* ERROR */}

          {error && (

            <Card className="border-l-4 border-red-500 mt-4">

              <div className="flex gap-3">

                <AlertCircle className="text-red-500" />

                <p>{error}</p>

              </div>

            </Card>

          )}

        </div>

      </Section>

    </div>
  );
}
