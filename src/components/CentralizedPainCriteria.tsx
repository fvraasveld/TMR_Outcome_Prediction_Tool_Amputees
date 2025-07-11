import React, { useState, useEffect } from "react";

interface CriteriaState {
  documentedPNI: string;
  chronicPain: string;
  hypersensitivity: string;
  moodCognitive: string;
  nerveBlockPerformed: string;
  nerveBlockResponse: string;
}

const CentralizedPainCriteria = () => {
  // State for criteria inputs
  const [criteria, setCriteria] = useState<CriteriaState>({
    documentedPNI: "",
    chronicPain: "",
    hypersensitivity: "",
    moodCognitive: "",
    nerveBlockPerformed: "",
    nerveBlockResponse: "",
  });

  // State for recommendations
  const [recommendations, setRecommendations] = useState<string[]>([]);

  // State for diagnosis
  const [diagnosis, setDiagnosis] = useState<string>("");

  // State for active tab
  const [activeTab, setActiveTab] = useState<string>("criteria");

  // State to track if criteria are filled out
  const [criteriaFilled, setCriteriaFilled] = useState<boolean>(false);

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setCriteria({
      ...criteria,
      [name]: value,
    });
  };

  // Calculate diagnosis and recommendations based on criteria
  useEffect(() => {
    checkCriteria();
  }, [criteria]);

  // Check if all required criteria are filled
  useEffect(() => {
    const {
      documentedPNI,
      chronicPain,
      hypersensitivity,
      moodCognitive,
      nerveBlockPerformed,
    } = criteria;
    let requiredFields = [
      documentedPNI,
      chronicPain,
      hypersensitivity,
      moodCognitive,
      nerveBlockPerformed,
    ];

    // If nerve block was performed, need response too
    if (nerveBlockPerformed === "yes") {
      requiredFields.push(criteria.nerveBlockResponse);
    }

    setCriteriaFilled(requiredFields.every((field) => field !== ""));
  }, [criteria]);

  // Check criteria and generate diagnosis
  const checkCriteria = () => {
    const {
      documentedPNI,
      chronicPain,
      hypersensitivity,
      moodCognitive,
      nerveBlockPerformed,
      nerveBlockResponse,
    } = criteria;

    if (
      !documentedPNI ||
      !chronicPain ||
      !hypersensitivity ||
      !moodCognitive ||
      !nerveBlockPerformed
    ) {
      setDiagnosis("");
      setRecommendations([]);
      return;
    }

    // Count how many criteria are met
    let criteriaCount = 4; // Always have 4 core criteria
    let criteriaMet = 0;

    // Check the four main criteria
    if (documentedPNI === "yes") criteriaMet++;
    if (chronicPain === "yes") criteriaMet++;
    if (hypersensitivity === "yes") criteriaMet++;
    if (moodCognitive === "yes") criteriaMet++;

    // For the fifth criterion (nerve block), only count if performed
    if (nerveBlockPerformed === "yes") {
      criteriaCount++;
      if (nerveBlockResponse === "no") criteriaMet++;
    }

    // Generate diagnosis - binary outcome
    if (criteriaMet === criteriaCount) {
      setDiagnosis("Centralized Pain Following Peripheral Nerve Injury");
      setRecommendations([
        "Peripheral interventions may have limited effectiveness due to central mechanisms",
        "Consider centrally-targeted treatments (SNRIs, TCAs, gabapentinoids, NMDA receptor antagonists)",
        "Evaluate for neuromodulation devices",
        "Implement comprehensive psychological support (e.g. CBT)",
        "Commence multidisciplinary pain management",
      ]);
    } else {
      setDiagnosis("Criteria Not Met for Centralized Pain");

      // Customize recommendations based on which criteria are missing
      if (hypersensitivity === "no" && moodCognitive === "no") {
        // Missing both hypersensitivity and mood/cognitive symptoms
        setRecommendations([
          "Peripheral interventions may be appropriate as primary treatment",
          "Consider targeted nerve surgery or focal ablative techniques",
          "Monitor for development of central sensitization features",
          "Standard peripheral nerve pain protocols recommended",
          "Follow-up evaluation to assess for changes in presentation",
        ]);
      } else if (hypersensitivity === "no") {
        // Missing only hypersensitivity
        setRecommendations([
          "Peripheral interventions likely appropriate with monitoring",
          "Consider additional assessment for hypersensitivity beyond injury zone",
          "Address mood/cognitive components with psychological support",
          "Monitor for development of additional central sensitization features",
        ]);
      } else if (moodCognitive === "no") {
        // Missing only mood/cognitive symptoms
        setRecommendations([
          "Consider psychological evaluation for subtle mood/cognitive changes",
          "Peripheral interventions with careful monitoring of outcomes",
          "Mixed approach addressing both peripheral and central components",
          "Educate patient on psychosocial aspects of pain management",
        ]);
      } else {
        // Missing other criteria
        setRecommendations([
          "Consider further evaluation to confirm diagnosis",
          "Peripheral interventions may be appropriate with monitoring",
          "Consider combined peripheral and central approaches",
          "Follow-up to reassess criteria that were not met",
        ]);
      }
    }
  };

  // Get color scheme based on diagnosis
  const getDiagnosisColor = () => {
    if (diagnosis === "Centralized Pain Following Peripheral Nerve Injury") {
      return "bg-cyan-100 border-[#0096B7] text-[#0096B7]";
    } else if (diagnosis === "Criteria Not Met for Centralized Pain") {
      return "bg-blue-50 border-[#0096B7] text-[#0096B7]";
    }
    return "bg-gray-100 border-gray-200";
  };

  return (
    <div className="w-full max-w-6xl mx-auto">
      {/* Disclaimer Banner */}
      <div className="bg-yellow-50 border border-yellow-200 p-3 mb-3 text-sm text-center text-yellow-800 rounded">
        <strong>Note:</strong> This tool should be used as a supplement to, not
        a replacement for, clinical judgment.
      </div>

      {/* Header with ICAN styling and logo */}
      <div className="bg-[#0096B7] text-white p-5 rounded-t-lg shadow">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            {/* Logo with white border - no rounded edges */}
            <div className="bg-white p-0.5 border-0.5 border-white mr-4">
              <img
                src="https://i.ibb.co/jv6z7D3d/ICAN-logo-copy-2.png"
                alt="ICAN"
                className="h-28 w-auto"
              />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                ICAN/Algorithms
              </h1>
              <div className="text-xs mt-1 font-light tracking-wide uppercase">
                Interdisciplinary Care for Amputees Network
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Title bar */}
      <div className="bg-white border-l border-r p-4">
        <h2 className="text-2xl font-bold text-[#0096B7]">
          Central Pain Criteria Assessment Tool
        </h2>
        <p className="text-gray-600">
          Evaluating centralized pain following peripheral nerve injury
        </p>
      </div>

      {/* Tabs */}
      <div className="flex border-l border-r bg-white">
        <button
          className={`px-4 py-2 ${
            activeTab === "criteria"
              ? "border-b-2 border-[#0096B7] font-medium text-[#0096B7]"
              : "text-gray-600"
          }`}
          onClick={() => setActiveTab("criteria")}
        >
          Assessment
        </button>
        <button
          className={`px-4 py-2 ${
            activeTab === "about"
              ? "border-b-2 border-[#0096B7] font-medium text-[#0096B7]"
              : "text-gray-600"
          }`}
          onClick={() => setActiveTab("about")}
        >
          About
        </button>
        <button
          className={`px-4 py-2 ${
            activeTab === "evidence"
              ? "border-b-2 border-[#0096B7] font-medium text-[#0096B7]"
              : "text-gray-600"
          }`}
          onClick={() => setActiveTab("evidence")}
        >
          Evidence
        </button>
      </div>

      {activeTab === "criteria" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-gray-50 p-6 border-l border-r border-b rounded-b-lg">
          {/* Left Column - Assessment */}
          <div className="md:col-span-1">
            <div className="bg-white p-6 rounded shadow">
              <h2 className="text-xl font-bold mb-4 text-[#0096B7]">
                Diagnostic Criteria
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    1. Documented peripheral nerve injury/compression*
                  </label>
                  <select
                    name="documentedPNI"
                    value={criteria.documentedPNI}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded focus:ring-[#0096B7] focus:border-[#0096B7]"
                  >
                    <option value="">Select...</option>
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    2. Neuropathic pain ≥ 3 months*
                  </label>
                  <select
                    name="chronicPain"
                    value={criteria.chronicPain}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded focus:ring-[#0096B7] focus:border-[#0096B7]"
                  >
                    <option value="">Select...</option>
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    3. Hyperalgesia/allodynia beyond injury zone*
                  </label>
                  <select
                    name="hypersensitivity"
                    value={criteria.hypersensitivity}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded focus:ring-[#0096B7] focus:border-[#0096B7]"
                  >
                    <option value="">Select...</option>
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    4. Associated mood/cognitive disturbances*
                  </label>
                  <select
                    name="moodCognitive"
                    value={criteria.moodCognitive}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded focus:ring-[#0096B7] focus:border-[#0096B7]"
                  >
                    <option value="">Select...</option>
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    5a. Has patient undergone a peripheral nerve block?*
                  </label>
                  <select
                    name="nerveBlockPerformed"
                    value={criteria.nerveBlockPerformed}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded focus:ring-[#0096B7] focus:border-[#0096B7]"
                  >
                    <option value="">Select...</option>
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                  </select>
                </div>

                {criteria.nerveBlockPerformed === "yes" && (
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      5b. Limited response to block (&lt;50% pain reduction)*
                    </label>
                    <select
                      name="nerveBlockResponse"
                      value={criteria.nerveBlockResponse}
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded focus:ring-[#0096B7] focus:border-[#0096B7]"
                    >
                      <option value="">Select...</option>
                      <option value="yes">
                        No, good response (≥50% reduction)
                      </option>
                      <option value="no">
                        Yes, limited response (&lt;50% reduction)
                      </option>
                    </select>
                  </div>
                )}

                <p className="text-xs text-gray-500">* Required fields</p>
              </div>
            </div>
          </div>

          {/* Right Column - Results */}
          <div className="md:col-span-2">
            {criteriaFilled ? (
              <div className="bg-white p-6 rounded shadow">
                <div
                  className={`p-4 mb-4 rounded border-l-4 ${getDiagnosisColor()}`}
                >
                  <h2 className="text-xl font-bold">Diagnosis:</h2>
                  <p className="text-lg font-medium">{diagnosis}</p>
                </div>

                {recommendations.length > 0 && (
                  <div>
                    <h2 className="text-xl font-bold mb-3 text-[#0096B7]">
                      Clinical Recommendations
                    </h2>
                    <ul className="space-y-1">
                      {recommendations.map((rec, index) => (
                        <li key={index} className="flex items-start">
                          <span className="mr-2 text-[#0096B7]">•</span>
                          <span>{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Summary of criteria */}
                <div className="mt-8 bg-gray-50 p-4 rounded">
                  <h3 className="font-bold text-gray-700">
                    Criteria Assessment Summary
                  </h3>
                  <ul className="mt-2">
                    <li className="flex items-start">
                      <span
                        className={`w-5 h-5 rounded-full mr-2 flex items-center justify-center text-white ${
                          criteria.documentedPNI === "yes"
                            ? "bg-[#0096B7]"
                            : "bg-gray-400"
                        }`}
                      >
                        ✓
                      </span>
                      <span>Documented peripheral nerve injury</span>
                    </li>
                    <li className="flex items-start mt-1">
                      <span
                        className={`w-5 h-5 rounded-full mr-2 flex items-center justify-center text-white ${
                          criteria.chronicPain === "yes"
                            ? "bg-[#0096B7]"
                            : "bg-gray-400"
                        }`}
                      >
                        ✓
                      </span>
                      <span>Neuropathic pain ≥ 3 months</span>
                    </li>
                    <li className="flex items-start mt-1">
                      <span
                        className={`w-5 h-5 rounded-full mr-2 flex items-center justify-center text-white ${
                          criteria.hypersensitivity === "yes"
                            ? "bg-[#0096B7]"
                            : "bg-gray-400"
                        }`}
                      >
                        ✓
                      </span>
                      <span>Hyperalgesia/allodynia beyond injury zone</span>
                    </li>
                    <li className="flex items-start mt-1">
                      <span
                        className={`w-5 h-5 rounded-full mr-2 flex items-center justify-center text-white ${
                          criteria.moodCognitive === "yes"
                            ? "bg-[#0096B7]"
                            : "bg-gray-400"
                        }`}
                      >
                        ✓
                      </span>
                      <span>Associated mood/cognitive disturbances</span>
                    </li>
                    {criteria.nerveBlockPerformed === "yes" && (
                      <li className="flex items-start mt-1">
                        <span
                          className={`w-5 h-5 rounded-full mr-2 flex items-center justify-center text-white ${
                            criteria.nerveBlockResponse === "no"
                              ? "bg-[#0096B7]"
                              : "bg-gray-400"
                          }`}
                        >
                          ✓
                        </span>
                        <span>Limited response to nerve block</span>
                      </li>
                    )}
                  </ul>
                </div>
              </div>
            ) : (
              <div className="bg-white p-6 rounded shadow">
                <div className="bg-[#0096B7] text-white p-4 mb-4 rounded">
                  <h2 className="text-xl font-bold">Central Pain Evaluation</h2>
                  <p>Complete all criteria to view assessment results</p>
                </div>

                <div className="p-6 border rounded-lg bg-gray-50">
                  <div className="flex justify-center pb-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-16 w-16 text-[#0096B7]"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-lg text-center font-medium text-gray-700">
                    This tool helps determine if pain centralization has
                    occurred following peripheral nerve injury
                  </h3>
                  <p className="mt-2 text-center text-gray-600">
                    Fill out all criteria to receive an evidence-based
                    assessment and personalized clinical recommendations
                  </p>
                </div>

                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-bold text-gray-700">
                    Diagnostic Implications
                  </h3>
                  <p className="mt-1 text-sm text-gray-600">
                    Centralized pain typically requires different treatment
                    approaches than purely peripheral neuropathic pain.
                    Identifying central sensitization early can guide
                    appropriate intervention selection.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === "about" && (
        <div className="bg-white p-6 border-l border-r border-b rounded-b-lg">
          <h2 className="text-xl font-bold mb-4 text-[#0096B7]">
            About This Tool
          </h2>
          <p className="mb-4">
            The Central Pain Criteria Assessment Tool provides a standardized
            framework for diagnosing centralized pain following peripheral nerve
            injury based on a comprehensive systematic review of the clinical
            literature.
          </p>

          <h3 className="font-bold mt-6 mb-2 text-lg">
            The Five Diagnostic Criteria
          </h3>
          <ol className="list-decimal pl-5 space-y-2">
            <li>
              <span className="font-medium">
                Documented peripheral nervous system injury or compression
              </span>
              <p className="text-sm text-gray-600 mt-1">
                Establishing the initial insult to the nervous system through
                clinical history, imaging, or surgical findings
              </p>
            </li>
            <li>
              <span className="font-medium">
                Neuropathic pain persisting for three months or longer
              </span>
              <p className="text-sm text-gray-600 mt-1">
                Indicating that acute post-injury inflammation has resolved and
                suggesting more persistent neuroplastic changes
              </p>
            </li>
            <li>
              <span className="font-medium">
                Hyperalgesia, allodynia, or hypersensitivity extending beyond
                the zone of injury
              </span>
              <p className="text-sm text-gray-600 mt-1">
                Pain processing has spread beyond the initially affected nerve
                innervation territory
              </p>
            </li>
            <li>
              <span className="font-medium">
                Associated mood and/or cognitive disturbances
              </span>
              <p className="text-sm text-gray-600 mt-1">
                Including anxiety, depression, or difficulties with memory and
                concentration, reflecting neurophysiological impact commonly
                associated with central sensitization
              </p>
            </li>
            <li>
              <span className="font-medium">
                Limited response to peripheral nerve blocks
              </span>
              <p className="text-sm text-gray-600 mt-1">
                If performed, less than 50% pain reduction indicates that the
                pain generator has shifted from a primarily peripheral to a more
                central mechanism
              </p>
            </li>
          </ol>

          <h3 className="font-bold mt-6 mb-2 text-lg">Clinical Application</h3>
          <p className="mb-4">
            This tool is intended for preoperative surgical settings to guide
            decision-making regarding peripheral nerve interventions. Patients
            meeting criteria for centralized pain may have limited response to
            peripheral surgical approaches alone and may benefit from multimodal
            treatment targeting central mechanisms.
          </p>

          <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-[#0096B7]">
            <h4 className="font-bold text-[#0096B7]">
              Interdisciplinary Care for Amputees Network
            </h4>
            <p className="mt-1 text-sm">
              ICAN Algorithms provide evidence-based decision support tools for
              clinicians managing complex pain conditions in amputees and
              patients with peripheral nerve injuries.
            </p>
          </div>
        </div>
      )}

      {activeTab === "evidence" && (
        <div className="bg-white p-6 border-l border-r border-b rounded-b-lg">
          <h2 className="text-xl font-bold mb-4 text-[#0096B7]">
            Evidence Base
          </h2>

          <div className="bg-blue-50 p-4 rounded border-l-4 border-[#0096B7] mb-4">
            <p className="font-medium">
              This tool is based on our systematic review published in the
              Clinical Journal of Pain, which analyzed 28 studies encompassing
              6,189 patients.
            </p>
          </div>

          <h3 className="font-bold mt-4 mb-2">Primary Research Article</h3>
          <div className="p-4 bg-gray-50 rounded border">
            <p className="font-medium">
              Raasveld FV, Tiems MRA, Johnston BR, et al. Diagnostic Criteria
              for Centralized Pain Following Peripheral Nerve Injury: A
              Systematic Review.
            </p>
            <p className="text-sm text-gray-600 mt-1">
              Clinical Journal of Pain (Under Review)
            </p>
          </div>

          <h3 className="font-bold mt-6 mb-2">Evidence Summary</h3>
          <p className="mb-4">
            Our systematic review included studies of various designs: 2
            systematic reviews, 4 narrative reviews, 15 cohort studies, 5
            cross-sectional studies, 1 case series, and 1 case report. These
            studies demonstrated strong methodological rigor with low risk of
            bias.
          </p>
          <p className="mb-4">
            Among the studies, several key markers of central sensitization were
            consistently identified, including hyperalgesia beyond the injury
            zone (92.9% of studies), mechanical/thermal allodynia (85.7%),
            widespread/radiating pain (82.1%), and bilateral symptoms (71.4%).
          </p>
        </div>
      )}

      {/* Footer */}
      <div className="bg-gray-50 p-4 mt-6 rounded text-sm text-gray-600 border">
        <div className="flex justify-between items-center">
          <div>
            <p className="font-medium">ICAN Algorithms</p>
            <p className="text-xs">Version 1.0 - May 2025</p>
          </div>
          <div className="text-right">
            <p>© Interdisciplinary Care for Amputees Network</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CentralizedPainCriteria;
