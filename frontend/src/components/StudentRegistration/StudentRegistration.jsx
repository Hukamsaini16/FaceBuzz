// import React, { useState, useRef, useEffect } from "react";
// import * as faceapi from "face-api.js";
// import axios from "axios";

// const StudentRegistrationForm = () => {
//   const [enrollNumber, setEnrollNumber] = useState("");
//   const [name, setName] = useState("");
//   const [faceDescriptor, setFaceDescriptor] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [cameraOn, setCameraOn] = useState(false);

//   const videoRef = useRef(null);
//   const canvasRef = useRef(null);

//   useEffect(() => {
//     const loadModels = async () => {
//       try {
//         await faceapi.nets.tinyFaceDetector.loadFromUri("/models");
//         await faceapi.nets.faceLandmark68Net.loadFromUri("/models");
//         await faceapi.nets.faceRecognitionNet.loadFromUri("/models");
//         console.log("Face detection models loaded");
//       } catch (error) {
//         console.error("Error loading models:", error);
//       }
//     };
//     loadModels();
//   }, []);

//   const startCamera = async () => {
//     try {
//       const stream = await navigator.mediaDevices.getUserMedia({ video: true });
//       videoRef.current.srcObject = stream;
//       setCameraOn(true);
//     } catch (error) {
//       console.error("Error accessing camera:", error);
//       alert("Please allow camera access.");
//     }
//   };

//   const stopCamera = () => {
//     const stream = videoRef.current?.srcObject;
//     if (stream) {
//       stream.getTracks().forEach((track) => track.stop());
//       videoRef.current.srcObject = null;
//     }
//     setCameraOn(false);
//   };

//   const captureLandmarks = async () => {
//     setLoading(true);
//     try {
//       const video = videoRef.current;
//       const canvas = canvasRef.current;
//       const displaySize = {
//         width: video.videoWidth,
//         height: video.videoHeight,
//       };

//       faceapi.matchDimensions(canvas, displaySize);

//       const detections = await faceapi
//         .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
//         .withFaceLandmarks()
//         .withFaceDescriptors();

//       if (detections.length === 0) {
//         alert("No face detected. Please try again.");
//         return;
//       }

//       const resizedDetections = faceapi.resizeResults(detections, displaySize);
//       faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);

//       const descriptor = Array.from(resizedDetections[0].descriptor);
//       setFaceDescriptor(descriptor);

//       alert("Face captured successfully!");
//       stopCamera();
//     } catch (error) {
//       console.error("Error capturing face:", error);
//       alert("Something went wrong while capturing the face.");
//     }
//     setLoading(false);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!enrollNumber || !name || !faceDescriptor) {
//       alert("Please enter all fields and capture your face.");
//       return;
//     }

//     try {
//       const response = await axios.post("http://localhost:4000/api/register", {
//         enrollNumber,
//         name,
//         faceDescriptor,
//       });

//       alert(response.data.message || "Student registered successfully!");
//       setEnrollNumber("");
//       setName("");
//       setFaceDescriptor(null);
//       canvasRef.current?.getContext("2d")?.clearRect(0, 0, 300, 300);
//     } catch (error) {
//       console.error("Error registering student:", error);
//       alert("Enroll Number Already Present");
//     }
//   };

  
//   return (
//     <div style={{ padding: "20px", textAlign: "center" }}>
//       <h2>Student Registration</h2>
//       <form
//         onSubmit={handleSubmit}
//         style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "10px" }}
//       >
//         <input
//           type="text"
//           placeholder="Enrollment Number"
//           value={enrollNumber}
//           onChange={(e) => setEnrollNumber(e.target.value)}
//           required
//         />
//         <input
//           type="text"
//           placeholder="Student Name"
//           value={name}
//           onChange={(e) => setName(e.target.value)}
//           required
//         />

//         <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
//           {!cameraOn ? (
//             <button type="button" onClick={startCamera}>Start Camera</button>
//           ) : (
//             <button type="button" onClick={stopCamera}>Stop Camera</button>
//           )}
//           <button type="button" onClick={captureLandmarks} disabled={loading}>
//             {loading ? "Capturing..." : "Capture Face"}
//           </button>
//         </div>

//         <button type="submit" style={{ marginTop: "10px" }}>Register</button>
//       </form>

//       <div style={{ position: "relative", marginTop: "20px" }}>
//         <video
//           ref={videoRef}
//           autoPlay
//           muted
//           playsInline
//           width="300"
//           height="300"
//           style={{ border: "1px solid black" }}
//         />
//         <canvas
//           ref={canvasRef}
//           width="300"
//           height="300"
//           style={{ position: "absolute", top: 0, left: 0 }}
//         />
//       </div>
//     </div>
//   );
// };

// export default StudentRegistrationForm;


import React, { useState, useRef, useEffect } from "react";
import * as faceapi from "face-api.js";
import axios from "axios";
import "./StudentRegistration.css";

const StudentRegistrationForm = () => {
  const [enrollNumber, setEnrollNumber] = useState("");
  const [name, setName] = useState("");
  const [faceDescriptor, setFaceDescriptor] = useState(null);
  const [loading, setLoading] = useState(false);
  const [cameraOn, setCameraOn] = useState(false);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    const loadModels = async () => {
      try {
        await faceapi.nets.tinyFaceDetector.loadFromUri("/models");
        await faceapi.nets.faceLandmark68Net.loadFromUri("/models");
        await faceapi.nets.faceRecognitionNet.loadFromUri("/models");
        console.log("Face detection models loaded");
      } catch (error) {
        console.error("Error loading models:", error);
      }
    };
    loadModels();
  }, []);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      videoRef.current.srcObject = stream;
      setCameraOn(true);
    } catch (error) {
      console.error("Error accessing camera:", error);
      alert("Please allow camera access.");
    }
  };

  const stopCamera = () => {
    const stream = videoRef.current?.srcObject;
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
    setCameraOn(false);
  };

  const captureLandmarks = async () => {
    setLoading(true);
    try {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const displaySize = {
        width: video.videoWidth,
        height: video.videoHeight,
      };

      faceapi.matchDimensions(canvas, displaySize);

      const detections = await faceapi
        .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks()
        .withFaceDescriptors();

      if (detections.length === 0) {
        alert("No face detected. Please try again.");
        return;
      }

      const resizedDetections = faceapi.resizeResults(detections, displaySize);
      faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);

      const descriptor = Array.from(resizedDetections[0].descriptor);
      setFaceDescriptor(descriptor);

      alert("Face captured successfully!");
      stopCamera();
    } catch (error) {
      console.error("Error capturing face:", error);
      alert("Something went wrong while capturing the face.");
    }
    setLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!enrollNumber || !name || !faceDescriptor) {
      alert("Please enter all fields and capture your face.");
      return;
    }

    try {
      const response = await axios.post("http://localhost:4000/api/register", {
        enrollNumber,
        name,
        faceDescriptor,
      });

      alert(response.data.message || "Student registered successfully!");
      setEnrollNumber("");
      setName("");
      setFaceDescriptor(null);
      canvasRef.current?.getContext("2d")?.clearRect(0, 0, 300, 300);
    } catch (error) {
      console.error("Error registering student:", error);
      alert("Enroll Number Already Present");
    }
  };

  return (
    <div className="registration-container">
      <h2 className="registration-title">Student Registration</h2>
      <form className="registration-form" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enrollment Number"
          value={enrollNumber}
          onChange={(e) => setEnrollNumber(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Student Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <div className="button-group">
          {!cameraOn ? (
            <button type="button" onClick={startCamera}>Start Camera</button>
          ) : (
            <button type="button" onClick={stopCamera}>Stop Camera</button>
          )}
          <button type="button" onClick={captureLandmarks} disabled={loading}>
            {loading ? "Capturing..." : "Capture Face"}
          </button>
        </div>

        <button type="submit" className="submit-button">Register</button>
      </form>

      <div className="video-container">
        <video ref={videoRef} autoPlay muted playsInline width="300" height="300" />
        <canvas ref={canvasRef} width="300" height="300" />
      </div>
    </div>
  );
};

export default StudentRegistrationForm;

