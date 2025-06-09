import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; 
import supabase from "../utils/supabaseClient";
import { UserAuth } from "../context/AuthContext";

const UserProfile = () => {
  const navigate = useNavigate();
  const { session } = UserAuth();
  const userId = session?.user?.id;
  const userEmail = session?.user?.email;

  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    country_residence: "",
    highest_education: "",
    gpa_or_percentage: "",
    english_test: "",
    english_score: "",
    study_level: "",
    field_of_study: "",
    preferred_countries: [],
  });

  const isProfileIncomplete = (profileData) => {
    const requiredFields = [
      "first_name",
      "last_name",
      "country_residence",
      "highest_education",
      "gpa_or_percentage",
      "english_test",
      "english_score",
      "study_level",
      "field_of_study",
    ];

    for (let field of requiredFields) {
      if (!profileData[field] || profileData[field].trim() === "") {
        return true;
      }
    }

    if (!Array.isArray(profileData.preferred_countries) || profileData.preferred_countries.length === 0) {
      return true;
    }

    return false;
  };

  useEffect(() => {
    if (!userId) return;

    const fetchOrCreateProfile = async () => {
      const { data, error } = await supabase
        .from("user_profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (error && error.code === "PGRST116") {
        const { error: insertError } = await supabase.from("user_profiles").insert({
          id: userId,
          first_name: "",
          last_name: "",
          country_residence: "",
          highest_education: "",
          gpa_or_percentage: "",
          english_test: "",
          english_score: "",
          study_level: "",
          field_of_study: "",
          preferred_countries: [],
        });

        if (insertError) console.error("Error creating profile:", insertError.message);
        setForm((prev) => ({ ...prev, email: userEmail }));
        setLoading(false);
        navigate("/setup-profile"); 
        return;
      }

      if (data) {
        if (isProfileIncomplete(data)) {
          navigate("/setup-profile");
          return;
        }

        setProfile(data);
        setForm({
          first_name: data.first_name || "",
          last_name: data.last_name || "",
          email: userEmail || "",
          country_residence: data.country_residence || "",
          highest_education: data.highest_education || "",
          gpa_or_percentage: data.gpa_or_percentage || "",
          english_test: data.english_test || "",
          english_score: data.english_score || "",
          study_level: data.study_level || "",
          field_of_study: data.field_of_study || "",
          preferred_countries: data.preferred_countries || [],
        });
      } else {
        setForm((prev) => ({ ...prev, email: userEmail }));
      }

      setLoading(false);
    };

    fetchOrCreateProfile();
  }, [userId, userEmail, navigate]);

  const handleChange = (key, value) => {
    setForm({ ...form, [key]: value });
  };

  const handlePreferredCountriesChange = (e) => {
    const value = e.target.value;
    setForm((prevForm) => ({
      ...prevForm,
      preferred_countries: e.target.checked
        ? [...prevForm.preferred_countries, value]
        : prevForm.preferred_countries.filter((c) => c !== value),
    }));
  };

  const handleSave = async () => {
    const { email, ...dataToUpdate } = form;

    const { error } = await supabase
      .from("user_profiles")
      .update(dataToUpdate)
      .eq("id", userId);

    if (error) {
      console.error("Error updating profile:", error.message);
      alert("Failed to save changes.");
    } else {
      setProfile({ ...form });
      setEditing(false);
    }
  };

  if (loading) return <div className="mt-10 text-center text-black">Loading profile...</div>;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-700 to-blue-500 font-sans px-4">
      <div className="bg-white shadow-2xl rounded-xl p-10 w-full max-w-3xl animate-fade-in-up text-black">
        <h1 className="text-3xl font-semibold text-black text-center mb-4">Your Profile</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-black">
          {[{ label: "First Name", key: "first_name" }, { label: "Last Name", key: "last_name" }].map(
            ({ label, key }) => (
              <div className="mb-4" key={key}>
                <label className="font-medium text-black">{label}</label>
                {editing ? (
                  <input
                    type="text"
                    value={form[key]}
                    className="w-full mt-2 p-3 bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 outline-none transition text-black"
                    onChange={(e) => handleChange(key, e.target.value)}
                  />
                ) : (
                  <p className="text-black">{profile[key] || "Not set"}</p>
                )}
              </div>
            )
          )}

          <div className="mb-4">
            <label className="font-medium text-black">Email</label>
            <p className="text-black">{userEmail}</p>
          </div>

          <div className="mb-4">
            <label className="font-medium text-black">Country of Residence</label>
            {editing ? (
              <select
                value={form.country_residence}
                className="w-full mt-2 p-3 bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 outline-none transition text-black"
                onChange={(e) => handleChange("country_residence", e.target.value)}
              >
                <option value="">-- Select --</option>
                <option value="India">India</option>
                <option value="Germany">Germany</option>
                <option value="Canada">Canada</option>
                <option value="USA">USA</option>
              </select>
            ) : (
              <p className="text-black">{profile.country_residence || "Not set"}</p>
            )}
          </div>

          <div className="mb-4">
            <label className="font-medium text-black">Highest Education</label>
            {editing ? (
              <select
                value={form.highest_education}
                className="w-full mt-2 p-3 bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 outline-none transition text-black"
                onChange={(e) => handleChange("highest_education", e.target.value)}
              >
                <option value="">-- Select --</option>
                <option value="High School">High School</option>
                <option value="Diploma">Diploma</option>
                <option value="Bachelor's">Bachelor's</option>
                <option value="Master's">Master's</option>
                <option value="PhD">PhD</option>
              </select>
            ) : (
              <p className="text-black">{profile.highest_education || "Not set"}</p>
            )}
          </div>

          <div className="mb-4">
            <label className="font-medium text-black">GPA or Percentage</label>
            {editing ? (
              <input
                type="text"
                value={form.gpa_or_percentage}
                className="w-full mt-2 p-3 bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 outline-none transition text-black"
                onChange={(e) => handleChange("gpa_or_percentage", e.target.value)}
              />
            ) : (
              <p className="text-black">{profile.gpa_or_percentage || "Not set"}</p>
            )}
          </div>

          <div className="mb-4">
            <label className="font-medium text-black">English Proficiency Test</label>
            {editing ? (
              <select
                value={form.english_test}
                className="w-full mt-2 p-3 bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 outline-none transition text-black"
                onChange={(e) => handleChange("english_test", e.target.value)}
              >
                <option value="">-- Select --</option>
                <option value="IELTS">IELTS</option>
                <option value="TOEFL">TOEFL</option>
                <option value="PTE">PTE</option>
                <option value="Duolingo">Duolingo</option>
              </select>
            ) : (
              <p className="text-black">{profile.english_test || "Not set"}</p>
            )}
          </div>

          <div className="mb-4">
            <label className="font-medium text-black">Test Score</label>
            {editing ? (
              <input
                type="text"
                value={form.english_score}
                className="w-full mt-2 p-3 bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 outline-none transition text-black"
                onChange={(e) => handleChange("english_score", e.target.value)}
              />
            ) : (
              <p className="text-black">{profile.english_score || "Not set"}</p>
            )}
          </div>

          <div className="mb-4">
            <label className="font-medium text-black">Study Level</label>
            {editing ? (
              <select
                value={form.study_level}
                className="w-full mt-2 p-3 bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 outline-none transition text-black"
                onChange={(e) => handleChange("study_level", e.target.value)}
              >
                <option value="">-- Select --</option>
                <option value="Undergraduate">Undergraduate</option>
                <option value="Postgraduate">Postgraduate</option>
                <option value="Doctorate">Doctorate</option>
              </select>
            ) : (
              <p className="text-black">{profile.study_level || "Not set"}</p>
            )}
          </div>

          <div className="mb-4">
  <label className="font-medium text-black">Field of Study</label>
  {editing ? (
    <select
      value={form.field_of_study}
      className="w-full mt-2 p-3 bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 outline-none transition text-black"
      onChange={(e) => handleChange("field_of_study", e.target.value)}
    >
      <option value="">-- Select --</option>
      <option value="Social Sciences">Social Sciences</option>
      <option value="Arts, Media & Humanities">Arts, Media & Humanities</option>
      <option value="Business, Economics & Management">Business, Economics & Management</option>
      <option value="Environmental & Agricultural Sciences">Environmental & Agricultural Sciences</option>
      <option value="Natural & Physical Sciences">Natural & Physical Sciences</option>
      <option value="Engineering & Technology">Engineering & Technology</option>
      <option value="Law & Legal Studies">Law & Legal Studies</option>
      <option value="Health & Life Sciences">Health & Life Sciences</option>
      <option value="Computer & Information Sciences">Computer & Information Sciences</option>
      <option value="Research Training">Research Training</option>
    </select>
  ) : (
    <p className="text-black">{profile.field_of_study || "Not set"}</p>
  )}
</div>


          <div className="mb-4">
            <label className="font-medium text-black">Preferred Countries</label>
            {editing ? (
              <div className="space-y-1 text-black">
                {["Germany", "Canada", "USA", "Australia", "UK"].map((country) => (
                  <label key={country} className="block text-black">
                    <input
                      type="checkbox"
                      value={country}
                      checked={form.preferred_countries.includes(country)}
                      onChange={handlePreferredCountriesChange}
                      className="mr-2"
                    />
                    {country}
                  </label>
                ))}
              </div>
            ) : (
              <p className="text-black">{profile.preferred_countries?.join(", ") || "Not set"}</p>
            )}
          </div>

          <div className="flex gap-4 mt-6">
            {editing ? (
              <>
                <button
                  onClick={handleSave}
                  className="bg-yellow-400 text-blue-800 hover:bg-yellow-300 font-semibold py-3 px-6 rounded-md transition duration-300 transform hover:scale-105"
                >
                  Save
                </button>
                <button
                  onClick={() => setEditing(false)}
                  className="bg-gray-500 text-white hover:bg-gray-400 font-semibold py-3 px-6 rounded-md transition"
                >
                  Cancel
                </button>
              </>
            ) : (
              <button
                onClick={() => setEditing(true)}
                className="bg-blue-600 text-white hover:bg-blue-500 font-semibold py-3 px-6 rounded-md transition duration-300 transform hover:scale-105"
              >
                Edit Profile
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;