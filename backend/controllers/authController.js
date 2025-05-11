// authController.js

export const logoutUser = (req, res) => {
    try {
      res.clearCookie("authToken", {
        httpOnly: true,
        secure: true, // set to true if you're using HTTPS
        sameSite: "strict",
      });
      res.status(200).json({ success: true, message: "Logged out successfully." });
    } catch (error) {
      console.error("Logout error:", error);
      res.status(500).json({ success: false, message: "Server error during logout." });
    }
  };
  