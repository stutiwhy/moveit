import { useState } from "react";
import { useNavigate } from "react-router-dom";
import supabase from "../utils/supabaseClient";
import { UserAuth } from "../context/AuthContext";

const SetupProfile = () => {
  const { session } = UserAuth();
  const userId = session?.user?.id;
  const email = session?.user?.email;
  const navigate = useNavigate();

  const [currentStep, setCurrentStep] = useState(0);
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: email || "",
    country_residence: "",
    highest_education: "",
    gpa_or_percentage: "",
    english_test: "",
    english_score: "",
    study_level: "",
    field_of_study: "",
    preferred_countries: [],
  });

  const steps = [
    { title: "Personal Information" },
    { title: "Educational Background" },
    { title: "Study Preferences" },
  ];

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleCheckboxChange = (country) => {
    setForm((prev) => {
      const isSelected = prev.preferred_countries.includes(country);
      return {
        ...prev,
        preferred_countries: isSelected
          ? prev.preferred_countries.filter((c) => c !== country)
          : [...prev.preferred_countries, country],
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { error } = await supabase.from("user_profiles").upsert(
      {
        id: userId,
        first_name: form.first_name,
        last_name: form.last_name,
        country_residence: form.country_residence,
        highest_education: form.highest_education,
        gpa_or_percentage: form.gpa_or_percentage,
        english_test: form.english_test,
        english_score: form.english_score,
        study_level: form.study_level,
        field_of_study: form.field_of_study,
        preferred_countries: form.preferred_countries,
      },
      { onConflict: ["id"] }
    );

    if (error) {
      console.error("Profile setup error:", error.message);
    } else {
      navigate("/profile");
    }
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1);
  };

  return (
    <div className="text-black max-w-3xl mx-auto mt-12 p-6 bg-blue-50 rounded-3xl shadow-lg border border-blue-100 animate-fade-in font-sans animate-fade-in-down">
      <h2 className="text-3xl font-bold text-blue-800 mb-6 text-center">Set Up Your Profile</h2>

      {/* Progress Bar */}
      <div className="flex justify-between mb-10">
        {steps.map((step, index) => (
          <div
            key={index}
            className="flex-1 flex flex-col items-center"
          >
            <div
              className={`w-8 h-8 flex items-center justify-center rounded-full text-white transition-all duration-300 font-semibold text-sm ${
                index <= currentStep ? "bg-yellow-500" : "bg-gray-300"
              }`}
            >
              {index + 1}
            </div>
            <span
              className={`mt-2 text-sm font-medium text-center ${
                index <= currentStep ? "text-blue-700" : "text-gray-400"
              }`}
            >
              {step.title}
            </span>
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Step 1 */}
        {currentStep === 0 && (
          <div className="space-y-4">
            <Input label="First Name" value={form.first_name} onChange={(e) => handleChange("first_name", e.target.value)} />
            <Input label="Last Name" value={form.last_name} onChange={(e) => handleChange("last_name", e.target.value)} />
            <Input label="Email Address" value={form.email} disabled />
            <Select
              label="Country of Residence"
              value={form.country_residence}
              onChange={(e) => handleChange("country_residence", e.target.value)}
              options={["India", "Germany", "USA", "UK", "Australia", "Canada"]}
            />
          </div>
        )}

        {/* Step 2 */}
        {currentStep === 1 && (
          <div className="space-y-4">
            <Select
              label="Highest Level of Education"
              value={form.highest_education}
              onChange={(e) => handleChange("highest_education", e.target.value)}
              options={["High School", "Diploma", "Bachelor's", "Master's"]}
            />
            <Input label="GPA or Percentage" value={form.gpa_or_percentage} onChange={(e) => handleChange("gpa_or_percentage", e.target.value)} />
            <Select
              label="English Proficiency Test"
              value={form.english_test}
              onChange={(e) => handleChange("english_test", e.target.value)}
              options={["IELTS", "TOEFL", "Duolingo", "PTE"]}
            />
            <Input label="Test Score" value={form.english_score} onChange={(e) => handleChange("english_score", e.target.value)} />
          </div>
        )}

        {/* Step 3 */}
        {currentStep === 2 && (
          <div className="space-y-4">
            <Select
              label="Level of Study"
              value={form.study_level}
              onChange={(e) => handleChange("study_level", e.target.value)}
              options={["Undergraduate", "Graduate", "Postgraduate", "Doctorate"]}
            />
            <Select
              label="Field of Study"
              value={form.field_of_study}
              onChange={(e) => handleChange("field_of_study", e.target.value)}
              options={["Computer Science", "Engineering", "Business", "Design", "Health Sciences", "Social Sciences"]}
            />

            <label className="block font-medium text-blue-700">Preferred Countries</label>
            <div className="flex flex-wrap gap-4">
              {["USA", "Canada", "Australia", "UK", "Germany"].map((country) => (
                <label key={country} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={form.preferred_countries.includes(country)}
                    onChange={() => handleCheckboxChange(country)}
                  />
                  <span>{country}</span>
                </label>
              ))}
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between items-center mt-8">
          {currentStep > 0 && (
            <button
              type="button"
              onClick={prevStep}
              className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400 text-sm font-medium"
            >
              Previous
            </button>
          )}
          {currentStep < steps.length - 1 ? (
            <button
              type="button"
              onClick={nextStep}
              className="px-4 py-2 rounded bg-yellow-500 hover:bg-yellow-600 text-white text-sm font-semibold"
            >
              Next
            </button>
          ) : (
            <button
              type="submit"
              className="px-6 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold shadow"
            >
              Submit
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

const Input = ({ label, value, onChange, disabled }) => (
  <div>
    <label className="block font-medium text-blue-700 mb-1">{label}</label>
    <input
      type="text"
      value={value}
      onChange={onChange}
      disabled={disabled}
      className="w-full px-3 py-2 bg-white border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 transition"
    />
  </div>
);

const Select = ({ label, value, onChange, options }) => (
  <div>
    <label className="block font-medium text-blue-700 mb-1">{label}</label>
    <select
      value={value}
      onChange={onChange}
      className="w-full px-3 py-2 bg-white border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 transition"
    >
      <option value="">Select</option>
      {options.map((opt) => (
        <option key={opt} value={opt}>
          {opt}
        </option>
      ))}
    </select>
  </div>
);

export default SetupProfile;
