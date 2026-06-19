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
  Menu,
  X,
} from 'lucide-react'
import { DemoLoginButton } from '@/components/DemoLoginButtons'

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
    <div style={{ minHeight: '100vh', background: '#ffffff' }}>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;600;700;800&family=Inter:wght@400;500;600;700&display=swap');

        /* ── Reset margins that bleed into sections ── */
        * { box-sizing: border-box; margin: 0; padding: 0; }

        body {
          font-family: 'Inter', system-ui, sans-serif;
        }

        h1, h2, h3, h4 {
          font-family: 'Plus Jakarta Sans', sans-serif;
        }

        /* ── Mobile menu toggle (checkbox hack) ── */
        #nav-toggle { display: none; }

        .nav-links { display: flex; gap: 2.5rem; align-items: center; }
        .nav-actions { display: flex; gap: 0.875rem; align-items: center; }
        .hamburger { display: none; cursor: pointer; padding: 0.5rem; }
        .mobile-menu {
          display: none;
          flex-direction: column;
          gap: 0;
          background: #fff;
          border-top: 1px solid #e5e7eb;
          padding: 1rem 1.5rem 1.5rem;
        }

        /* ── Hover Micro-Animations ── */
        .hover-float {
          transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), 
                      box-shadow 0.4s cubic-bezier(0.16, 1, 0.3, 1), 
                      border-color 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .hover-float:hover {
          transform: translateY(-6px);
          box-shadow: 0 20px 25px -5px rgba(26, 51, 204, 0.1), 0 8px 10px -6px rgba(26, 51, 204, 0.1);
          border-color: rgba(26, 51, 204, 0.25) !important;
        }

        /* Hover animation that reveals a premium blue shade overlay */
        .hover-float-blue-shade {
          transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), 
                      box-shadow 0.4s cubic-bezier(0.16, 1, 0.3, 1), 
                      border-color 0.4s cubic-bezier(0.16, 1, 0.3, 1),
                      background-color 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .hover-float-blue-shade:hover {
          transform: translateY(-6px);
          box-shadow: 0 20px 25px -5px rgba(26, 51, 204, 0.1), 0 8px 10px -6px rgba(26, 51, 204, 0.1);
          border-color: rgba(26, 51, 204, 0.3) !important;
          background-color: rgba(26, 51, 204, 0.015) !important;
        }

        .hover-glow-blue {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .hover-glow-blue:hover {
          transform: translateY(-5px);
          box-shadow: 0 20px 25px -5px rgba(26, 51, 204, 0.1);
          border-color: rgba(26, 51, 204, 0.35) !important;
        }

        .hover-glow-green {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .hover-glow-green:hover {
          transform: translateY(-5px);
          box-shadow: 0 20px 25px -5px rgba(5, 150, 105, 0.1);
          border-color: rgba(5, 150, 105, 0.35) !important;
        }

        /* ── Pulse animation for Live Recording indicator ── */
        @keyframes pulse-recording {
          0% { transform: scale(0.95); opacity: 0.6; }
          50% { transform: scale(1.2); opacity: 1; }
          100% { transform: scale(0.95); opacity: 0.6; }
        }
        .pulse-indicator {
          animation: pulse-recording 2s infinite ease-in-out;
        }

        /* ── Grid helpers ── */
        .hero-grid { display: grid; grid-template-columns: 1fr 1.1fr; gap: 4rem; align-items: center; }
        .stats-grid { display: grid; grid-template-columns: repeat(4,1fr); gap: 2rem; text-align: center; }
        .features-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 1.75rem; }
        .workflow-grid { display: grid; grid-template-columns: repeat(4,1fr); gap: 1.5rem; position: relative; }
        .demo-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 2.5rem; max-width: 900px; margin: 0 auto; }
        .testimonials-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 1.75rem; }
        .footer-grid { display: grid; grid-template-columns: 1.2fr 1fr 1fr 1fr; gap: 3rem; margin-bottom: 3rem; }
        .stat-cards-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; }

        .workflow-arrow { display: block; }

        @media (max-width: 991px) {
          .hero-grid { grid-template-columns: 1fr; gap: 3rem; }
          .features-grid { grid-template-columns: repeat(2,1fr); }
          .testimonials-grid { grid-template-columns: repeat(2,1fr); }
        }

        @media (max-width: 768px) {
          /* Navbar */
          .nav-links { display: none; }
          .nav-actions { display: none; }
          .hamburger { display: flex; align-items: center; justify-content: center; }
          #nav-toggle:checked ~ .mobile-menu { display: flex; }
          #nav-toggle:checked ~ label .hamburger-open { display: none; }
          #nav-toggle:checked ~ label .hamburger-close { display: flex; }
          .hamburger-close { display: none; }
          .mobile-menu a {
            display: block;
            padding: 0.875rem 0;
            border-bottom: 1px solid #f3f4f6;
            color: #374151;
            text-decoration: none;
            font-size: 1rem;
            font-weight: 500;
          }
          .mobile-menu a:last-child { border-bottom: none; }
          .mobile-cta {
            margin-top: 1rem;
            display: flex;
            flex-direction: column;
            gap: 0.75rem;
          }
          .mobile-cta a {
            text-align: center;
            padding: 0.75rem 1rem !important;
            border-radius: 10px;
            font-weight: 600;
            font-size: 0.9375rem;
            text-decoration: none;
            border-bottom: none !important;
          }
          /* Hero */
          .stat-cards-grid { grid-template-columns: 1fr 1fr; gap: 1rem; }
          .hero-section { padding: 3rem 1.25rem 2rem !important; }
          .hero-buttons { flex-direction: column; gap: 0.75rem !important; }
          .hero-buttons a { text-align: center; }
          /* Stats bar */
          .stats-grid { grid-template-columns: 1fr 1fr; gap: 1.5rem; }
          .stats-section { padding: 2.5rem 1.25rem !important; }
          /* Features */
          .features-grid { grid-template-columns: 1fr; }
          .features-section { padding: 4rem 1.25rem !important; }
          /* Workflow */
          .workflow-grid { grid-template-columns: 1fr; gap: 1.5rem; }
          .workflow-arrow { display: none; }
          .workflow-section { padding: 4rem 1.25rem !important; }
          /* Demo */
          .demo-grid { grid-template-columns: 1fr; max-width: 100%; gap: 1.75rem; }
          .demo-section { padding: 4rem 1.25rem !important; }
          /* Testimonials */
          .testimonials-grid { grid-template-columns: 1fr; }
          .testimonials-section { padding: 4rem 1.25rem !important; }
          /* FAQ */
          .faq-section { padding: 4rem 1.25rem !important; }
          /* Footer */
          .footer-grid { grid-template-columns: 1fr 1fr; gap: 2rem; }
          .footer-section { padding: 4rem 1.25rem 1.5rem !important; }
          .footer-bottom { flex-direction: column; gap: 0.5rem; text-align: center; }
          /* Rolling belt */
          .belt-section { padding: 2rem 0 !important; }
        }

        @media (max-width: 480px) {
          .footer-grid { grid-template-columns: 1fr; }
          .stats-grid { grid-template-columns: 1fr; }
          .stat-cards-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      {/* Navbar */}
      <nav style={{ position: 'sticky', top: 0, zIndex: 50, background: 'rgba(255,255,255,0.97)', backdropFilter: 'blur(12px)', borderBottom: '1px solid #e5e7eb' }}>
        {/* Outer Container: Increased height to '84px' and horizontal padding to '2rem' */}
        <div style={{ padding: '0 2rem', height: '96px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', maxWidth: '1280px', margin: '0 auto' }}>
          
          <Link href="/" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', textDecoration: 'none', flexShrink: 0 }}>
            {/* Logo Image: Increased dimensions to 160x34 */}
            <img src="https://enlightlab.com/wp-content/uploads/2023/03/Layer_1.png" alt="Enlight Lab" width={170} height={36} style={{ objectFit: 'contain' }} />
            {/* Subtext: Scaled font to '0.65rem' and aligned margin-left to '39px' */}
            <span style={{ fontSize: '0.65rem', fontWeight: 700, color: '#0A1F6B', letterSpacing: '0.15em', textTransform: 'uppercase', marginTop: '2px', marginLeft: '39px' }}>
              CARESCRIBE AI
            </span>
          </Link>
          
          {/* Nav Links: Increased font size to '1rem' and spacing gap to '3rem' */}
          <div className="nav-links" style={{ gap: '3rem' }}>
            <a href="#features" style={{ color: '#374151', fontSize: '1rem', textDecoration: 'none', fontWeight: 500 }}>Features</a>
            <a href="#how-it-works" style={{ color: '#374151', fontSize: '1rem', textDecoration: 'none', fontWeight: 500 }}>How It Works</a>
            <a href="#demo" style={{ color: '#374151', fontSize: '1rem', textDecoration: 'none', fontWeight: 500 }}>Demo</a>
            <a href="#faq" style={{ color: '#374151', fontSize: '1rem', textDecoration: 'none', fontWeight: 500 }}>FAQ</a>
          </div>

          {/* Nav Action Buttons: Scaled fonts to '1rem' and increased padding for larger buttons */}
          <div className="nav-actions" style={{ gap: '1rem' }}>
            <Link href="/login" style={{ color: '#1a33cc', fontSize: '1rem', fontWeight: 600, textDecoration: 'none', padding: '0.65rem 1.35rem', border: '1.5px solid #1a33cc', borderRadius: '11px' }}>
              Sign In
            </Link>
            <Link href="/login" style={{ background: '#1a33cc', color: '#fff', fontSize: '1rem', fontWeight: 600, textDecoration: 'none', padding: '0.65rem 1.6rem', borderRadius: '11px', boxShadow: '0 4px 12px rgba(26,51,204,0.25)' }}>
              Try Demo →
            </Link>
          </div>
          
          {/* Hamburger */}
          <label htmlFor="nav-toggle" className="hamburger" style={{ color: '#374151' }}>
            <span className="hamburger-open"><Menu size={24} /></span>
            <span className="hamburger-close"><X size={24} /></span>
          </label>
        </div>
        
        <input type="checkbox" id="nav-toggle" style={{ display: 'none' }} />
        <div className="mobile-menu">
          <a href="#features">Features</a>
          <a href="#how-it-works">How It Works</a>
          <a href="#demo">Demo</a>
          <a href="#faq">FAQ</a>
          <div className="mobile-cta">
            <Link href="/login" style={{ color: '#1a33cc', border: '1.5px solid #1a33cc' }}>Sign In</Link>
            <Link href="/login" style={{ background: '#1a33cc', color: '#fff', boxShadow: '0 4px 12px rgba(26,51,204,0.25)' }}>Try Demo →</Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero-section" style={{ padding: '6rem 2.5rem 5rem', background: '#fff', maxWidth: '1280px', margin: '0 auto', position: 'relative', overflow: 'hidden' }}>
        
        {/* Subtle mesh background dot grid details */}
        <div className='absolute inset-0 bg-[radial-gradient(#e5e7eb_1.5px,transparent_1.5px)] [background-size:32px_32px] opacity-40 pointer-events-none' style={{ zIndex: 1 }} />
        
        {/* Centered Large Blue Glow Shade (Matching your screenshot style) */}
        <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] md:w-[1000px] h-[700px] md:h-[1000px] rounded-full pointer-events-none blur-3xl' style={{ background: 'radial-gradient(circle, rgba(26,51,204,0.09) 0%, rgba(219,234,254,0.03) 50%, rgba(255,255,255,0) 70%)', zIndex: 1 }} />
        
        <div className="hero-grid" style={{ position: 'relative', zIndex: 2 }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.6rem', background: '#f0f4ff', padding: '0.45rem 1.1rem', borderRadius: '9999px', fontSize: '0.8125rem', fontWeight: 600, color: '#1a33cc', marginBottom: '1.5rem' }}>
              <span className="pulse-indicator" style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#dc2626', display: 'inline-block' }} />
              Ambient Clinical Documentation
            </div>
            <h1 style={{ fontSize: 'clamp(2.25rem, 5vw, 3.5rem)', fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1.1, marginBottom: '1.25rem', color: '#0a0f2c' }}>
              AI that listens,<br />
              <span style={{ background: 'linear-gradient(135deg, #1a33cc 0%, #3b82f6 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                so doctors don't have to type.
              </span>
            </h1>
            <p style={{ fontSize: '1.05rem', color: '#6b7280', lineHeight: 1.7, marginBottom: '2rem', fontWeight: 400 }}>
              CareScribe AI ambiently records clinical consultations and instantly generates structured SOAP notes, ICD-10 codes, and CPT codes — letting physicians focus entirely on the patient.
            </p>
            <div className="hero-buttons" style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '1.75rem' }}>
              <Link href="/login" style={{ background: '#1a33cc', color: '#fff', padding: '0.9rem 1.9rem', borderRadius: '12px', textDecoration: 'none', fontWeight: 700, fontSize: '0.9375rem', display: 'inline-flex', alignItems: 'center', gap: '0.5rem', boxShadow: '0 8px 24px rgba(26,51,204,0.25)', transition: 'all 0.2s' }}>
                Start Free Demo →
              </Link>
              <a href="#how-it-works" style={{ background: '#f0f4ff', color: '#1a33cc', padding: '0.9rem 1.9rem', borderRadius: '12px', textDecoration: 'none', fontWeight: 700, fontSize: '0.9375rem', transition: 'all 0.2s' }}>
                See How It Works
              </a>
            </div>
            <p style={{ fontSize: '0.8125rem', color: '#9ca3af', fontWeight: 500 }}>
              ✓ No credit card required &nbsp; • &nbsp; ✓ Setup in minutes &nbsp; • &nbsp; ✓ HIPAA-compliant
            </p>
          </div>
          <div className="stat-cards-grid">
            {[
              { stat: '~3 min', label: 'Average note generation time', color: '#1a33cc', bg: '#f5f7ff', border: 'rgba(26,51,204,0.1)' },
              { stat: '98.4%', label: 'Transcription accuracy', color: '#059669', bg: '#f0fdf4', border: 'rgba(5,150,105,0.1)' },
              { stat: 'ICD-10 & CPT', label: 'Auto medical coding', color: '#7c3aed', bg: '#faf5ff', border: 'rgba(124,58,237,0.1)' },
              { stat: '0 typing', label: 'Required from physician', color: '#dc2626', bg: '#fef2f2', border: 'rgba(220,38,38,0.1)' },
            ].map((item) => (
              <div key={item.stat} className="hover-float" style={{ background: item.bg, borderRadius: '20px', padding: '1.5rem', border: `1px solid ${item.border}` }}>
                <p style={{ fontSize: '1.75rem', fontWeight: 800, color: item.color, letterSpacing: '-0.02em', marginBottom: '0.35rem' }}>{item.stat}</p>
                <p style={{ fontSize: '0.8125rem', color: '#6b7280', lineHeight: 1.45, fontWeight: 500 }}>{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="stats-section" style={{ padding: '3.5rem 2.5rem', background: '#f8f9fa', borderTop: '1px solid #eef2f6', borderBottom: '1px solid #eef2f6', position: 'relative', overflow: 'hidden' }}>
        <div className='absolute inset-0 bg-[radial-gradient(#e5e7eb_1.5px,transparent_1.5px)] [background-size:24px_24px] opacity-40 pointer-events-none' />
        <div className="stats-grid" style={{ maxWidth: '1280px', margin: '0 auto', position: 'relative', zIndex: 2 }}>
          {[
            { v: '500+', l: 'Physicians using CareScribe' },
            { v: '10k+', l: 'Notes generated monthly' },
            { v: '40%', l: 'Reduction in documentation time' },
            { v: '99.9%', l: 'Platform uptime' },
          ].map((s) => (
            <div key={s.l}>
              <p style={{ fontSize: '2rem', fontWeight: 800, color: '#1a33cc', letterSpacing: '-0.03em', marginBottom: '0.25rem' }}>{s.v}</p>
              <p style={{ fontSize: '0.875rem', color: '#4b5563', fontWeight: 600 }}>{s.l}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="features-section" style={{ padding: '6rem 2.5rem', maxWidth: '1280px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '4.5rem' }}>
          <p style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em', color: '#1a33cc', marginBottom: '0.5rem' }}>Features</p>
          <h2 style={{ fontSize: 'clamp(1.75rem, 3vw, 2.5rem)', fontWeight: 800, color: '#0a0f2c', letterSpacing: '-0.025em', marginBottom: '1.25rem', lineHeight: 1.25 }}>
            Everything a clinic needs.{' '}
            <span style={{ background: '#1a33cc', color: '#fff', padding: '0.1em 0.5em', borderRadius: '8px', display: 'inline-block' }}>Nothing extra.</span>
          </h2>
          <p style={{ color: '#6b7280', fontSize: '1.05rem', maxWidth: '600px', margin: '0 auto', lineHeight: 1.6 }}>
            From the moment the consultation starts to FHIR export — CareScribe handles the full documentation workflow.
          </p>
        </div>
        
        <div className="features-grid">
          {[
            { icon: Mic, title: 'Ambient Recording', desc: 'Records consultations in the background — no interruptions, no button pressing. The doctor speaks naturally.', color: '#1a33cc', bg: '#f5f7ff' },
            { icon: FileText, title: 'Structured SOAP Notes', desc: 'Automatically generates Subjective, Objective, Assessment, and Plan sections from the conversation transcript.', color: '#059669', bg: '#f0fdf4' },
            { icon: Tag, title: 'ICD-10 & CPT Auto-coding', desc: 'Extracts diagnosis and billing codes with confidence scores — reducing coding errors and denials.', color: '#7c3aed', bg: '#faf5ff' },
            { icon: CheckCircle2, title: 'One-click Approval', desc: 'Physicians review and approve notes instantly. Signed notes lock and become audit-ready.', color: '#dc2626', bg: '#fef2f2' },
            { icon: UploadCloud, title: 'FHIR Export', desc: 'Export approved encounters as FHIR-compliant JSON for EHR integration with Epic, Cerner, and more.', color: '#2563eb', bg: '#eff6ff' },
            { icon: ShieldCheck, title: 'HIPAA-ready Infrastructure', desc: 'End-to-end encryption, audit logs, and access controls built in from day one.', color: '#0f172a', bg: '#f8fafc' },
          ].map((f) => (
            <div key={f.title} className="hover-float-blue-shade" style={{ background: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '24px', padding: '2rem', display: 'flex', flexDirection: 'column', height: '100%' }}>
              <div style={{ marginBottom: '1.25rem', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '56px', height: '56px', borderRadius: '16px', background: f.bg, color: f.color }}>
                <f.icon size={26} strokeWidth={1.5} />
              </div>
              <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#0a0f2c', marginBottom: '0.75rem' }}>{f.title}</h3>
              <p style={{ fontSize: '0.875rem', color: '#6b7280', lineHeight: 1.65, flexGrow: 1 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="workflow-section" style={{ padding: '6rem 2.5rem', background: '#f8f9fa', borderTop: '1px solid #eef2f6' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '4.5rem' }}>
            <p style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em', color: '#1a33cc', marginBottom: '0.5rem' }}>Workflow</p>
            <h2 style={{ fontSize: 'clamp(1.75rem, 3vw, 2.5rem)', fontWeight: 800, color: '#0a0f2c', letterSpacing: '-0.025em' }}>
              From consultation to signed note in minutes
            </h2>
          </div>
          
          <div className="workflow-grid">
            {[
              { n: '01', title: 'Record', desc: 'Doctor starts a new encounter. CareScribe ambiently records the consultation.', color: '#1a33cc' },
              { n: '02', title: 'Transcribe', desc: 'AssemblyAI transcribes the conversation with speaker diarization at 98%+ accuracy.', color: '#2563eb' },
              { n: '03', title: 'Generate', desc: 'Gemini/Claude generates a structured clinical note with ICD-10 and CPT codes.', color: '#7c3aed' },
              { n: '04', title: 'Approve', desc: 'Physician reviews, edits if needed, and signs. Note is exported as FHIR.', color: '#059669' },
            ].map((step, i) => (
              <div key={step.n} className="hover-float-blue-shade" style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '24px', padding: '2.5rem 1.75rem', position: 'relative', textAlign: 'center', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.01)' }}>
                <div style={{ position: 'absolute', top: '-16px', left: '50%', transform: 'translateX(-50%)', background: step.color, color: '#fff', borderRadius: '9999px', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 800, boxShadow: `0 4px 10px ${step.color}35` }}>
                  {step.n}
                </div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0a0f2c', marginBottom: '0.75rem', marginTop: '0.5rem' }}>{step.title}</h3>
                <p style={{ fontSize: '0.875rem', color: '#6b7280', lineHeight: 1.65 }}>{step.desc}</p>
                {i < 3 && (
                  <div className="workflow-arrow" style={{ position: 'absolute', right: '-19px', top: '50%', transform: 'translateY(-50%)', color: '#1a33cc', fontSize: '1.5rem', zIndex: 10, fontWeight: 'bold', opacity: 0.4 }}>→</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Demo Section */}
      <section id="demo" className="demo-section" style={{ padding: '6rem 2.5rem', maxWidth: '1280px', margin: '0 auto', position: 'relative', overflow: 'hidden' }}>
        
        {/* Centered Blue Glow Backdrop */}
        <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] md:w-[800px] h-[600px] md:h-[800px] rounded-full pointer-events-none blur-3xl' style={{ background: 'radial-gradient(circle, rgba(26,51,204,0.06) 0%, rgba(59,130,246,0.02) 60%, rgba(255,255,255,0) 80%)', zIndex: 1 }} />
        <div style={{ textAlign: 'center', marginBottom: '4rem', position: 'relative', zIndex: 2 }}>
          <p style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em', color: '#1a33cc', marginBottom: '0.5rem' }}>Try It Now</p>
          <h2 style={{ fontSize: 'clamp(1.75rem, 3vw, 2.5rem)', fontWeight: 800, color: '#0a0f2c', letterSpacing: '-0.025em', marginBottom: '1rem' }}>
            See CareScribe in action
          </h2>
          <p style={{ color: '#6b7280', fontSize: '1.05rem', maxWidth: '500px', margin: '0 auto', lineHeight: 1.6 }}>
            Click one of the demo buttons below to explore the full dashboard interface immediately.
          </p>
        </div>
        
        <div className="demo-grid" style={{ position: 'relative', zIndex: 2 }}>
          {[
            {
              role: 'Admin Demo' as const,
              icon: Building2,
              desc: 'Access the admin dashboard manage doctors, view all encounters, monitor ICD/CPT codes.',
              email: 'admin@clinic.com',
              password: 'Admin@123',
              color: '#1a33cc',
              bg: '#f5f7ff',
              hoverClass: 'hover-glow-blue',
            },
            {
              role: 'Doctor Demo' as const,
              icon: Stethoscope,
              desc: 'Experience the doctor workflow — record a consultation, generate notes, and approve.',
              email: 'doctor@clinic.com',
              password: 'Doctor@123',
              color: '#059669',
              bg: '#f0fdf4',
              hoverClass: 'hover-glow-green',
            },
          ].map((demo) => (
            <div key={demo.role} className={demo.hoverClass} style={{ background: demo.bg, border: `1px solid ${demo.color}20`, borderRadius: '24px', padding: '2.5rem 2rem', textAlign: 'center', display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'inline-flex', alignSelf: 'center', padding: '12px', borderRadius: '16px', background: 'white', border: `1.5px solid ${demo.color}15`, marginBottom: '1.25rem', color: demo.color }}>
                <demo.icon size={32} strokeWidth={1.5} />
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0a0f2c', marginBottom: '0.75rem' }}>{demo.role}</h3>
              <p style={{ fontSize: '0.875rem', color: '#6b7280', lineHeight: 1.6, marginBottom: '1.5rem', flexGrow: 1 }}>{demo.desc}</p>
              
              <div style={{ background: 'white', borderRadius: '16px', padding: '1.25rem', marginBottom: '1.5rem', textAlign: 'left', border: '1px solid #eef2f6', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.01)' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <div>
                    <p style={{ fontSize: '0.65rem', color: '#9ca3af', fontWeight: 700, letterSpacing: '0.05em', marginBottom: '0.15rem' }}>EMAIL</p>
                    <p style={{ fontSize: '0.875rem', color: '#0a0f2c', fontWeight: 600, fontFamily: 'monospace' }}>{demo.email}</p>
                  </div>
                  <div style={{ borderTop: '1px solid #f3f4f6', paddingTop: '0.75rem' }}>
                    <p style={{ fontSize: '0.65rem', color: '#9ca3af', fontWeight: 700, letterSpacing: '0.05em', marginBottom: '0.15rem' }}>PASSWORD</p>
                    <p style={{ fontSize: '0.875rem', color: '#0a0f2c', fontWeight: 600, fontFamily: 'monospace' }}>{demo.password}</p>
                  </div>
                </div>
              </div>
              
              <DemoLoginButton role={demo.role === 'Admin Demo' ? 'admin' : 'doctor'} color={demo.color} />
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials-section" style={{ padding: '6rem 2.5rem', background: '#f8f9fa', borderTop: '1px solid #eef2f6' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <h2 style={{ textAlign: 'center', fontSize: 'clamp(1.75rem, 3vw, 2.25rem)', fontWeight: 800, color: '#0a0f2c', marginBottom: '4.5rem' }}>
            What physicians say
          </h2>
          
          <div className="testimonials-grid">
            {[
              { name: 'Dr. Sarah M.', specialty: 'Internal Medicine', quote: 'CareScribe cut my documentation time from 2 hours to 20 minutes daily. I actually leave on time now.' },
              { name: 'Dr. Rajesh K.', specialty: 'Family Practice', quote: 'The ICD coding accuracy is remarkable. Our billing rejections dropped by 60% in the first month.' },
              { name: 'Dr. Lisa T.', specialty: 'Pediatrics', quote: 'I was skeptical, but the SOAP notes are genuinely good. I approve 90% without edits.' },
            ].map((t) => (
              <div key={t.name} className="hover-float-blue-shade" style={{ background: '#fff', borderRadius: '24px', padding: '2.25rem 2rem', border: '1px solid #e2e8f0', position: 'relative', overflow: 'hidden' }}>
                <span style={{ position: 'absolute', right: '20px', top: '10px', fontSize: '6.5rem', color: '#f3f4f6', fontFamily: 'Georgia, serif', lineHeight: 1, userSelect: 'none', pointerEvents: 'none', fontWeight: 'bold', opacity: 0.6 }}>“</span>
                <div style={{ display: 'flex', gap: '0.2rem', marginBottom: '1.25rem', position: 'relative', zIndex: 1 }}>
                  {[...Array(5)].map((_, i) => <span key={i} style={{ color: '#f59e0b', fontSize: '1.1rem' }}>★</span>)}
                </div>
                <p style={{ color: '#374151', marginBottom: '1.5rem', fontStyle: 'italic', lineHeight: 1.65, fontSize: '0.9375rem', position: 'relative', zIndex: 1 }}>"{t.quote}"</p>
                <div style={{ borderTop: '1px solid #f3f4f6', paddingTop: '1rem', display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontWeight: 700, fontSize: '0.9375rem', color: '#0a0f2c' }}>{t.name}</span>
                  <span style={{ color: '#8892b0', fontSize: '0.8125rem', fontWeight: 500 }}>{t.specialty}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="faq-section" style={{ padding: '6rem 2.5rem', maxWidth: '850px', margin: '0 auto', position: 'relative', overflow: 'hidden' }}>
        
        {/* Centered Blue Glow Backdrop */}
        <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] md:w-[700px] h-[500px] md:h-[700px] rounded-full pointer-events-none blur-3xl' style={{ background: 'radial-gradient(circle, rgba(26,51,204,0.05) 0%, rgba(59,130,246,0.02) 60%, rgba(255,255,255,0) 80%)', zIndex: 1 }} />
        <div style={{ textAlign: 'center', marginBottom: '4rem', position: 'relative', zIndex: 2 }}>
          <p style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em', color: '#1a33cc', marginBottom: '0.5rem' }}>FAQ</p>
          <h2 style={{ fontSize: 'clamp(1.75rem, 3vw, 2.25rem)', fontWeight: 800, color: '#0a0f2c', letterSpacing: '-0.025em' }}>Common questions</h2>
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', position: 'relative', zIndex: 2 }}>
          {[
            { q: 'How does CareScribe record consultations?', a: 'CareScribe uses your device microphone to ambiently record the doctor-patient conversation. No special hardware required — it works in any browser.' },
            { q: 'Is patient data secure?', a: 'Yes. All audio and transcripts are encrypted in transit and at rest. The platform is designed with HIPAA compliance in mind with full audit logging.' },
            { q: 'How accurate is the transcription?', a: 'We use AssemblyAI with speaker diarization achieving 98.4% accuracy. The system distinguishes between doctor and patient speech for better note structure.' },
            { q: 'Can doctors edit the generated notes?', a: 'Absolutely. Every generated note is fully editable before approval. Doctors can use the Check Uncertain feature to highlight AI-inferred content.' },
            { q: 'Does it integrate with our EHR?', a: 'Approved encounters can be exported as FHIR-compliant JSON, which is the standard format for Epic, Cerner, and other major EHR systems.' },
          ].map((f, i) => (
            <div key={i} className="hover-float-blue-shade" style={{ background: '#ffffff', borderRadius: '20px', padding: '1.5rem 2rem', border: '1px solid #eef2f6' }}>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0a0f2c', marginBottom: '0.65rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <span style={{ color: '#1a33cc', fontWeight: 800 }}>•</span> {f.q}
              </h3>
              <p style={{ fontSize: '0.875rem', color: '#556172', lineHeight: 1.7, paddingLeft: '1rem' }}>{f.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Rolling Belt Section */}
      <section className="belt-section" style={{ background: '#1535C9', padding: '2.5rem 0 3rem', overflow: 'hidden', position: 'relative' }}>
        <p style={{ textAlign: 'center', fontSize: '0.75rem', fontWeight: 700, color: 'rgba(255,255,255,0.6)', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '1.5rem' }}>
          Trusted by Fortune-Grade Global Leaders
        </p>
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
          
          {/* Restored: original Enlight Lab logo overlay on the left side of the belt */}
          <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, zIndex: 10, background: '#1535C9', padding: '0 2rem 0 1.5rem', display: 'flex', alignItems: 'center', boxShadow: '8px 0 16px 8px #1535C9' }}>
            <img src="https://enlightlab.com/wp-content/uploads/2023/03/Layer_1.png" alt="Enlight Lab" style={{ height: '24px', filter: 'brightness(0) invert(1)', opacity: 0.9 }} />
          </div>
          
          {/* Edge gradient fading mask on the right edge */}
          <div style={{ position: 'absolute', right: 0, top: 0, bottom: 0, zIndex: 10, width: '120px', background: 'linear-gradient(to left, #1535C9 30%, transparent 100%)', pointerEvents: 'none' }} />
          
          <div style={{ display: 'flex', overflow: 'hidden', width: '100%' }}>
            <style>{`
              @keyframes scroll { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
              .rolling-belt { display: flex; align-items: center; animation: scroll 30s linear infinite; width: max-content; }
            `}</style>
            <div className="rolling-belt">
              {[
                { name: 'CNN', style: { fontFamily: 'Georgia, serif', fontSize: '1.75rem', fontWeight: 900, letterSpacing: '-0.02em' } },
                { name: 'Mozilla Foundation', style: { fontFamily: 'Inter, sans-serif', fontSize: '1rem', fontWeight: 700 } },
                { name: 'qPress', style: { fontFamily: 'Georgia, serif', fontSize: '1.5rem', fontWeight: 700, letterSpacing: '-0.03em' } },
                { name: 'Emblazer', style: { fontFamily: 'Inter, sans-serif', fontSize: '1.1rem', fontWeight: 800 } },
                { name: 'Go2ANDAMAN', style: { fontFamily: 'Inter, sans-serif', fontSize: '1rem', fontWeight: 700 } },
                { name: 'homeloft', style: { fontFamily: 'Georgia, serif', fontSize: '1.4rem', fontWeight: 400 } },
                { name: 'HUMA', style: { fontFamily: 'Inter, sans-serif', fontSize: '1.2rem', fontWeight: 700, letterSpacing: '0.1em' } },
                { name: 'Pasqal', style: { fontFamily: 'Inter, sans-serif', fontSize: '1.1rem', fontWeight: 600 } },
                { name: 'MAERSK', style: { fontFamily: 'Inter, sans-serif', fontSize: '1.2rem', fontWeight: 900, letterSpacing: '0.08em' } },
                { name: 'United Healthcare', style: { fontFamily: 'Inter, sans-serif', fontSize: '0.95rem', fontWeight: 700 } },
                
                { name: 'CNN', style: { fontFamily: 'Georgia, serif', fontSize: '1.75rem', fontWeight: 900, letterSpacing: '-0.02em' } },
                { name: 'Mozilla Foundation', style: { fontFamily: 'Inter, sans-serif', fontSize: '1rem', fontWeight: 700 } },
                { name: 'qPress', style: { fontFamily: 'Georgia, serif', fontSize: '1.5rem', fontWeight: 700, letterSpacing: '-0.03em' } },
                { name: 'Emblazer', style: { fontFamily: 'Inter, sans-serif', fontSize: '1.1rem', fontWeight: 800 } },
                { name: 'Go2ANDAMAN', style: { fontFamily: 'Inter, sans-serif', fontSize: '1rem', fontWeight: 700 } },
                { name: 'homeloft', style: { fontFamily: 'Georgia, serif', fontSize: '1.4rem', fontWeight: 400 } },
                { name: 'HUMA', style: { fontFamily: 'Inter, sans-serif', fontSize: '1.2rem', fontWeight: 700, letterSpacing: '0.1em' } },
                { name: 'Pasqal', style: { fontFamily: 'Inter, sans-serif', fontSize: '1.1rem', fontWeight: 600 } },
                { name: 'MAERSK', style: { fontFamily: 'Inter, sans-serif', fontSize: '1.2rem', fontWeight: 900, letterSpacing: '0.08em' } },
                { name: 'United Healthcare', style: { fontFamily: 'Inter, sans-serif', fontSize: '0.95rem', fontWeight: 700 } },
              ].map((brand, i) => (
                <div key={i} style={{ padding: '0 3rem', display: 'flex', alignItems: 'center', color: 'rgba(255,255,255,0.9)', whiteSpace: 'nowrap', borderRight: '1px solid rgba(255,255,255,0.12)' }}>
                  <span style={brand.style as React.CSSProperties}>{brand.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer-section" style={{ background: '#f8f9ff', borderTop: '1px solid #e5e7eb', padding: '4rem 2.5rem 2rem' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div className="footer-grid">
            <div>
              {/* Unbolded heading aligned with other column headers */}
              <h4 style={{ fontSize: '1.25rem', fontWeight: 400, color: '#111827', marginBottom: '1.25rem', fontFamily: 'Inter, sans-serif' }}>
                Tell us about the project
              </h4>
              {/* "Write to us" link */}
              <a href="mailto:contact@enlightlab.com" style={{ fontSize: '0.875rem', color: '#1a33cc', textDecoration: 'underline', fontWeight: 600, display: 'inline-block', marginBottom: '1.5rem' }}>
                Write to us
              </a>
              <p style={{ fontSize: '0.875rem', color: '#6b7280', lineHeight: 1.7, marginBottom: '1.5rem' }}>
                CareScribe AI is a product by Enlight Lab empowering startups and growing companies with impactful AI-powered software.
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
            <div>
              <h4 style={{ fontSize: '0.875rem', fontWeight: 700, color: '#1a33cc', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1.25rem' }}>Product</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {['Features', 'How It Works', 'Demo', 'FAQ', 'Sign In'].map(link => (
                  <a key={link} href={link === 'Sign In' ? '/login' : `#${link.toLowerCase().replace(' ', '-')}`} style={{ fontSize: '0.875rem', color: '#6b7280', textDecoration: 'none' }}>{link}</a>
                ))}
              </div>
            </div>
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
            <div>
              <h4 style={{ fontSize: '0.875rem', fontWeight: 700, color: '#1a33cc', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1.25rem' }}>Legal</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <a href="#" style={{ fontSize: '0.875rem', color: '#6b7280', textDecoration: 'none' }}>Privacy Policy</a>
                <a href="#" style={{ fontSize: '0.875rem', color: '#6b7280', textDecoration: 'none' }}>Terms of Use</a>
              </div>
            </div>
          </div>
          <div className="footer-bottom" style={{ borderTop: '1px solid #e5e7eb', paddingTop: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <p style={{ fontSize: '0.8125rem', color: '#9ca3af' }}>© 2026 Enlight Lab. All rights reserved.</p>
            <p style={{ fontSize: '0.8125rem', color: '#9ca3af' }}>CareScribe AI — a product by Enlight Lab</p>
          </div>
        </div>
      </footer>
    </div>
  )
}