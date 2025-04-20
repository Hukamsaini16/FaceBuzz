// import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
// import Home from "./pages/Home";
// import VerifyStudent from "./pages/verifyStudent";
// import Navbar from "./components/Navbar/Navbar";


// function App() {
//   return (
//     <Router>

//       <Navbar />
//       {/* <nav>
        
//         <ul>
//           <li><Link to="/">Home</Link></li>
//           <li><Link to="/verify">Verify Student</Link></li>
//         </ul>
//       </nav> */}

//       <Routes>
//         <Route path="/" element={<Home />} />
//         <Route path="/verify" element={<VerifyStudent />} />
//       </Routes>
//     </Router>
//   );
// }

// export default App;

import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import Home from "./pages/Home/Home";
import StudentRegister from "./pages/StudentRegister/StudentRegister";
import Attendance from "./pages/Attendance/Attendance";



function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<StudentRegister />} />
        <Route path="/attendance" element={<Attendance />} />
      </Routes>
    </Router>
  );
}

export default App;

