import Link from 'next/link'
import {
  Stethoscope,
  Mic,
  FileText,
  Tag,
  CheckCircle2,
  UploadCloud,
  ShieldCheck,
  Building2,
} from 'lucide-react'
import { DemoLoginButton } from '@/components/DemoLoginButtons'

// lucide-react intentionally ships no brand/logo icons, so these two are
// small hand-rolled SVGs (fill uses currentColor, so they inherit the
// parent link's color automatically).
function FacebookIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M22 12.06C22 6.51 17.52 2 12 2S2 6.51 2 12.06c0 5.02 3.66 9.18 8.44 9.94v-7.03H7.9v-2.91h2.54V9.86c0-2.51 1.49-3.89 3.78-3.89 1.09 0 2.23.2 2.23.2v2.46h-1.26c-1.24 0-1.63.78-1.63 1.58v1.85h2.78l-.44 2.91h-2.34V22c4.78-.76 8.44-4.92 8.44-9.94z" />
    </svg>
  )
}

function LinkedinIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.36V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.38-1.85 3.62 0 4.29 2.38 4.29 5.48v6.26zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.12 20.45H3.56V9h3.56v11.45z" />
    </svg>
  )
}

export default function HomePage() {
  return (
    <div style={{ minHeight: '100vh', background: '#ffffff', fontFamily: 'Inter, system-ui, sans-serif' }}>

      {/* Navbar */}
      <nav style={{ position: 'sticky', top: 0, zIndex: 50, background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(12px)', borderBottom: '1px solid #e5e7eb', padding: '0 2.5rem', height: '96px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Link href="/" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textDecoration: 'none' }}>
          <img src="https://enlightlab.com/wp-content/uploads/2023/03/Layer_1.png" alt="Enlight Lab" width={200} height={42} style={{ objectFit: "contain" }} />
          <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#0A1F6B', letterSpacing: '0.15em', textTransform: 'uppercase', marginTop: '-2px' }}>CARESCRIBE AI</span>
        </Link>
        <div style={{ display: 'flex', gap: '2.5rem', alignItems: 'center' }}>
          <a href="#features" style={{ color: '#374151', fontSize: '1rem', textDecoration: 'none', fontWeight: 500 }}>Features</a>
          <a href="#how-it-works" style={{ color: '#374151', fontSize: '1rem', textDecoration: 'none', fontWeight: 500 }}>How It Works</a>
          <a href="#demo" style={{ color: '#374151', fontSize: '1rem', textDecoration: 'none', fontWeight: 500 }}>Demo</a>
          <a href="#faq" style={{ color: '#374151', fontSize: '1rem', textDecoration: 'none', fontWeight: 500 }}>FAQ</a>
        </div>
        <div style={{ display: 'flex', gap: '0.875rem', alignItems: 'center' }}>
          <Link href="/login" style={{ color: '#1a33cc', fontSize: '0.9375rem', fontWeight: 600, textDecoration: 'none', padding: '0.6rem 1.25rem', border: '1.5px solid #1a33cc', borderRadius: '10px' }}>
            Sign In
          </Link>
          <Link href="/login" style={{ background: '#1a33cc', color: '#fff', fontSize: '0.9375rem', fontWeight: 600, textDecoration: 'none', padding: '0.6rem 1.5rem', borderRadius: '10px', boxShadow: '0 4px 12px rgba(26,51,204,0.25)' }}>
            Try Demo →
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ padding: '5rem 2.5rem 4rem', background: '#fff', maxWidth: '1280px', margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: '#f0f4ff', padding: '0.4rem 1rem', borderRadius: '9999px', fontSize: '0.8125rem', fontWeight: 600, color: '#1a33cc', marginBottom: '1.5rem' }}>
              <Stethoscope size={16} strokeWidth={2} /> Built for Clinical Documentation
            </div>
            <h1 style={{ fontSize: 'clamp(2.25rem, 4vw, 3.25rem)', fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1.1, marginBottom: '1.5rem', color: '#0a0f2c' }}>
              AI that listens,<br />
              <span style={{ color: '#1a33cc' }}>so doctors don't have to type.</span>
            </h1>
            <p style={{ fontSize: '1.125rem', color: '#6b7280', lineHeight: 1.7, marginBottom: '2rem' }}>
              CareScribe AI ambiently records clinical consultations and instantly generates structured SOAP notes, ICD-10 codes, and CPT codes — letting physicians focus entirely on the patient.
            </p>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
              <Link href="/login" style={{ background: '#1a33cc', color: '#fff', padding: '0.875rem 1.75rem', borderRadius: '10px', textDecoration: 'none', fontWeight: 700, fontSize: '0.9375rem', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                Start Free Demo →
              </Link>
              <a href="#how-it-works" style={{ background: '#f0f4ff', color: '#1a33cc', padding: '0.875rem 1.75rem', borderRadius: '10px', textDecoration: 'none', fontWeight: 700, fontSize: '0.9375rem' }}>
                See How It Works
              </a>
            </div>
            <p style={{ fontSize: '0.8125rem', color: '#9ca3af' }}>
              ✓ No credit card required &nbsp; ✓ Setup in minutes &nbsp; ✓ HIPAA-ready
            </p>
          </div>

          {/* Stats Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
            {[
              { stat: '~3 min', label: 'Average note generation time', color: '#1a33cc', bg: '#f0f4ff' },
              { stat: '98.4%', label: 'Transcription accuracy', color: '#059669', bg: '#f0fdf4' },
              { stat: 'ICD-10', label: 'Auto medical coding', color: '#7c3aed', bg: '#faf5ff' },
              { stat: '0 typing', label: 'Required from physician', color: '#dc2626', bg: '#fef2f2' },
            ].map((item) => (
              <div key={item.stat} style={{ background: item.bg, borderRadius: '16px', padding: '1.5rem', border: `1.5px solid ${item.color}20` }}>
                <p style={{ fontSize: '1.75rem', fontWeight: 800, color: item.color, letterSpacing: '-0.02em', marginBottom: '0.25rem' }}>{item.stat}</p>
                <p style={{ fontSize: '0.8125rem', color: '#6b7280', lineHeight: 1.4 }}>{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section style={{ padding: '2.5rem 2.5rem', background: '#f9fafb', borderTop: '1px solid #e5e7eb', borderBottom: '1px solid #e5e7eb' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '2rem', textAlign: 'center' }}>
          {[
            { v: '500+', l: 'Physicians using CareScribe' },
            { v: '10k+', l: 'Notes generated monthly' },
            { v: '40%', l: 'Reduction in documentation time' },
            { v: '99.9%', l: 'Platform uptime' },
          ].map((s) => (
            <div key={s.l}>
              <p style={{ fontSize: '2rem', fontWeight: 800, color: '#1a33cc', letterSpacing: '-0.02em', marginBottom: '0.25rem' }}>{s.v}</p>
              <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>{s.l}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" style={{ padding: '5rem 2.5rem', maxWidth: '1280px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <p style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#1a33cc', marginBottom: '0.5rem' }}>Features</p>
          <h2 style={{ fontSize: 'clamp(1.75rem, 3vw, 2.5rem)', fontWeight: 800, color: '#0a0f2c', letterSpacing: '-0.025em', marginBottom: '1rem' }}>
            Everything a clinic needs.{' '}
            <span style={{ background: '#1a33cc', color: '#fff', padding: '0.1em 0.4em', borderRadius: '6px' }}>Nothing extra.</span>
          </h2>
          <p style={{ color: '#6b7280', fontSize: '1rem', maxWidth: '600px', margin: '0 auto' }}>
            From the moment the consultation starts to FHIR export — CareScribe handles the full documentation workflow.
          </p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
          {[
            { icon: Mic, title: 'Ambient Recording', desc: 'Records consultations in the background — no interruptions, no button pressing. The doctor speaks naturally.' },
            { icon: FileText, title: 'Structured SOAP Notes', desc: 'Automatically generates Subjective, Objective, Assessment, and Plan sections from the conversation transcript.' },
            { icon: Tag, title: 'ICD-10 & CPT Auto-coding', desc: 'Extracts diagnosis and billing codes with confidence scores — reducing coding errors and denials.' },
            { icon: CheckCircle2, title: 'One-click Approval', desc: 'Physicians review and approve notes instantly. Signed notes lock and become audit-ready.' },
            { icon: UploadCloud, title: 'FHIR Export', desc: 'Export approved encounters as FHIR-compliant JSON for EHR integration with Epic, Cerner, and more.' },
            { icon: ShieldCheck, title: 'HIPAA-ready Infrastructure', desc: 'End-to-end encryption, audit logs, and access controls built in from day one.' },
          ].map((f) => (
            <div key={f.title} style={{ background: '#ffffff', border: '1.5px solid #e5e7eb', borderRadius: '16px', padding: '1.75rem', transition: 'all 0.2s' }}>
              <div style={{ marginBottom: '1rem' }}>
                <f.icon size={32} strokeWidth={1.75} color="#1a33cc" />
              </div>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#0a0f2c', marginBottom: '0.75rem' }}>{f.title}</h3>
              <p style={{ fontSize: '0.875rem', color: '#6b7280', lineHeight: 1.65 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" style={{ padding: '5rem 2.5rem', background: '#f9fafb', borderTop: '1px solid #e5e7eb' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <p style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#1a33cc', marginBottom: '0.5rem' }}>Workflow</p>
            <h2 style={{ fontSize: 'clamp(1.75rem, 3vw, 2.5rem)', fontWeight: 800, color: '#0a0f2c', letterSpacing: '-0.025em' }}>
              From consultation to signed note in minutes
            </h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem', position: 'relative' }}>
            {[
              { n: '01', title: 'Record', desc: 'Doctor starts a new encounter. CareScribe ambiently records the consultation.' },
              { n: '02', title: 'Transcribe', desc: 'AssemblyAI transcribes the conversation with speaker diarization at 98%+ accuracy.' },
              { n: '03', title: 'Generate', desc: 'Gemini/Claude generates a structured clinical note with ICD-10 and CPT codes.' },
              { n: '04', title: 'Approve', desc: 'Physician reviews, edits if needed, and signs. Note is exported as FHIR.' },
            ].map((step, i) => (
              <div key={step.n} style={{ background: '#fff', border: '1.5px solid #e5e7eb', borderRadius: '16px', padding: '1.75rem', position: 'relative', textAlign: 'center' }}>
                <div style={{ position: 'absolute', top: '-14px', left: '50%', transform: 'translateX(-50%)', background: '#1a33cc', color: '#fff', borderRadius: '9999px', width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 700 }}>
                  {step.n}
                </div>
                <h3 style={{ fontSize: '1.125rem', fontWeight: 800, color: '#0a0f2c', marginBottom: '0.75rem', marginTop: '0.5rem' }}>{step.title}</h3>
                <p style={{ fontSize: '0.875rem', color: '#6b7280', lineHeight: 1.6 }}>{step.desc}</p>
                {i < 3 && (
                  <div style={{ position: 'absolute', right: '-19px', top: '50%', transform: 'translateY(-50%)', color: '#1a33cc', fontSize: '1.5rem', zIndex: 10 }}>→</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Demo Section */}
      <section id="demo" style={{ padding: '5rem 2.5rem', maxWidth: '1280px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <p style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#1a33cc', marginBottom: '0.5rem' }}>Try It Now</p>
          <h2 style={{ fontSize: 'clamp(1.75rem, 3vw, 2.5rem)', fontWeight: 800, color: '#0a0f2c', letterSpacing: '-0.025em', marginBottom: '1rem' }}>
            See CareScribe in action
          </h2>
          <p style={{ color: '#6b7280', fontSize: '1rem', maxWidth: '500px', margin: '0 auto 2.5rem' }}>
            Log in with demo credentials to explore the full platform — no setup required.
          </p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', maxWidth: '800px', margin: '0 auto' }}>
          {[
            {
              role: 'Admin Demo' as const,
              icon: Building2,
              desc: 'Access the admin dashboard manage doctors, view all encounters, monitor ICD/CPT codes.',
              email: 'admin@clinic.com',
              password: 'Admin@123',
              color: '#1a33cc',
              bg: '#f0f4ff',
            },
            {
              role: 'Doctor Demo' as const,
              icon: Stethoscope,
              desc: 'Experience the doctor workflow record a consultation, generate notes, and approve.',
              email: 'doctor@clinic.com',
              password: 'Doctor@123',
              color: '#059669',
              bg: '#f0fdf4',
            },
          ].map((demo) => (
            <div key={demo.role} style={{ background: demo.bg, border: `2px solid ${demo.color}30`, borderRadius: '20px', padding: '2rem', textAlign: 'center' }}>
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
                <demo.icon size={36} strokeWidth={1.75} color={demo.color} />
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0a0f2c', marginBottom: '0.75rem' }}>{demo.role}</h3>
              <p style={{ fontSize: '0.875rem', color: '#6b7280', lineHeight: 1.6, marginBottom: '1.5rem' }}>{demo.desc}</p>
              <div style={{ background: 'white', borderRadius: '10px', padding: '1rem', marginBottom: '1.5rem', textAlign: 'left', border: '1px solid #e5e7eb' }}>
                <p style={{ fontSize: '0.75rem', color: '#9ca3af', marginBottom: '0.25rem', fontWeight: 600 }}>EMAIL</p>
                <p style={{ fontSize: '0.875rem', color: '#0a0f2c', fontWeight: 600, fontFamily: 'monospace', marginBottom: '0.75rem' }}>{demo.email}</p>
                <p style={{ fontSize: '0.75rem', color: '#9ca3af', marginBottom: '0.25rem', fontWeight: 600 }}>PASSWORD</p>
                <p style={{ fontSize: '0.875rem', color: '#0a0f2c', fontWeight: 600, fontFamily: 'monospace' }}>{demo.password}</p>
              </div>
              <DemoLoginButton role={demo.role === 'Admin Demo' ? 'admin' : 'doctor'} color={demo.color} />
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section style={{ padding: '5rem 2.5rem', background: '#f9fafb', borderTop: '1px solid #e5e7eb' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <h2 style={{ textAlign: 'center', fontSize: 'clamp(1.5rem, 3vw, 2rem)', fontWeight: 800, color: '#0a0f2c', marginBottom: '3rem' }}>
            What physicians say
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
            {[
              { name: 'Dr. Sarah M.', specialty: 'Internal Medicine', quote: 'CareScribe cut my documentation time from 2 hours to 20 minutes daily. I actually leave on time now.' },
              { name: 'Dr. Rajesh K.', specialty: 'Family Practice', quote: 'The ICD coding accuracy is remarkable. Our billing rejections dropped by 60% in the first month.' },
              { name: 'Dr. Lisa T.', specialty: 'Pediatrics', quote: 'I was skeptical, but the SOAP notes are genuinely good. I approve 90% without edits.' },
            ].map((t) => (
              <div key={t.name} style={{ background: '#fff', borderRadius: '16px', padding: '1.75rem', border: '1.5px solid #e5e7eb' }}>
                <div style={{ display: 'flex', gap: '0.25rem', marginBottom: '1rem' }}>
                  {[...Array(5)].map((_, i) => <span key={i} style={{ color: '#f59e0b', fontSize: '1rem' }}>★</span>)}
                </div>
                <p style={{ color: '#374151', marginBottom: '1.25rem', fontStyle: 'italic', lineHeight: 1.6, fontSize: '0.9375rem' }}>"{t.quote}"</p>
                <p style={{ fontWeight: 700, fontSize: '0.875rem', color: '#0a0f2c' }}>{t.name}</p>
                <p style={{ color: '#6b7280', fontSize: '0.8125rem' }}>{t.specialty}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" style={{ padding: '5rem 2.5rem', maxWidth: '800px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <p style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#1a33cc', marginBottom: '0.5rem' }}>FAQ</p>
          <h2 style={{ fontSize: 'clamp(1.75rem, 3vw, 2.25rem)', fontWeight: 800, color: '#0a0f2c', letterSpacing: '-0.025em' }}>Common questions</h2>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {[
            { q: 'How does CareScribe record consultations?', a: 'CareScribe uses your device microphone to ambiently record the doctor-patient conversation. No special hardware required — it works in any browser.' },
            { q: 'Is patient data secure?', a: 'Yes. All audio and transcripts are encrypted in transit and at rest. The platform is designed with HIPAA compliance in mind with full audit logging.' },
            { q: 'How accurate is the transcription?', a: 'We use AssemblyAI with speaker diarization achieving 98.4% accuracy. The system distinguishes between doctor and patient speech for better note structure.' },
            { q: 'Can doctors edit the generated notes?', a: 'Absolutely. Every generated note is fully editable before approval. Doctors can use the Check Uncertain feature to highlight AI-inferred content.' },
            { q: 'Does it integrate with our EHR?', a: 'Approved encounters can be exported as FHIR-compliant JSON, which is the standard format for Epic, Cerner, and other major EHR systems.' },
          ].map((f, i) => (
            <div key={i} style={{ background: '#f9fafb', borderRadius: '12px', padding: '1.5rem', border: '1px solid #e5e7eb' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#0a0f2c', marginBottom: '0.5rem' }}>{f.q}</h3>
              <p style={{ fontSize: '0.875rem', color: '#6b7280', lineHeight: 1.65, margin: 0 }}>{f.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}


      {/* Trusted By — Rolling Belt */}
      
      {/* Trusted By — Rolling Belt */}
      <section style={{ background: '#1535C9', padding: '2rem 0 2.5rem', overflow: 'hidden', position: 'relative' }}>
        <p style={{ textAlign: 'center', fontSize: '0.7rem', fontWeight: 600, color: 'rgba(255,255,255,0.5)', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '1.25rem' }}>
          Trusted by Fortune-Grade Global Leaders
        </p>
        
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
          
          {/* Static Enlight Lab logo — fixed on left, overlaps the scroll */}
          <div style={{ 
            position: 'absolute', 
            left: 0, 
            top: 0, 
            bottom: 0,
            zIndex: 10, 
            background: '#1535C9',
            padding: '0 2rem 0 2.5rem',
            display: 'flex',
            alignItems: 'center',
            boxShadow: '8px 0 16px 8px #1535C9'
          }}>
            <img 
              src="https://enlightlab.com/wp-content/uploads/2023/03/Layer_1.png" 
              alt="Enlight Lab" 
              style={{ height: '28px', filter: 'brightness(0) invert(1)', opacity: 0.9 }} 
            />
          </div>

          {/* Scrolling brands */}
          <div style={{ display: 'flex', overflow: 'hidden', width: '100%' }}>
            <style>{`
              @keyframes scroll {
                0% { transform: translateX(0); }
                100% { transform: translateX(-50%); }
              }
              .rolling-belt {
                display: flex;
                align-items: center;
                animation: scroll 25s linear infinite;
                width: max-content;
              }
              
            `}</style>
            <div className="rolling-belt">
              {[
                { name: 'CNN', style: { fontFamily: 'Georgia, serif', fontSize: '1.75rem', fontWeight: 900, letterSpacing: '-0.02em' } },
                { name: 'Mozilla Foundation', style: { fontFamily: 'Inter, sans-serif', fontSize: '1rem', fontWeight: 700 }},
                { name: 'qPress', style: { fontFamily: 'Georgia, serif', fontSize: '1.5rem', fontWeight: 700, letterSpacing: '-0.03em' } },
                { name: 'Emblazer', style: { fontFamily: 'Inter, sans-serif', fontSize: '1.1rem', fontWeight: 800 } },
                { name: 'Go2ANDAMAN', style: { fontFamily: 'Inter, sans-serif', fontSize: '1rem', fontWeight: 700 }},
                { name: 'homeloft', style: { fontFamily: 'Georgia, serif', fontSize: '1.4rem', fontWeight: 400 } },
                { name: 'HUMA', style: { fontFamily: 'Inter, sans-serif', fontSize: '1.2rem', fontWeight: 700, letterSpacing: '0.1em' }},
                { name: 'Pasqal', style: { fontFamily: 'Inter, sans-serif', fontSize: '1.1rem', fontWeight: 600 }},
                { name: 'MAERSK', style: { fontFamily: 'Inter, sans-serif', fontSize: '1.2rem', fontWeight: 900, letterSpacing: '0.08em' }},
                { name: 'United Healthcare', style: { fontFamily: 'Inter, sans-serif', fontSize: '0.95rem', fontWeight: 700 }},
                // duplicate for seamless loop
                { name: 'CNN', style: { fontFamily: 'Georgia, serif', fontSize: '1.75rem', fontWeight: 900, letterSpacing: '-0.02em' } },
                { name: 'Mozilla Foundation', style: { fontFamily: 'Inter, sans-serif', fontSize: '1rem', fontWeight: 700 }},
                { name: 'qPress', style: { fontFamily: 'Georgia, serif', fontSize: '1.5rem', fontWeight: 700, letterSpacing: '-0.03em' } },
                { name: 'Emblazer', style: { fontFamily: 'Inter, sans-serif', fontSize: '1.1rem', fontWeight: 800 } },
                { name: 'Go2ANDAMAN', style: { fontFamily: 'Inter, sans-serif', fontSize: '1rem', fontWeight: 700 }},
                { name: 'homeloft', style: { fontFamily: 'Georgia, serif', fontSize: '1.4rem', fontWeight: 400 } },
                { name: 'HUMA', style: { fontFamily: 'Inter, sans-serif', fontSize: '1.2rem', fontWeight: 700, letterSpacing: '0.1em' }},
                { name: 'Pasqal', style: { fontFamily: 'Inter, sans-serif', fontSize: '1.1rem', fontWeight: 600 }},
                { name: 'MAERSK', style: { fontFamily: 'Inter, sans-serif', fontSize: '1.2rem', fontWeight: 900, letterSpacing: '0.08em' }},
                { name: 'United Healthcare', style: { fontFamily: 'Inter, sans-serif', fontSize: '0.95rem', fontWeight: 700 }},
              ].map((brand, i) => (
                <div key={i} style={{ padding: '0 2.5rem', display: 'flex', alignItems: 'center', color: 'rgba(255,255,255,0.85)', whiteSpace: 'nowrap', borderRight: '1px solid rgba(255,255,255,0.15)' }}>
                  <span style={brand.style as React.CSSProperties}>
                    {(brand as any).prefix}{brand.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ background: '#f8f9ff', borderTop: '1px solid #e5e7eb', padding: '4rem 2.5rem 2rem' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '3rem', marginBottom: '3rem' }}>
            
            {/* Brand column */}
            <div>
              <img src="https://enlightlab.com/wp-content/uploads/2023/03/Layer_1.png" alt="Enlight Lab" style={{ height: '28px', marginBottom: '1rem' }} />
              <p style={{ fontSize: '0.875rem', color: '#6b7280', lineHeight: 1.7, marginBottom: '1.5rem' }}>
                CareScribe AI is a product by Enlight Lab — empowering startups and growing companies with impactful AI-powered software since 2021.
              </p>
              <p style={{ fontSize: '0.75rem', fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.75rem' }}>Follow us on</p>
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <a href="https://www.facebook.com/enlightlabfb/" style={{ width: '36px', height: '36px', background: '#1a33cc', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none' }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="white"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                </a>
                <a href="https://linkedin.com/company/enlightlab" style={{ width: '36px', height: '36px', background: '#1a33cc', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none' }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="white"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                </a>
              </div>
            </div>

            {/* Product column */}
            <div>
              <h4 style={{ fontSize: '0.875rem', fontWeight: 700, color: '#1a33cc', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1.25rem' }}>Product</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {['Features', 'How It Works', 'Demo', 'FAQ', 'Sign In'].map(link => (
                  <a key={link} href={link === 'Sign In' ? '/login' : `#${link.toLowerCase().replace(' ', '-')}`} style={{ fontSize: '0.875rem', color: '#6b7280', textDecoration: 'none' }}>{link}</a>
                ))}
              </div>
            </div>

            {/* Company column */}
            <div>
              <h4 style={{ fontSize: '0.875rem', fontWeight: 700, color: '#1a33cc', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1.25rem' }}>Company</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {[
                  { label: 'About Enlight Lab', href: 'https://enlightlab.com/about' },
                  { label: 'Case Studies', href: 'https://enlightlab.com/case-study/' },
                  { label: 'Blog', href: 'https://enlightlab.com/blog' },
                  { label: 'Contact', href: 'https://enlightlab.com/contact' },
                ].map(link => (
                  <a key={link.label} href={link.href} style={{ fontSize: '0.875rem', color: '#6b7280', textDecoration: 'none' }}>{link.label}</a>
                ))}
              </div>
            </div>

            {/* Legal column */}
            <div>
              <h4 style={{ fontSize: '0.875rem', fontWeight: 700, color: '#1a33cc', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1.25rem' }}>Legal</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <a href="#" style={{ fontSize: '0.875rem', color: '#6b7280', textDecoration: 'none' }}>Privacy Policy</a>
                <a href="#" style={{ fontSize: '0.875rem', color: '#6b7280', textDecoration: 'none' }}>Terms of Use</a>
                <a href="mailto:contact@enlightlab.com" style={{ fontSize: '0.875rem', color: '#6b7280', textDecoration: 'none' }}>contact@enlightlab.com</a>
              </div>
            </div>
          </div>

          {/* Bottom bar */}
          <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <p style={{ fontSize: '0.8125rem', color: '#9ca3af' }}>© 2026 Enlight Lab. All rights reserved.</p>
            <p style={{ fontSize: '0.8125rem', color: '#9ca3af' }}>CareScribe AI — a product by Enlight Lab</p>
          </div>
        </div>
      </footer>
    </div>
  )
}