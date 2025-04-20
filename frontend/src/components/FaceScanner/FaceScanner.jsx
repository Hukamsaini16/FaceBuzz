import React, { useState, useRef, useEffect } from "react";
import * as faceapi from "face-api.js";
import axios from "axios";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";
import "./FaceScanner.css";

// Register necessary Chart.js components
ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const FaceScanner = () => {
  const [studentsPresent, setStudentsPresent] = useState([]);
  const [registeredStudents, setRegisteredStudents] = useState([]);
  const [cameraOn, setCameraOn] = useState(false);
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [attendanceDone, setAttendanceDone] = useState(false);

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
        const response = await axios.get("http://localhost:4000/api/students");
        setRegisteredStudents(response.data.students);
      } catch (error) {
        console.error("Error fetching students:", error);
      }
    };
    fetchStudents();
  }, []);

  useEffect(() => {
    let interval;
    if (cameraOn && modelsLoaded && !attendanceDone) {
      interval = setInterval(() => scanFace(), 3000);
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
      const response = await axios.post("http://localhost:4000/api/verify", { faceDescriptor });
      if (response.data.success) {
        const alreadyMarked = studentsPresent.some(
          (student) => student.enrollNumber === response.data.enrollNumber
        );
        if (!alreadyMarked) {
          setStudentsPresent((prev) => [...prev, response.data]);
          const speech = new SpeechSynthesisUtterance(`${response.data.name} present`);
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

  const today = new Date();
  const dayStr = today.toLocaleDateString("en-US", { weekday: "long" });
  const dateStr = today.toLocaleDateString();
  const total = registeredStudents.length;
  const present = studentsPresent.length;
  const absent = total - present;
  const percent = total > 0 ? ((present / total) * 100).toFixed(2) : "0.00";

  const chartData = {
    labels: ["Total", "Present", "Absent"],
    datasets: [
      {
        label: "Students",
        data: [total, present, absent],
        backgroundColor: ["#007bff", "#28a745", "#dc3545"],
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
          <h2 className="scanner-title">Face Recognition Attendance</h2>
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
          <p><strong>Day:</strong> {dayStr}</p>
          <p><strong>Date:</strong> {dateStr}</p>
          <p><strong>Present Students:</strong> {present}</p>
          <p><strong>Attendance Percentage:</strong> {percent}%</p>

          <div style={{ maxWidth: "500px", margin: "20px auto" }}>
            <Bar data={chartData} options={chartOptions} />
          </div>
        </>
      )}
    </div>
  );
};

export default FaceScanner;
