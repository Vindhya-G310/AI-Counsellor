"use client";

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { onboardingAPI } from "../services/api";
import { useAuth } from "../context/AuthContext";

export const Onboarding = () => {
  const navigate = useNavigate();
  const { user, fetchUser } = useAuth();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    academic: {
      educationLevel: "",
      major: "",
      graduationYear: new Date().getFullYear() + 1,
      gpa: "",
    },
    studyGoals: {
      intendedDegree: "",
      fieldOfStudy: "",
      intakeYear: new Date().getFullYear() + 1,
      preferredCountries: [],
    },
    budget: {
      yearlyBudget: "",
      fundingType: "self",
    },
    exams: {
      ielts: "",
      greGmat: "",
      sop: "",
    },
  });

  const handleInputChange = (section, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  const handleCountryToggle = (country) => {
    setFormData((prev) => ({
      ...prev,
      studyGoals: {
        ...prev.studyGoals,
        preferredCountries: prev.studyGoals.preferredCountries.includes(country)
          ? prev.studyGoals.preferredCountries.filter((c) => c !== country)
          : [...prev.studyGoals.preferredCountries, country],
      },
    }));
  };

  const handleSubmit = async () => {
    setError("");
    setLoading(true);

    try {
      // 1️⃣ submit onboarding
      await onboardingAPI.submit(formData);

      // 2️⃣ IMPORTANT: refresh user from backend
      await fetchUser();

      // 3️⃣ now navigate
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Onboarding failed");
    } finally {
      setLoading(false);
    }
  };

  const countries = [
    "USA",
    "UK",
    "Canada",
    "Australia",
    "Germany",
    "Netherlands",
  ];

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold mb-2">Complete Your Profile</h1>
          <p className="text-gray-600 mb-8">
            This information helps us provide personalized guidance. Step {step}{" "}
            of 4
          </p>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          {step === 1 && (
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold mb-6">
                Academic Background
              </h2>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Education Level
                </label>
                <select
                  value={formData.academic.educationLevel}
                  onChange={(e) =>
                    handleInputChange(
                      "academic",
                      "educationLevel",
                      e.target.value,
                    )
                  }
                  className="input"
                  required
                >
                  <option value="">Select...</option>
                  <option value="High School">High School</option>
                  <option value="Bachelor">Bachelor's Degree</option>
                  <option value="Master">Master's Degree</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Major</label>
                <input
                  type="text"
                  value={formData.academic.major}
                  onChange={(e) =>
                    handleInputChange("academic", "major", e.target.value)
                  }
                  className="input"
                  placeholder="e.g., Computer Science"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Graduation Year
                </label>
                <input
                  type="number"
                  value={formData.academic.graduationYear}
                  onChange={(e) =>
                    handleInputChange(
                      "academic",
                      "graduationYear",
                      e.target.value,
                    )
                  }
                  className="input"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">GPA</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.academic.gpa}
                  onChange={(e) =>
                    handleInputChange("academic", "gpa", e.target.value)
                  }
                  className="input"
                  placeholder="e.g., 3.8"
                />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold mb-6">Study Goals</h2>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Intended Degree
                </label>
                <select
                  value={formData.studyGoals.intendedDegree}
                  onChange={(e) =>
                    handleInputChange(
                      "studyGoals",
                      "intendedDegree",
                      e.target.value,
                    )
                  }
                  className="input"
                  required
                >
                  <option value="">Select...</option>
                  <option value="Masters">Master's</option>
                  <option value="PhD">PhD</option>
                  <option value="Diploma">Diploma</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Field of Study
                </label>
                <input
                  type="text"
                  value={formData.studyGoals.fieldOfStudy}
                  onChange={(e) =>
                    handleInputChange(
                      "studyGoals",
                      "fieldOfStudy",
                      e.target.value,
                    )
                  }
                  className="input"
                  placeholder="e.g., Data Science"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Intake Year
                </label>
                <input
                  type="number"
                  value={formData.studyGoals.intakeYear}
                  onChange={(e) =>
                    handleInputChange(
                      "studyGoals",
                      "intakeYear",
                      e.target.value,
                    )
                  }
                  className="input"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-4">
                  Preferred Countries
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {countries.map((country) => (
                    <label
                      key={country}
                      className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50"
                    >
                      <input
                        type="checkbox"
                        checked={formData.studyGoals.preferredCountries.includes(
                          country,
                        )}
                        onChange={() => handleCountryToggle(country)}
                        className="mr-2"
                      />
                      <span>{country}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold mb-6">Budget & Funding</h2>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Yearly Budget (USD)
                </label>
                <input
                  type="number"
                  value={formData.budget.yearlyBudget}
                  onChange={(e) =>
                    handleInputChange("budget", "yearlyBudget", e.target.value)
                  }
                  className="input"
                  placeholder="e.g., 50000"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Funding Type
                </label>
                <select
                  value={formData.budget.fundingType}
                  onChange={(e) =>
                    handleInputChange("budget", "fundingType", e.target.value)
                  }
                  className="input"
                  required
                >
                  <option value="self">Self Funded</option>
                  <option value="loan">Education Loan</option>
                  <option value="scholarship">Scholarship</option>
                  <option value="sponsor">Sponsor</option>
                </select>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold mb-6">Exam Status</h2>

              <div>
                <label className="block text-sm font-medium mb-2">IELTS</label>
                <select
                  value={formData.exams.ielts}
                  onChange={(e) =>
                    handleInputChange("exams", "ielts", e.target.value)
                  }
                  className="input"
                >
                  <option value="">Not Applicable</option>
                  <option value="Not Started">Not Started</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  GRE / GMAT
                </label>
                <select
                  value={formData.exams.greGmat}
                  onChange={(e) =>
                    handleInputChange("exams", "greGmat", e.target.value)
                  }
                  className="input"
                >
                  <option value="">Not Applicable</option>
                  <option value="Not Started">Not Started</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">SOP</label>
                <select
                  value={formData.exams.sop}
                  onChange={(e) =>
                    handleInputChange("exams", "sop", e.target.value)
                  }
                  className="input"
                >
                  <option value="">Not Started</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>
            </div>
          )}

          <div className="flex gap-4 mt-8">
            {step > 1 && (
              <button
                onClick={() => setStep(step - 1)}
                className="btn-secondary flex-1"
              >
                Previous
              </button>
            )}
            {step < 4 && (
              <button
                onClick={() => setStep(step + 1)}
                className="btn-primary flex-1"
              >
                Next
              </button>
            )}
            {step === 4 && (
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="btn-primary flex-1"
              >
                {loading ? "Completing..." : "Complete Onboarding"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
