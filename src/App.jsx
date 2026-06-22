import { useState } from "react";
import { useForm } from "react-hook-form";

// ─── GOOGLE FORM CONFIG ───────────────────────────────────────────────────────
// Verified against the live form's page source (FB_PUBLIC_LOAD_DATA_ + <form action>).
const GOOGLE_FORM_ACTION =
  "https://docs.google.com/forms/u/0/d/e/1FAIpQLSdEZcJ2zvdJVZOJmz8cld9uiCA6ti-yP1L0CSkupwMxRVf0fA/formResponse";

const FIELD_MAP = {
  firstName: "entry.899116314",
  lastName:  "entry.670497132",
  email:     "entry.1512758262",
  phone:     "entry.1667634645",
  service:   "entry.1104712729",
  address:   "entry.1267127085",
  city:      "entry.1120369200",
  state:     "entry.1121767032",
  zip:       "entry.1618767148",
  country:   "entry.100702515",
};

const SERVICES = [
  { value: "Internet Only",          label: "Internet Only" },
  { value: "Internet +TV Bundle",    label: "Internet + TV Bundle" },
  { value: "TV Only",                label: "TV Only" },
];

export default function ServiceRequestForm() {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({ mode: "onBlur" });

  const onSubmit = async (data) => {
    setSubmitting(true);
    try {
      const body = new URLSearchParams();
      Object.entries(FIELD_MAP).forEach(([key, entryId]) => {
        body.append(entryId, data[key] ?? "");
      });

      // Google Forms requires no-cors fetch (it returns opaque response, but still submits)
      await fetch(GOOGLE_FORM_ACTION, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: body.toString(),
      });

      setSubmitted(true);
      reset();
    } catch (err) {
      console.error("Submission error:", err);
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-10 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-5">
            <svg className="w-8 h-8 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-semibold text-slate-800 mb-2">Request received</h2>
          <p className="text-slate-500 text-sm mb-7">
            Thanks for reaching out. We'll review your details and get back to you shortly.
          </p>
          <button
            onClick={() => setSubmitted(false)}
            className="text-sm text-blue-500 hover:text-blue-600 font-medium transition-colors"
          >
            Submit another request
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-2xl mx-auto">

        {/* Logo */}
        <div className="flex justify-center">
          <div className="flex items-center gap-3">
              <img src="nexgenlogo.png" className="w-auto h-50" alt="" />
            {/* <span className="text-2xl font-bold text-slate-800">NexGen</span> */}
          </div>
        </div>

        {/* Header */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 mb-4">
            {/* <div className="w-7 h-7 rounded-lg bg-blue-500 flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.288 15.038a5.25 5.25 0 017.424 0M5.106 11.856c3.807-3.808 9.98-3.808 13.788 0M1.924 8.674c5.565-5.565 14.587-5.565 20.152 0M12.53 18.22l-.53.53-.53-.53a.75.75 0 011.06 0z" />
              </svg>
            </div> */}
            {/* <span className="text-sm font-medium text-blue-500 tracking-wide uppercase">Service Request</span> */}
          </div>
          <h1 className="text-3xl font-semibold text-slate-800 mb-1">Get connected</h1>
          <p className="text-slate-400 text-sm">Fill out the form and our team will reach out to you as soon as possible.</p>
        </div>

        {/* Card */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-white rounded-2xl shadow-sm border border-slate-100 divide-y divide-slate-50"
          noValidate
        >

          {/* Personal Info */}
          <section className="p-6 sm:p-8">
            {/* <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-5">Personal info</h2> */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="First name" error={errors.firstName?.message}>
                <input
                  {...register("firstName", { required: "First name is required" })}
                  placeholder="Jane"
                  className={input(errors.firstName)}
                />
              </Field>
              <Field label="Last name" error={errors.lastName?.message}>
                <input
                  {...register("lastName", { required: "Last name is required" })}
                  placeholder="Smith"
                  className={input(errors.lastName)}
                />
              </Field>
              <Field label="Email" error={errors.email?.message} className="sm:col-span-2">
                <input
                  type="email"
                  {...register("email", {
                    required: "Email is required",
                    pattern: { value: /^\S+@\S+\.\S+$/, message: "Enter a valid email" },
                  })}
                  placeholder="jane@example.com"
                  className={input(errors.email)}
                />
              </Field>
              <Field label="Phone number" error={errors.phone?.message} className="sm:col-span-2">
                <input
                  type="tel"
                  {...register("phone", {
                    required: "Phone number is required",
                    pattern: { value: /^[\d\s\-\+\(\)]{7,15}$/, message: "Enter a valid phone number" },
                  })}
                  placeholder="+1 (555) 000-0000"
                  className={input(errors.phone)}
                />
              </Field>
            </div>
          </section>
          

          {/* Service Selection */}
          <section className="p-6 sm:p-8">
            <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-5">Service</h2>
            <Field label="What are you interested in?" error={errors.service?.message}>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-1">
                {SERVICES.map(({ value, label }) => (
                  <label key={value} className="relative cursor-pointer">
                    <input
                      type="radio"
                      value={value}
                      {...register("service", { required: "Please select a service" })}
                      className="peer sr-only"
                    />
                    <div className="border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-600 font-medium text-center transition-all
                      peer-checked:border-blue-400 peer-checked:bg-blue-50 peer-checked:text-blue-600
                      hover:border-slate-300 hover:bg-slate-50">
                      {label}
                    </div>
                    <div className="absolute top-2.5 right-2.5 w-3.5 h-3.5 rounded-full border-2 border-slate-200 transition-all
                      peer-checked:border-blue-400 peer-checked:bg-blue-400 hidden peer-checked:flex items-center justify-center">
                    </div>
                  </label>
                ))}
              </div>
            </Field>
          </section>

          {/* Address */}
          <section className="p-6 sm:p-8">
            <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-5">Address</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Street address" error={errors.address?.message} className="sm:col-span-2">
                <input
                  {...register("address", { required: "Address is required" })}
                  placeholder="123 Main Street"
                  className={input(errors.address)}
                />
              </Field>
              <Field label="City" error={errors.city?.message}>
                <input
                  {...register("city", { required: "City is required" })}
                  placeholder="San Francisco"
                  className={input(errors.city)}
                />
              </Field>
              <Field label="State" error={errors.state?.message}>
                <input
                  {...register("state", { required: "State is required" })}
                  placeholder="California"
                  className={input(errors.state)}
                />
              </Field>
              <Field label="ZIP code" error={errors.zip?.message}>
                <input
                  {...register("zip", {
                    required: "ZIP code is required",
                    pattern: { value: /^\d{5}(-\d{4})?$/, message: "Enter a valid ZIP code" },
                  })}
                  placeholder="94103"
                  className={input(errors.zip)}
                />
              </Field>
              <Field label="Country" error={errors.country?.message}>
                <input
                  {...register("country", { required: "Country is required" })}
                  placeholder="United States"
                  className={input(errors.country)}
                />
              </Field>
            </div>
          </section>

          {/* Submit */}
          <div className="p-6 sm:p-8">
            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white font-medium text-sm py-3.5 rounded-xl transition-colors duration-150 flex items-center justify-center gap-2"
            >
              {submitting ? (
                <>
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  Submitting…
                </>
              ) : (
                "Submit request"
              )}
            </button>
            <p className="text-center text-xs text-slate-400 mt-3">
              We'll never share your information with third parties.
            </p>
          </div>

        </form>
      </div>
    </div>
  );
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function Field({ label, error, children, className = "" }) {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      <label className="text-sm font-medium text-slate-600">{label}</label>
      {children}
      {error && (
        <p className="text-xs text-red-500 flex items-center gap-1">
          <svg className="w-3 h-3 shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
          </svg>
          {error}
        </p>
      )}
    </div>
  );
}

const baseInput = "w-full rounded-xl border px-3.5 py-2.5 text-sm text-slate-700 placeholder-slate-300 outline-none transition-all duration-150 bg-white";
const normalInput = "border-slate-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100";
const errorInput  = "border-red-300 focus:border-red-400 focus:ring-2 focus:ring-red-100";

const input  = (err) => `${baseInput} ${err ? errorInput : normalInput}`;