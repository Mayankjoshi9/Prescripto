import React, { useEffect, useState } from "react";
import axios from "axios";
import { useContext } from "react";
import { DoctorContext } from "../../context/DoctorContext";

const PatientPage = () => {
    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(true);
    const { dToken, backendUrl, profileData, getProfileData } = useContext(DoctorContext);

    


        useEffect(() => {
            const fetchPatients = async () => {

                try {
                     getProfileData();
                    const res = await axios.get(backendUrl + `/api/doctor/${profileData._id}/patients`, { headers: { dToken } });
                    setPatients(res.data.patients);
                } catch (error) {
                    console.error("Failed to fetch patients", error);
                } finally {
                    setLoading(false);
                }
            };
            
        
            fetchPatients();
            
        }, [dToken]);


    
    

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Patients</h1>
            {loading ? (
                <p>Loading...</p>
            ) : patients.length === 0 ? (
                <p>No patients found for this doctor.</p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {patients.map((patient, index) => (
                        <div key={index} className="border p-4 rounded shadow">
                            <img src={patient.image} alt={patient.name} className="w-16 h-16 rounded-full mb-2" />
                            <h2 className="font-semibold text-lg">{patient.name}</h2>
                            <p>Email: {patient.email}</p>
                            <p>Phone: {patient.phone}</p>
                            <p>Gender: {patient.gender}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default PatientPage;
