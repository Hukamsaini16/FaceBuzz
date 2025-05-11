
import { useEffect, useRef, useState } from "react";
import * as faceapi from "face-api.js";
import { useNavigate, useSearchParams } from "react-router-dom";
const BASE_URL = import.meta.env.VITE_BACKEND_URL;
import "./FaceLogin.css";
import { useUser } from "../../context/UserContext";

export default function FaceLogin() {
  const { setLoginTeacherId, setLoginAdminId } = useUser();
  const videoRef = useRef(null);
  const intervalRef = useRef(null);
  const streamRef = useRef(null); // store the media stream
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const role = searchParams.get("role"); // 'admin' or 'teacher'
  const [message, setMessage] = useState("Initializing face recognition...");

  // ✅ Load models
  useEffect(() => {
    const loadModels = async () => {
      const MODEL_URL = "/models";
      await Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
        faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
        faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
      ]);
      startCamera();
    };

    loadModels();

    return () => {
      stopRecognition();
      stopCamera();
    };
  }, []);

  const startCamera = () => {
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((stream) => {
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.onloadedmetadata = () => {
            videoRef.current.play();
            startRecognition();
          };
        }
      })
      .catch((err) => {
        console.error("Camera error:", err);
        setMessage("Unable to access camera");
      });
  };

  const stopRecognition = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const stopCamera = () => {
    const stream = streamRef.current;
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  const speak = (text) => {
    const speech = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(speech);
  };

  const captureAndVerify = async () => {
    if (!videoRef.current || !role) return;

    const detection = await faceapi
      .detectSingleFace(videoRef.current, new faceapi.TinyFaceDetectorOptions())
      .withFaceLandmarks()
      .withFaceDescriptor();

    if (!detection) {
      setMessage("No face detected...");
      return;
    }

    const descriptor = Array.from(detection.descriptor);
    const endpoint = role === "admin" ? "/api/admins/verify" : "/api/teachers/verify";

    try {
      const res = await fetch(`${BASE_URL}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // 🔥 Important to allow cookies
        body: JSON.stringify({ faceDescriptor: descriptor }),
      });

      const data = await res.json();

      
      if (data.success) {
        stopRecognition();
        stopCamera();
      
        const name = data.name || "User";
        const id = data.teacherId || data.adminId;
      
        // 🔥 Save ID and expiry time
        const now = new Date();
        const expiryTime = now.getTime() + 24 * 60 * 60 * 1000; // 24 hours expiry
      
        if (role === "admin") {
          setLoginAdminId(id);
          localStorage.setItem("loginAdminId", id);
        } else {
          setLoginTeacherId(id);
          localStorage.setItem("loginTeacherId", id);
        }
        localStorage.setItem("authExpiry", expiryTime); // 🔥 Save expiry in localStorage
      
        if (role === "admin") {
          setMessage(`Welcome, ${name}`);
          speak(`Welcome ${name}`);
        } else {
          setMessage(`Good Morning, ${name}`);
          speak(`Good Morning ${name}`);
        }
      
        // ✅ After short wait, move to dashboard
        setTimeout(() => {
          navigate(role === "admin" ? "/admin/dashboard" : "/teacher/dashboard");
        }, 1500);
      }
      
           
       else {
        setMessage("Face not matched. Retrying...");
      }
    } catch (err) {
      console.error("Verification failed:", err);
      setMessage("Error verifying face. Please try again.");
    }
};


  const startRecognition = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(captureAndVerify, 3000);
  };

  return (
    <div className="face-login-container">
      <div className="video-box">
        <video ref={videoRef} autoPlay muted className="video-element" />
        <p className="face-login-message">{message}</p>
      </div>
    </div>
  );
}


