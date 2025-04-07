import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";


export default function Userpage() {
  const [patients, setPatients] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [emailContent, setEmailContent] = useState("");
  const [activeTab, setActiveTab] = useState("patients");

  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const aToken = localStorage.getItem("aToken");

  useEffect(() => {
    fetchPatients();
    fetchAppointments();
  }, []);

  
  

  const fetchPatients = async () => {
    try {
      const res = await axios.get(backendUrl + "/api/admin/all-patients", {
        headers: { aToken },
      });
      setPatients(res.data.data);
    } catch (error) {
      console.error("Error fetching patients:", error);
    }
  };

  const fetchAppointments = async () => {
    try {
      const res = await axios.get(backendUrl + "/api/admin/appointments", {
        headers: { aToken },
      });
      // console.log(res.data.appointments);
      setAppointments(res.data.appointments);
    } catch (error) {
      console.error("Error fetching appointments:", error);
    }
  };

  const sendEmail = async () => {
    if (!selectedPatient || !emailContent.trim()) return;
    try {
      await axios.post(
        backendUrl + "/api/admin/send-email",
        {
          to: selectedPatient.email,
          content: emailContent,
        },
        {
          headers: { aToken },
        }
      );
      toast.success("Email sent successfully!");
      setEmailContent("");
    } catch (err) {
      console.error("Error sending email:", err);
      toast.failure("Failed to send email.");
    }
  };

  console.log(selectedPatient)


  return (
    <div className="w-full h-full px-[100px] flex justify-center items-start flex-col p-6 space-y-6">
      <h1 className="text-3xl font-bold">Patient Admin Dashboard</h1>

      {/* Tabs */}
      <div className="flex space-x-4 border-b pb-2">
        {["patients", "appointments", "email"].map((tab) => (
          <button
            key={tab}
            className={`px-4 py-2 rounded-t ${
              activeTab === tab ? "bg-blue-500 text-white" : "bg-gray-200"
            }`}
            onClick={() => setActiveTab(tab)}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Patients Tab */}
      {activeTab === "patients" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {patients.map((patient) => (
            <div
              key={patient._id}
              className={`bg-white p-4 shadow rounded-xl border-2 transition ${
                selectedPatient?._id === patient._id
                  ? "border-blue-500"
                  : "border-transparent"
              }`}
            >
              <h2 className="font-semibold text-lg">{patient.name}</h2>
              <p>Email: {patient.email}</p>
              <p>Phone: {patient.phone}</p>
              <p>Gender: {patient.gender}</p>
              <button
                className="mt-2 text-sm text-blue-600 hover:underline"
                onClick={() => setSelectedPatient(patient)}
              >
                {selectedPatient?._id === patient._id ? "Selected" : "Select"}
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Appointments Tab */}
      {activeTab === "appointments" && (
        <div className="space-y-4 w-full h-[70vh] overflow-y-scroll">
        {selectedPatient &&
          appointments.filter((app)=>app.userId==selectedPatient?._id).map((appt) => (
            <div key={appt._id} className="bg-white p-4 shadow rounded-xl">
              <h2 className="font-semibold">
                {appt.userData?.name || "Unknown Patient"} - {appt.slotDate} at{" "}
                {appt.slotTime}
              </h2>
              <p>Doctor: {appt.docData?.name || "Unknown Doctor"}</p>
              <p>
                Status:{" "}
                {appt.isCompleted
                  ? "Completed"
                  : appt.cancelled
                  ? "Cancelled"
                  : "Scheduled"}
              </p>
            </div>
          ))}

          {!selectedPatient &&
          <div className="bg-white p-4 shadow rounded-xl">
            <h2 className="font-semibold">Select a patient to view their appointments.</h2>
          </div>
          }

            
            {selectedPatient && !appointments.filter((app)=>app.userId==selectedPatient?._id).length && (
              <p className="text-gray-500">No appointments found for this patient.</p>
            )}
        </div>
      )}

      {/* Send Email Tab */}
      {activeTab === "email" && (
        <div className="space-y-4">
          {selectedPatient ? (
            <>
              <p className="text-sm text-gray-700">
                Sending email to: <strong>{selectedPatient.email}</strong>
              </p>
              <textarea
                value={emailContent}
                onChange={(e) => setEmailContent(e.target.value)}
                placeholder="Write your message here..."
                className="w-full p-3 border rounded resize-none min-h-[100px]"
              />
              <button
                onClick={sendEmail}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                Send Email
              </button>
            </>
          ) : (
            <p className="text-gray-500">
              Please select a patient from the Patients tab first.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
