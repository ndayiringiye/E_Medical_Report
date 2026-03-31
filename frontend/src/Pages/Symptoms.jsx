import { useState } from "react";
import { User, Mail, Calendar, Globe, HeartPulse, CheckCircle, LayoutDashboard, ClipboardList, Activity, Settings, LogOut, HelpCircle, ChevronRight, Stethoscope } from "lucide-react";
import axios from "axios";

const formSteps = [
  { label: "Full Name", name: "fullName", placeholder: "Enter your full name (as on ID)", icon: User, color: "text-cyan-400" },
  { label: "Email", name: "email", placeholder: "Enter your email address", icon: Mail, color: "text-cyan-400" },
  { label: "Gender", name: "gender", placeholder: "Male or Female?", icon: User, color: "text-cyan-400" },
  { label: "Age", name: "age", placeholder: "Your age (10 – 25)", icon: Calendar, color: "text-cyan-400" },
  { label: "Nationality", name: "nationality", placeholder: "Your nationality", icon: Globe, color: "text-cyan-400" },
  { label: "Region or Quartier", name: "quartier", placeholder: "Your region or quartier", icon: Globe, color: "text-cyan-400" },
  { label: "How Are You Feeling?", name: "howDoYouFeeling", placeholder: "Describe your symptoms", icon: HeartPulse, color: "text-cyan-400" },
  { label: "Duration of Illness", name: "durationOfDiseases", placeholder: "When did it start?", icon: Calendar, color: "text-cyan-400" },
  { label: "Treatment History", name: "session", placeholder: "Any past treatment?", icon: HeartPulse, color: "text-cyan-400" },
  { label: "Other Services Needed", name: "whichOtherSevicesDoYouWant", placeholder: "Any other services needed?", icon: HeartPulse, color: "text-cyan-400" },
];

const sidebarNav = [
  { label: "Dashboard", icon: LayoutDashboard, active: true },
  { label: "My Reports", icon: ClipboardList },
  { label: "Symptoms", icon: HeartPulse },
  { label: "Activity", icon: Activity },
  { label: "Profile", icon: User },
  { label: "Settings", icon: Settings },
];

const sidebarBottom = [
  { label: "Help & Support", icon: HelpCircle },
  { label: "Logout", icon: LogOut },
];

const stepGroups = [
  { title: "Personal Info", steps: [0, 1, 2, 3, 4, 5] },
  { title: "Health Details", steps: [6, 7, 8, 9] },
];

export default function Symptoms() {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const [showPopup, setShowPopup] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const completedCount = Object.keys(formData).filter(k => formData[k]?.trim()).length;
  const personalDone = [0,1,2,3,4,5].filter(i => formData[formSteps[i].name]?.trim()).length;
  const healthDone = [6,7,8,9].filter(i => formData[formSteps[i].name]?.trim()).length;

  const handleNext = async () => {
    const currentField = formSteps[step].name;
    const currentLabel = formSteps[step].label;
    const currentValue = formData[currentField];

    if (!currentValue || currentValue.trim() === "") {
      setErrors(prev => ({ ...prev, [currentField]: `${currentLabel} is required` }));
      return;
    }
    setErrors(prev => ({ ...prev, [currentField]: null }));

    if (step < formSteps.length - 1) {
      setStep(prev => prev + 1);
    } else {
      try {
        setIsSubmitting(true);
        const response = await axios.post("http://localhost:4000/api/user/symptoms", formData);
        console.log("Submitted:", response.data);
        setShowPopup(true);
      } catch (error) {
        console.error("Submission error:", error);
        setShowPopup(true); // show popup for demo even on error
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }));
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleNext();
  };

  const { label, name, placeholder, icon: Icon } = formSteps[step];

  // Donut chart math
  const radius = 54;
  const circ = 2 * Math.PI * radius;
  const pct = completedCount / formSteps.length;
  const dashOffset = circ * (1 - pct);

  return (
    <div className="flex h-screen bg-gray-100 font-sans overflow-hidden">
      {/* ── Sidebar ── */}
      <aside className="w-64 bg-gray-950 flex flex-col shrink-0 h-full">
        {/* Logo */}
        <div className="flex items-center gap-3 px-6 py-6 border-b border-gray-800">
          <div className="w-8 h-8 rounded-lg bg-cyan-500 flex items-center justify-center">
            <Stethoscope size={16} className="text-gray-950" />
          </div>
          <span className="text-white font-bold text-lg tracking-tight">MediCheck</span>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          {sidebarNav.map(({ label, icon: NavIcon, active }) => (
            <button
              key={label}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                active
                  ? "bg-cyan-500 text-gray-950"
                  : "text-gray-400 hover:bg-gray-800 hover:text-white"
              }`}
            >
              <NavIcon size={18} />
              {label}
            </button>
          ))}
        </nav>

        {/* Bottom nav */}
        <div className="px-4 pb-6 space-y-1 border-t border-gray-800 pt-4">
          {sidebarBottom.map(({ label, icon: NavIcon }) => (
            <button
              key={label}
              className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-gray-400 hover:bg-gray-800 hover:text-white transition-all"
            >
              <NavIcon size={18} />
              {label}
            </button>
          ))}
        </div>
      </aside>

      {/* ── Main ── */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between shrink-0">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Health Assessment</h1>
            <p className="text-sm text-gray-500 mt-0.5">Complete your symptom intake form — we'll connect you with the right care</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-cyan-100 flex items-center justify-center">
              <User size={18} className="text-cyan-600" />
            </div>
            <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center">
              <Settings size={18} className="text-gray-500" />
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 overflow-auto p-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">

            {/* ── Centre column: form ── */}
            <div className="lg:col-span-2 flex flex-col gap-6">

              {/* Step groups */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center justify-between mb-5">
                  <h2 className="font-semibold text-gray-800 text-base">Your Intake Form</h2>
                  <span className="text-xs font-medium text-gray-400">Step {step + 1} of {formSteps.length}</span>
                </div>

                {/* Two-group progress pills */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {formSteps.map((s, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        // only allow navigating to completed steps or current
                        if (i <= step) setStep(i);
                      }}
                      className={`w-8 h-8 rounded-full text-xs font-semibold transition-all ${
                        i < step
                          ? "bg-cyan-500 text-gray-950"
                          : i === step
                          ? "bg-gray-900 text-white ring-2 ring-offset-2 ring-gray-900"
                          : "bg-gray-100 text-gray-400"
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>

                {/* Active field card */}
                <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-cyan-50 flex items-center justify-center">
                      <Icon size={20} className="text-cyan-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 uppercase tracking-wider font-medium">Current field</p>
                      <p className="text-base font-semibold text-gray-800">{label}</p>
                    </div>
                  </div>

                  <input
                    type="text"
                    name={name}
                    placeholder={placeholder}
                    value={formData[name] || ""}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                    autoFocus
                    className={`w-full bg-white border rounded-lg px-4 py-3 text-sm text-gray-800 outline-none transition-all placeholder:text-gray-300 ${
                      errors[name]
                        ? "border-red-400 focus:ring-2 focus:ring-red-100"
                        : "border-gray-200 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-50"
                    }`}
                  />
                  {errors[name] && (
                    <p className="text-red-500 text-xs mt-1.5">{errors[name]}</p>
                  )}

                  <div className="flex justify-end mt-4">
                    <button
                      onClick={handleNext}
                      disabled={isSubmitting}
                      className="flex items-center gap-2 bg-gray-900 hover:bg-gray-700 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-all disabled:opacity-50"
                    >
                      {step === formSteps.length - 1
                        ? isSubmitting ? "Submitting…" : "Submit"
                        : <>Next <ChevronRight size={16} /></>
                      }
                    </button>
                  </div>
                </div>
              </div>

              {/* Summary cards row */}
              <div className="grid grid-cols-3 gap-4">
                {[
                  { label: "Total Steps", value: formSteps.length, sub: "Intake fields", accent: "bg-gray-900 text-white" },
                  { label: "Completed", value: completedCount, sub: "Fields filled", accent: "bg-white text-gray-900 border border-gray-100" },
                  { label: "Remaining", value: formSteps.length - completedCount, sub: "Fields left", accent: "bg-white text-gray-900 border border-gray-100" },
                ].map(({ label, value, sub, accent }) => (
                  <div key={label} className={`rounded-2xl p-5 shadow-sm flex flex-col gap-1 ${accent}`}>
                    <span className="text-3xl font-bold">{value}</span>
                    <span className={`text-xs font-medium uppercase tracking-wide ${accent.includes("bg-gray-900") ? "text-gray-400" : "text-gray-500"}`}>{sub}</span>
                    <span className={`text-sm font-semibold mt-1 flex items-center gap-1 ${accent.includes("bg-gray-900") ? "text-cyan-400" : "text-gray-700"}`}>
                      {label} <ChevronRight size={14} />
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* ── Right column ── */}
            <div className="flex flex-col gap-6">

              {/* Donut progress card */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-semibold text-gray-800 text-base">Form Progress</h3>
                </div>
                <p className="text-xs text-gray-400 mb-5">Completion Overview</p>

                {/* SVG donut */}
                <div className="flex justify-center mb-5">
                  <svg width="140" height="140" viewBox="0 0 140 140">
                    <circle cx="70" cy="70" r={radius} fill="none" stroke="#f3f4f6" strokeWidth="14" />
                    <circle
                      cx="70" cy="70" r={radius}
                      fill="none"
                      stroke="#06b6d4"
                      strokeWidth="14"
                      strokeDasharray={circ}
                      strokeDashoffset={dashOffset}
                      strokeLinecap="round"
                      transform="rotate(-90 70 70)"
                      style={{ transition: "stroke-dashoffset 0.4s ease" }}
                    />
                    <text x="70" y="66" textAnchor="middle" fontSize="22" fontWeight="700" fill="#111827">{completedCount}</text>
                    <text x="70" y="83" textAnchor="middle" fontSize="10" fill="#9ca3af">Filled</text>
                  </svg>
                </div>

                {/* Legend */}
                <div className="space-y-2">
                  {[
                    { label: "Personal Info", done: personalDone, total: 6, color: "#06b6d4" },
                    { label: "Health Details", done: healthDone, total: 4, color: "#6b7280" },
                    { label: "Remaining", done: formSteps.length - completedCount, total: formSteps.length, color: "#e5e7eb" },
                  ].map(({ label, done, total, color }) => (
                    <div key={label} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full inline-block" style={{ background: color }} />
                        <span className="text-gray-600">{label}</span>
                      </div>
                      <span className="font-semibold text-gray-800">{Math.round((done / total) * 100)}%</span>
                    </div>
                  ))}
                </div>

                <button className="w-full mt-5 bg-gray-900 hover:bg-gray-700 text-white text-sm font-semibold py-2.5 rounded-xl transition-all">
                  See Details
                </button>
              </div>

              {/* Steps checklist */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h3 className="font-semibold text-gray-800 text-base mb-4">All Steps</h3>
                <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
                  {formSteps.map((s, i) => {
                    const filled = !!formData[s.name]?.trim();
                    const current = i === step;
                    return (
                      <div
                        key={i}
                        className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all cursor-pointer ${
                          current ? "bg-cyan-50 border border-cyan-200" : "hover:bg-gray-50"
                        }`}
                        onClick={() => i <= step && setStep(i)}
                      >
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${
                          filled ? "bg-cyan-500" : current ? "bg-gray-900" : "bg-gray-100"
                        }`}>
                          {filled
                            ? <CheckCircle size={12} className="text-white" />
                            : <span className={`text-[10px] font-bold ${current ? "text-white" : "text-gray-400"}`}>{i + 1}</span>
                          }
                        </div>
                        <span className={`flex-1 truncate ${current ? "text-gray-800 font-medium" : filled ? "text-gray-500 line-through" : "text-gray-500"}`}>
                          {s.label}
                        </span>
                        {current && <ChevronRight size={14} className="text-cyan-500 shrink-0" />}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Success popup ── */}
      {showPopup && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 text-center space-y-4 animate-in fade-in slide-in-from-bottom-4">
            <div className="w-16 h-16 rounded-full bg-cyan-50 flex items-center justify-center mx-auto">
              <CheckCircle size={32} className="text-cyan-500" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Thank you!</h2>
            <p className="text-gray-500 text-sm leading-relaxed">
              Your symptoms are being reviewed by our expert nursing team. Please wait patiently while we assess your condition.
              <br /><br />
              <span className="font-medium text-gray-700">📩 Check your email</span> for further updates or instructions.
            </p>
            <button
              onClick={() => setShowPopup(false)}
              className="w-full bg-gray-900 hover:bg-gray-700 text-white font-semibold py-3 rounded-xl transition-all"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}