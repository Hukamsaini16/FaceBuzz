
import React, { useEffect, useRef, useState } from "react";
import * as faceapi from "face-api.js";
const BASE_URL = import.meta.env.VITE_BACKEND_URL;
import axios from "axios";
import "./TeacherRegistration.css";

const TeacherRegistration = () => {
  const [name, setName] = useState("");
  const [teacherId, setTeacherId] = useState("");
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [capturing, setCapturing] = useState(false);
  const [message, setMessage] = useState("");

  const videoRef = useRef(null);

  useEffect(() => {
    const loadModels = async () => {
      await faceapi.nets.tinyFaceDetector.loadFromUri("/models");
      await faceapi.nets.faceLandmark68Net.loadFromUri("/models");
      await faceapi.nets.faceRecognitionNet.loadFromUri("/models");
      setModelsLoaded(true);
    };
    loadModels();
  }, []);

  const startCamera = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    videoRef.current.srcObject = stream;
    setCapturing(true);
  };

  const stopCamera = () => {
    videoRef.current?.srcObject?.getTracks().forEach((track) => track.stop());
    setCapturing(false);
  };

  const captureFace = async () => {
    const detection = await faceapi
      .detectSingleFace(videoRef.current, new faceapi.TinyFaceDetectorOptions())
      .withFaceLandmarks()
      .withFaceDescriptor();

    if (!detection) {
      setMessage("Face not detected. Try again.");
      return;
    }

    const faceDescriptor = Array.from(detection.descriptor);

    try {
      const response = await axios.post(`${BASE_URL}/api/teachers/register`, {
        name,
        teacherId,
        faceDescriptor,
      },
      { withCredentials: true } // 👈 Send cookies on DELETE also
    );

      if (response.data.success) {
        setMessage("Teacher registered successfully!");
        stopCamera();
        setName("");
        setTeacherId("");
      } else {
        setMessage("Registration failed. Try again.");
      }
    } catch (error) {
      console.error("Registration error:", error);
      setMessage("Error registering teacher.");
    }
  };

  const handleRegister = () => {
    if (!name || !teacherId) {
      setMessage("Please fill in all fields.");
      return;
    }
    captureFace();
  };


  return (
    <div className="teacher-register-container">
      <h2>Teacher Registration</h2>
  
      {message && <p className="message">{message}</p>} {/* <-- Moved here */}
  
      <div className="form">
        <input
          type="text"
          placeholder="Teacher Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Teacher ID"
          value={teacherId}
          onChange={(e) => setTeacherId(e.target.value)}
        />
        <div className="buttons">
          <button onClick={startCamera} disabled={!modelsLoaded || capturing}>
            Start Camera
          </button>
          <button onClick={handleRegister} disabled={!capturing}>
            Capture & Register
          </button>
          <button onClick={stopCamera} disabled={!capturing}>
            Stop Camera
          </button>
        </div>
        <video ref={videoRef} autoPlay muted playsInline className="video-feed" />
      </div>
    </div>
  );
  
};

export default TeacherRegistration;

