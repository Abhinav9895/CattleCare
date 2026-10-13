'use client';

import { useState } from 'react';
import { Search, AlertTriangle, CheckCircle } from 'lucide-react';
import { Navbar } from '@/components/navbar';
import { Section } from '@/components/section';
import { Card } from '@/components/card-base';

interface Disease {
  id: string;
  name: string;
  severity: 'mild' | 'moderate' | 'severe';
  images: string[];
  symptoms: string[];
  transmission: string;
  treatment: string[];
  prevention: string[];
  affectedAge: string;
}

const diseases: Disease[] = [

{
id:"anthrax",
name:"Anthrax",
severity:"severe",
images:[
"/diseases/anthrax1.jpeg",
"/diseases/anthrax2.jpeg"
],
symptoms:["High fever","Sudden death","Bleeding from nose"],
transmission:"Bacteria in contaminated soil",
treatment:["Immediate antibiotics","Veterinary care"],
prevention:["Vaccination","Proper carcass disposal"],
affectedAge:"All ages"
},

{
id:"blackleg",
name:"Blackleg",
severity:"severe",
images:[
"/diseases/blackleg1.jpg",
"/diseases/blackleg2.jpg"
],
symptoms:["Lameness","Muscle swelling","Fever"],
transmission:"Clostridium bacteria in soil",
treatment:["Antibiotics","Supportive care"],
prevention:["Vaccination","Pasture hygiene"],
affectedAge:"Young cattle"
},

{
id:"bloat",
name:"Bloat",
severity:"severe",
images:[
"/diseases/bloat1.jpeg",
"/diseases/bloat2.jpeg"
],
symptoms:["Swollen abdomen","Difficulty breathing","Restlessness"],
transmission:"Dietary issue",
treatment:["Anti‑bloat medicine","Emergency vet care"],
prevention:["Balanced diet","Gradual feed change"],
affectedAge:"All ages"
},

{
id:"fmd",
name:"Foot and Mouth Disease",
severity:"severe",
images:[
"/diseases/fmd1.jpg",
"/diseases/fmd2.jpg"
],
symptoms:["Blisters in mouth","Blisters on hooves","Drooling"],
transmission:"Highly contagious virus",
treatment:["Supportive care","Isolation"],
prevention:["Vaccination","Farm hygiene"],
affectedAge:"All ages"
},

{
id:"lsd",
name:"Lumpy Skin Disease",
severity:"severe",
images:[
"/diseases/lsd1.jpg",
"/diseases/lsd2.jpg"
],
symptoms:["Skin nodules","Fever","Reduced milk"],
transmission:"Insects",
treatment:["Supportive care","Antibiotics"],
prevention:["Vaccination","Insect control"],
affectedAge:"All cattle"
},

{
id:"mastitis",
name:"Mastitis",
severity:"moderate",
images:[
"/diseases/mastitis1.jpg",
"/diseases/mastitis2.jpg"
],
symptoms:["Swollen udder","Abnormal milk","Reduced milk production"],
transmission:"Bacterial infection",
treatment:["Antibiotics","Udder hygiene"],
prevention:["Clean milking","Regular checks"],
affectedAge:"Lactating cows"
},

{
id:"pneumonia",
name:"Pneumonia",
severity:"moderate",
images:[
"/diseases/pneumonia1.jpg",
"/diseases/pneumonia2.jpg"
],
symptoms:["Coughing","Breathing difficulty","Fever"],
transmission:"Respiratory infection",
treatment:["Antibiotics","Warm shelter"],
prevention:["Ventilation","Reduce overcrowding"],
affectedAge:"Calves"
},

{
id:"ringworm",
name:"Ringworm",
severity:"mild",
images:[
"/diseases/ringworm1.jpeg",
"/diseases/ringworm2.jpeg"
],
symptoms:["Circular hair loss","Skin crust","Itching"],
transmission:"Fungal infection",
treatment:["Antifungal medicine","Isolation"],
prevention:["Disinfect equipment"],
affectedAge:"All ages"
},

{
id:"tickfever",
name:"Tick Fever",
severity:"moderate",
images:[
"/diseases/tickfever1.jpeg",
"/diseases/tickfever2.jpeg"
],
symptoms:["High fever","Weakness","Loss of appetite"],
transmission:"Ticks",
treatment:["Antibiotics","Tick treatment"],
prevention:["Tick control"],
affectedAge:"All ages"
}

];

export default function DiseaseLibrary() {

const [searchTerm,setSearchTerm] = useState('');

const filtered = diseases.filter(disease =>
disease.name.toLowerCase().includes(searchTerm.toLowerCase())
);

const getSeverityColor = (severity:string) => {
switch(severity){
case 'mild':
return 'bg-amber-100 text-amber-800';
case 'moderate':
return 'bg-orange-100 text-orange-800';
case 'severe':
return 'bg-red-100 text-red-800';
default:
return '';
}
};

return (

<div className="min-h-screen bg-background">

<Navbar/>

<section className="disease-library-bg relative min-h-[350px] flex items-center justify-center text-white">

<div className="text-center space-y-4 px-4 py-12">

<h1 className="text-5xl font-bold">
Cattle Disease Library
</h1>

<p className="text-lg max-w-2xl mx-auto">
Information about common cattle diseases in India
</p>

</div>

</section>

<Section>

<div className="max-w-4xl mx-auto mb-8">

<div className="relative">

<Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground"/>

<input
type="text"
placeholder="Search diseases..."
value={searchTerm}
onChange={(e)=>setSearchTerm(e.target.value)}
className="w-full pl-10 pr-4 py-3 rounded-lg bg-card border"
/>

</div>

</div>

<div className="space-y-6">

{filtered.map((disease)=> (

<Card key={disease.id} className="space-y-4">

<div className="flex justify-between">

<h3 className="text-2xl font-bold">{disease.name}</h3>

<span className={`px-3 py-1 rounded-full ${getSeverityColor(disease.severity)}`}>
{disease.severity}
</span>

</div>

{/* Images */}

<div className="grid grid-cols-2 gap-4">

{disease.images.map((img,index)=> (

<div
key={index}
className="w-full h-[220px] flex items-center justify-center border rounded-lg bg-gray-100"
>

<img
src={img}
alt={disease.name}
className="max-h-full max-w-full object-contain"
/>

</div>

))}

</div>

<div className="grid md:grid-cols-2 gap-6">

<div>

<h4 className="font-semibold flex gap-2 items-center">
<AlertTriangle className="w-4 h-4 text-orange-500"/>
Symptoms
</h4>

<ul className="text-sm">
{disease.symptoms.map((s,i)=>(
<li key={i}>• {s}</li>
))}
</ul>

</div>

<div>

<h4 className="font-semibold flex gap-2 items-center">
<CheckCircle className="w-4 h-4 text-green-600"/>
Treatment
</h4>

<ul className="text-sm">
{disease.treatment.map((t,i)=>(
<li key={i}>• {t}</li>
))}
</ul>

</div>

</div>

</Card>

))}

</div>

</Section>

</div>

);

}