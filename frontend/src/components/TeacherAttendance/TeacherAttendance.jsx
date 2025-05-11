import React, { useState, useRef, useEffect } from "react";
import * as faceapi from "face-api.js";
import axios from "axios";
const BASE_URL = import.meta.env.VITE_BACKEND_URL;
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";
import "./TeacherAttendance.css";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const FaceScanner = () => {
  const [teachersPresent, setTeachersPresent] = useState([]);
  const [registeredTeachers, setRegisteredTeachers] = useState([]);
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
    const fetchTeachers = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/api/teachers/teachers`,
          {
            withCredentials: true,
          }
        );
        setRegisteredTeachers(response.data.teachers || []);
      } catch (error) {
        console.error("Error fetching teachers:", error);
      }
    };
    fetchTeachers();
  }, []);

  useEffect(() => {
    let interval;
    if (cameraOn && modelsLoaded && !attendanceDone) {
      interval = setInterval(() => scanFace(), 3000);
    }
    return () => clearInterval(interval);
  }, [cameraOn, modelsLoaded, attendanceDone, teachersPresent]);

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
      const response = await axios.post(
        `${BASE_URL}/api/teachers/verify`,
        { faceDescriptor },
        { withCredentials: true }
      );

      if (response.data.success) {
        const alreadyMarked = teachersPresent.some(
          (teacher) => teacher.teacherId === response.data.teacherId
        );

        if (!alreadyMarked) {
          setTeachersPresent((prev) => [...prev, response.data]);
          const speech = new SpeechSynthesisUtterance(
            `welcome ${response.data.name}`
          );
          window.speechSynthesis.speak(speech);
        }
      }
    } catch (err) {
      console.error("Face not matched or error:", err);
    }
  };

  const handleDone = () => {
    stopCamera();
    setAttendanceDone(true);
  };

  const saveAttendanceToDB = async () => {
    try {
      await axios.post(
        `${BASE_URL}/api/teachers/teachers/mark-attendance`,
        {
          date: new Date().toISOString(),
          //date: new Date().toLocaleDateString("en-CA"), 
          teachersPresent: teachersPresent.map((t) => ({
            teacherId: t.teacherId,
            name: t.name,
          })),
        },
        {
          withCredentials: true,
        }
      );

      console.log("Sending to DB:", {
        date: new Date().toISOString(),
        teachersPresent: teachersPresent.map((t) => ({
          teacherId: t.teacherId,
          name: t.name,
        })),
      });

      setAttendanceSaved(true);
      alert("Attendance saved successfully!");
    } catch (error) {
      console.error("Error saving attendance:", error);
      alert("Failed to save attendance.");
    }
  };

  const today = new Date();
  const dayStr = today.toLocaleDateString("en-US", { weekday: "long" });
  const dateStr = today.toLocaleDateString();
  const total = registeredTeachers.length;
  const present = teachersPresent.length;
  const absent = total - present;
  const percent = total > 0 ? ((present / total) * 100).toFixed(2) : "0.00";

  const chartData = {
    labels: ["Total Teachers", "Present", "Absent"],
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
        precision: 0,
        ticks: {
          stepSize: 1,
        },
      },
    },
  };

  return (
    <div className="scanner-container">
      {!attendanceDone ? (
        <>
          <h2 className="scanner-title">Teacher Face Recognition Attendance</h2>
          <div className="scanner-buttons">
            <button onClick={startCamera} disabled={cameraOn || !modelsLoaded}>
              Start Attendance
            </button>
            <button onClick={handleDone} disabled={!cameraOn}>
              Done
            </button>
          </div>

          <div className="video-wrapper">
            <video
              ref={videoRef}
              autoPlay
              muted
              playsInline
              className="video-feed"
            />
            <canvas ref={canvasRef} className="video-canvas" />
          </div>
        </>
      ) : (
        <>
          <h2 className="scanner-title">Attendance Summary</h2>
          <div className="summary-container">
            <div className="summary-left">
              <p>
                <strong>Day:</strong> {dayStr}
              </p>
              <p>
                <strong>Date:</strong> {dateStr}
              </p>
              <p>
                <strong>Present Teachers:</strong> {present}
              </p>
              <p>
                <strong>Attendance Percentage:</strong> {percent}%
              </p>
              <div className="chart-wrapper">
                <Bar data={chartData} options={chartOptions} />
              </div>
              <button
                onClick={saveAttendanceToDB}
                disabled={attendanceSaved}
                className="summary-done-btn"
              >
                {attendanceSaved
                  ? "Attendance Saved ✅"
                  : "Save Attendance to Database"}
              </button>
            </div>

            <div className="summary-right">
              <h3>Present Teachers</h3>
              <ul>
                {teachersPresent.map((t, i) => (
                  <li key={i}>{t.name}</li>
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
