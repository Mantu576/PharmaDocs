// backend/controllers/modulesController.js
const User = require("../models/User");

// Helper function: available modules by plan
const getModulesByPlan = (plan) => {
  switch (plan) {
    case "Basic":
      return ["AMV", "Stability"];
    case "Pro":
      return ["AMV", "Stability", "PV", "Degradation", "Raw Data Templates"];
    case "Enterprise":
      return [
        "AMV",
        "Stability",
        "PV",
        "Degradation",
        "Raw Data Templates",
      ];
    default:
      return [];
  }
};

// Controller
exports.getAvailableModules = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId); // ✅ req.user.userId comes from authMiddleware

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const modulesAllowed = getModulesByPlan(user.subscriptionPlan);

    res.json({ modules: modulesAllowed }); // ✅ send object with modules
  } catch (err) {
    console.error("Error fetching modules:", err);
    res.status(500).json({ message: "Server error" });
  }
};
