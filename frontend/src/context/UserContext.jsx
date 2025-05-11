
// import React, { createContext, useContext, useState, useEffect } from "react";

// const UserContext = createContext();

// export const UserProvider = ({ children }) => {
//   const [loginTeacherId, setLoginTeacherId] = useState(() => {
//     // Get loginTeacherId from localStorage if available
//     return localStorage.getItem("loginTeacherId") || null;
//   });

//   useEffect(() => {
//     // Update localStorage whenever loginTeacherId changes
//     if (loginTeacherId) {
//       localStorage.setItem("loginTeacherId", loginTeacherId);
//     }
//   }, [loginTeacherId]);


//   const [loginAdminId, setLoginAdminId] = useState(() => {
//     // Get loginAdminId from localStorage if available
//     return localStorage.getItem("loginAdminId") || null;
//   });

//   useEffect(() => {
//     // Update localStorage whenever loginAdminId changes
//     if (loginAdminId) {
//       localStorage.setItem("loginAdminId", loginAdminId);
//     }
//   }, [loginAdminId]);

//   const [classId, setClassId] = useState(() => {
//     // Get classId from localStorage if available
//     return localStorage.getItem("classId") || null;
//   });

//   useEffect(() => {
//     // Update localStorage whenever classId changes
//     if (classId) {
//       localStorage.setItem("classId", classId);
//     }
//   }, [classId]);

//   return (
//     <UserContext.Provider value={{ classId, setClassId,loginTeacherId, setLoginTeacherId,loginAdminId, setLoginAdminId }}>
//       {children}
//     </UserContext.Provider>
//   );
// };

// export const useUser = () => useContext(UserContext);










// import React, { createContext, useContext, useState, useEffect } from "react";

// const UserContext = createContext();

// export const UserProvider = ({ children }) => {
//   const [loginTeacherId, setLoginTeacherId] = useState(() => {
//     return localStorage.getItem("loginTeacherId") || null;
//   });

//   const [loginAdminId, setLoginAdminId] = useState(() => {
//     return localStorage.getItem("loginAdminId") || null;
//   });

//   const [classId, setClassId] = useState(() => {
//     return localStorage.getItem("classId") || null;
//   });

//   useEffect(() => {
//     if (loginTeacherId) {
//       localStorage.setItem("loginTeacherId", loginTeacherId);
//     }
//   }, [loginTeacherId]);

//   useEffect(() => {
//     if (loginAdminId) {
//       localStorage.setItem("loginAdminId", loginAdminId);
//     }
//   }, [loginAdminId]);

//   useEffect(() => {
//     if (classId) {
//       localStorage.setItem("classId", classId);
//     }
//   }, [classId]);

//   // 🔴 LOGOUT METHODS
//   const logoutTeacher = () => {
//     localStorage.removeItem("loginTeacherId");
//     localStorage.removeItem("classId");
//     setLoginTeacherId(null);
//     setClassId(null);
//   };

//   const logoutAdmin = () => {
//     localStorage.removeItem("loginAdminId");
//     setLoginAdminId(null);
//   };

//   return (
//     <UserContext.Provider
//       value={{
//         classId,
//         setClassId,
//         loginTeacherId,
//         setLoginTeacherId,
//         loginAdminId,
//         setLoginAdminId,
//         logoutTeacher,
//         logoutAdmin, // ✅ Now available in your components
//       }}
//     >
//       {children}
//     </UserContext.Provider>
//   );
// };

// export const useUser = () => useContext(UserContext);






// import React, { createContext, useContext, useState, useEffect } from "react";
// import axios from "axios"; // 👈 Added axios for logout API

// const UserContext = createContext();

// export const UserProvider = ({ children }) => {
//   const [loginTeacherId, setLoginTeacherId] = useState(() => {
//     return localStorage.getItem("loginTeacherId") || null;
//   });

//   const [loginAdminId, setLoginAdminId] = useState(() => {
//     return localStorage.getItem("loginAdminId") || null;
//   });

//   const [classId, setClassId] = useState(() => {
//     return localStorage.getItem("classId") || null;
//   });

//   useEffect(() => {
//     if (loginTeacherId) {
//       localStorage.setItem("loginTeacherId", loginTeacherId);
//     }
//   }, [loginTeacherId]);

//   useEffect(() => {
//     if (loginAdminId) {
//       localStorage.setItem("loginAdminId", loginAdminId);
//     }
//   }, [loginAdminId]);

//   useEffect(() => {
//     if (classId) {
//       localStorage.setItem("classId", classId);
//     }
//   }, [classId]);

//   // 🔴 LOGOUT METHODS
//   const logoutTeacher = async () => {
//     try {
//       // First remove from local storage and state immediately
//       localStorage.removeItem("loginTeacherId");
//       localStorage.removeItem("classId");
//       setLoginTeacherId(null);
//       setClassId(null);
  
//       // Then call API
//       await axios.post("http://localhost:4000/api/logout", {}, { withCredentials: true });
//     } catch (error) {
//       console.error("Teacher logout error:", error);
//     }
//   };
  
//   const logoutAdmin = async () => {
//     try {
//       // First remove from local storage and state immediately
//       localStorage.removeItem("loginAdminId");
//       setLoginAdminId(null);
  
//       // Then call API
//       await axios.post("http://localhost:4000/api/logout", {}, { withCredentials: true });
//     } catch (error) {
//       console.error("Admin logout error:", error);
//     }
//   };
  

//   return (
//     <UserContext.Provider
//       value={{
//         classId,
//         setClassId,
//         loginTeacherId,
//         setLoginTeacherId,
//         loginAdminId,
//         setLoginAdminId,
//         logoutTeacher,
//         logoutAdmin, // ✅ Now available in your components
//       }}
//     >
//       {children}
//     </UserContext.Provider>
//   );
// };

// export const useUser = () => useContext(UserContext);


import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
const BASE_URL = import.meta.env.VITE_BACKEND_URL;

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [loginTeacherId, setLoginTeacherId] = useState(() => {
    return localStorage.getItem("loginTeacherId") || null;
  });

  const [loginAdminId, setLoginAdminId] = useState(() => {
    return localStorage.getItem("loginAdminId") || null;
  });

  const [classId, setClassId] = useState(() => {
    return localStorage.getItem("classId") || null;
  });

  // ✅ Check if token is expired on app load
  useEffect(() => {
    const authExpiry = localStorage.getItem("authExpiry");
    const isExpired = !authExpiry || new Date().getTime() > Number(authExpiry);

    if (isExpired) {
      console.log("Auth expired, clearing storage...");
      localStorage.removeItem("authToken");
      localStorage.removeItem("authExpiry");
      localStorage.removeItem("loginTeacherId");
      localStorage.removeItem("loginAdminId");
      localStorage.removeItem("classId");

      setLoginTeacherId(null);
      setLoginAdminId(null);
      setClassId(null);
    }
  }, []);

  // ✅ Save loginTeacherId and set expiry
  useEffect(() => {
    if (loginTeacherId) {
      localStorage.setItem("loginTeacherId", loginTeacherId);

      // Set expiry 1 day from now
      const oneDayLater = new Date().getTime() + 24 * 60 * 60 * 1000;
      localStorage.setItem("authExpiry", oneDayLater.toString());
    }
  }, [loginTeacherId]);

  // ✅ Save loginAdminId and set expiry
  useEffect(() => {
    if (loginAdminId) {
      localStorage.setItem("loginAdminId", loginAdminId);

      // Set expiry 1 day from now
      const oneDayLater = new Date().getTime() + 24 * 60 * 60 * 1000;
      localStorage.setItem("authExpiry", oneDayLater.toString());
    }
  }, [loginAdminId]);

  // ✅ Save classId separately
  useEffect(() => {
    if (classId) {
      localStorage.setItem("classId", classId);
    }
  }, [classId]);

  // 🔴 LOGOUT METHODS
  const logoutTeacher = async () => {
    try {
      localStorage.removeItem("loginTeacherId");
      localStorage.removeItem("classId");
      localStorage.removeItem("authToken");
      localStorage.removeItem("authExpiry");
      setLoginTeacherId(null);
      setClassId(null);

      await axios.post(`${BASE_URL}/api/logout`, {}, { withCredentials: true });
    } catch (error) {
      console.error("Teacher logout error:", error);
    }
  };

  const logoutAdmin = async () => {
    try {
      localStorage.removeItem("loginAdminId");
      localStorage.removeItem("authToken");
      localStorage.removeItem("authExpiry");
      setLoginAdminId(null);

      await axios.post(`${BASE_URL}/api/logout`, {}, { withCredentials: true });
    } catch (error) {
      console.error("Admin logout error:", error);
    }
  };

  return (
    <UserContext.Provider
      value={{
        classId,
        setClassId,
        loginTeacherId,
        setLoginTeacherId,
        loginAdminId,
        setLoginAdminId,
        logoutTeacher,
        logoutAdmin,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);

