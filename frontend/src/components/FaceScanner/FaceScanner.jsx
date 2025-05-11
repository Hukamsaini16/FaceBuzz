
import React, { useState, useEffect, useRef, useContext } from "react";
import * as faceapi from "face-api.js";
import axios from "axios";
import { Bar } from "react-chartjs-2";
const BASE_URL = import.meta.env.VITE_BACKEND_URL;
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";
//import "./TeacherAttendance.css"; // reuse styles
import { useUser } from "../../context/UserContext";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const FaceScanner = () => {
  const { classId } = useUser();
  const [registeredStudents, setRegisteredStudents] = useState([]);
  const [studentsPresent, setStudentsPresent] = useState([]);
  const [cameraOn, setCameraOn] = useState(false);
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [attendanceDone, setAttendanceDone] = useState(false);
  const [attendanceSaved, setAttendanceSaved] = useState(false);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
 
  useEffect(() => {
    const loadModels = async () => {
      await faceapi.nets.tinyFaceDetector.loadFromUri("/models");
      await faceapi.nets.faceLandmark68Net.loadFromUri("/models");
      await faceapi.nets.faceRecognitionNet.loadFromUri("/models");
      setModelsLoaded(true);
    };
    loadModels();
  }, []);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/api/students/class/${classId}`,
          { withCredentials: true } // 👈 Send cookies on DELETE also
        );
        setRegisteredStudents(res.data.students);
      } catch (err) {
        console.error("Error fetching students:", err);
      }
    };
    if (classId) fetchStudents();
  }, [classId]);

  useEffect(() => {
    let interval;
    if (cameraOn && modelsLoaded && !attendanceDone) {
      interval = setInterval(scanFace, 3000);
    }
    return () => clearInterval(interval);
  }, [cameraOn, modelsLoaded, attendanceDone, studentsPresent]);

  const startCamera = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    videoRef.current.srcObject = stream;
    setCameraOn(true);
  };

  const stopCamera = () => {
    videoRef.current?.srcObject?.getTracks().forEach((track) => track.stop());
    setCameraOn(false);
  };

  const scanFace = async () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const displaySize = { width: video.videoWidth, height: video.videoHeight };
    faceapi.matchDimensions(canvas, displaySize);

    const detection = await faceapi
      .detectSingleFace(video, new faceapi.TinyFaceDetectorOptions())
      .withFaceLandmarks()
      .withFaceDescriptor();

    if (!detection) return;

    const faceDescriptor = Array.from(detection.descriptor);

    try {
      const response = await axios.post(`${BASE_URL}/api/students/verify`, {
        classId,
        faceDescriptor,
      },
      { withCredentials: true } // 👈 Send cookies on DELETE also
    );

      if (response.data.success) {
        const alreadyMarked = studentsPresent.some(
          (s) => s.studentId === response.data.studentId
        );

        if (!alreadyMarked) {
          setStudentsPresent((prev) => [...prev, response.data]);
          const speech = new SpeechSynthesisUtterance(`${response.data.name} present`);
          window.speechSynthesis.speak(speech);
        }
      }
    } catch (err) {
      console.log("Student not matched or error:", err);
    }
  };

  const handleDone = () => {
    stopCamera();
    setAttendanceDone(true);
  };

  const saveAttendanceToDB = async () => {
    if (!studentsPresent || studentsPresent.length === 0) {
      alert("No students were marked present.");
      return;
    }
  
    try {
      const payload = {
        classId,
        date: new Date().toISOString(),
        presentStudents: studentsPresent.map((s) => s.studentId),
      };
  
      console.log("Sending attendance:", payload); // Debug log
  
      await axios.post(`${BASE_URL}/api/students/mark-attendance`, payload,
        { withCredentials: true } // 👈 Send cookies on DELETE also
      );
  
      setAttendanceSaved(true);
      alert("Attendance saved successfully!");
    } catch (err) {
      console.error("Saving attendance failed:", err);
      alert("Error saving attendance.");
    }
  };

  const today = new Date();
  const dayStr = today.toLocaleDateString("en-US", { weekday: "long" });
  const dateStr = today.toLocaleDateString();
  const total = registeredStudents.length;
  const present = studentsPresent.length;
  const absent = total - present;
  const percent = total > 0 ? ((present / total) * 100).toFixed(2) : "0.00";

  const chartData = {
    labels: ["Total Students", "Present", "Absent"],
    datasets: [
      {
        label: "Attendance Count",
        data: [total, present, absent],
        backgroundColor: ["#007bff", "#28a745", "#dc3545"],
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: { enabled: true },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: { stepSize: 1 },
      },
    },
  };

  return (
    <div className="scanner-container">
      {!attendanceDone ? (
        <>
          <h2 className="scanner-title">Student Face Recognition Attendance</h2>
          <div className="scanner-buttons">
            <button onClick={startCamera} disabled={cameraOn || !modelsLoaded}>
              Start Attendance
            </button>
            <button onClick={handleDone} disabled={!cameraOn}>
              Done
            </button>
          </div>
          <div className="video-wrapper">
            <video ref={videoRef} autoPlay muted playsInline className="video-feed" />
            <canvas ref={canvasRef} className="video-canvas" />
          </div>
        </>
      ) : (
        <>
          <h2 className="scanner-title">Attendance Summary</h2>
          <div className="summary-container">
            <div className="summary-left">
              <p><strong>Day:</strong> {dayStr}</p>
              <p><strong>Date:</strong> {dateStr}</p>
              <p><strong>Present Students:</strong> {present}</p>
              <p><strong>Attendance Percentage:</strong> {percent}%</p>
              <div className="chart-wrapper">
                <Bar data={chartData} options={chartOptions} />
              </div>
              <button
                onClick={saveAttendanceToDB}
                disabled={attendanceSaved}
                className="summary-done-btn"
              >
                {attendanceSaved ? "Attendance Saved ✅" : "Save Attendance to Database"}
              </button>
            </div>

            <div className="summary-right">
              <h3>Present Students</h3>
              <ul>
                {studentsPresent.map((s, i) => (
                  <li key={i}>{s.name}</li>
                ))}
              </ul>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default FaceScanner;


