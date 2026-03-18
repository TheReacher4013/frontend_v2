import React, { useState } from "react";
import { FaUserCircle, FaRedoAlt, FaStopCircle } from "react-icons/fa";
import { IoWarningOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

function CallManager() {

  const navigate = useNavigate();

  const [showModal, setShowModal] = useState(false);
  const [stopModal, setStopModal] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState(null);

  const campaigns = [
    {
      title: "Social Media Campaign",
      progress: 63,
      leads: "62/97",
      actioner: "Admin",
      started: "03-02-2026 11:26 pm",
    },
    {
      title: "Website Development Campaign",
      progress: 41,
      leads: "38/91",
      actioner: "Manager",
      started: "23-02-2026 02:20 am",
    },
    {
      title: "Job Applications",
      progress: 13,
      leads: "8/58",
      actioner: "Admin",
      started: "19-02-2026 01:28 pm",
    },
    {
      title: "Electronic Item Sell Campaign",
      progress: 55,
      leads: "25/60",
      actioner: "Admin",
      started: "20-02-2026 11:00 am",
    },
    {
      title: "Live Event Campaign",
      progress: 72,
      leads: "45/62",
      actioner: "Manager",
      started: "15-02-2026 09:30 am",
    },
    {
      title: "Make New Mobile Application",
      progress: 30,
      leads: "20/70",
      actioner: "Admin",
      started: "10-02-2026 03:00 pm",
    },
  ];

  return (
    <div className="p-4 md:p-6 bg-gray-100 min-h-screen">

      <h1 className="text-xl md:text-2xl font-semibold mb-6">Call Manager</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
        {campaigns.map((item, index) => (
          <div key={index} className="bg-white rounded-lg shadow p-5">

            <h2 className="text-base md:text-lg font-semibold mb-4">{item.title}</h2>

            <div className="flex justify-between items-center mb-4">
              <span className="text-gray-500 text-sm">Members</span>
              <div className="flex space-x-1 text-blue-400 text-2xl">
                <FaUserCircle />
                <FaUserCircle />
                <FaUserCircle />
                <FaUserCircle />
              </div>
            </div>

            <div className="mb-2 flex justify-between text-sm text-gray-600">
              <span>Progress</span>
              <span>{item.progress}%</span>
            </div>

            <div className="w-full bg-gray-200 h-2 rounded-full mb-2">
              <div
                className="bg-blue-500 h-2 rounded-full transition-all"
                style={{ width: `${item.progress}%` }}
              />
            </div>

            <p className="text-sm text-gray-600 mb-4">
              Remaining Leads: {item.leads}
            </p>

            <div className="text-sm text-gray-600 space-y-1 mb-4">
              <p><span className="text-gray-400">Last Actioner </span>{item.actioner}</p>
              <p><span className="text-gray-400">Started On </span>{item.started}</p>
            </div>

            <div className="flex justify-between pt-3 border-t">

              <button
                onClick={() => {
                  setSelectedCampaign(item);
                  setShowModal(true);
                }}
                className="flex items-center gap-2 text-green-600 hover:text-green-700 text-sm font-medium transition-colors"
              >
                <FaRedoAlt />
                Resume
              </button>

              <button
                onClick={() => {
                  setSelectedCampaign(item);
                  setStopModal(true);
                }}
                className="flex items-center gap-2 text-red-600 hover:text-red-700 text-sm font-medium transition-colors"
              >
                <FaStopCircle />
                Stop
              </button>

            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">

            <div className="flex items-center gap-3 mb-4">
              <IoWarningOutline className="text-yellow-500 text-2xl flex-shrink-0" />
              <h2 className="text-lg font-semibold">Are you sure?</h2>
            </div>

            <p className="text-gray-600 text-sm mb-1">
              Are you sure you want to resume
            </p>
            <p className="text-gray-800 text-sm font-semibold mb-6">
              "{selectedCampaign?.title}"?
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-1.5 border rounded text-gray-600 hover:bg-gray-100 text-sm"
              >
                No
              </button>

              <button
                onClick={() => {
                  setShowModal(false);
                  navigate("/socialmedia", { state: { from: "/admin/calls" } });
                }}
                className="px-4 py-1.5 border border-red-500 text-red-500 rounded hover:bg-red-50 text-sm"
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      )}

      {stopModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">

            <div className="flex items-center gap-3 mb-4">
              <IoWarningOutline className="text-yellow-500 text-2xl flex-shrink-0" />
              <h2 className="text-lg font-semibold">Stop Campaign?</h2>
            </div>

            <p className="text-gray-600 text-sm mb-1">
              Are you sure you want to stop
            </p>
            <p className="text-gray-800 text-sm font-semibold mb-2">
              "{selectedCampaign?.title}"?
            </p>
            <p className="text-gray-500 text-xs mb-6">
              After stopping, all remaining unactioned leads will be deleted.
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setStopModal(false)}
                className="px-4 py-1.5 border rounded text-gray-600 hover:bg-gray-100 text-sm"
              >
                No
              </button>
              <button
                onClick={() => setStopModal(false)}
                className="px-4 py-1.5 border border-red-500 text-red-500 rounded hover:bg-red-50 text-sm"
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default CallManager;