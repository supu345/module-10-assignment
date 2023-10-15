const express = require("express");
const StudentsController = require("../controllers/StudentsController");
const WorksController = require("../controllers/WorksController");
const AuthVerifyMiddleware = require("../middleware/AuthVerifyMiddleware");

const router = express.Router();

// Students Manage
router.post("/registration", StudentsController.registration);
router.post("/login", StudentsController.login);
router.post(
  "/studentsUpdate",
  AuthVerifyMiddleware,
  StudentsController.studentsUpdate
);
router.post(
  "/deleteStudentProfile",
  AuthVerifyMiddleware,
  StudentsController.deleteStudentProfile
);
router.get("/RecoverVerifyEmail/:email", StudentsController.RecoverVerifyEmail);
router.get(
  "/RecoverVerifyOTP/:email/:otp",
  StudentsController.RecoverVerifyOTP
);
router.post("/RecoverResetPass", StudentsController.RecoverResetPass);

// Works Manage
router.post("/createWork", AuthVerifyMiddleware, WorksController.createWork);
router.get("/deleteWork/:id", AuthVerifyMiddleware, WorksController.deleteWork);
router.get(
  "/updateWorkStatus/:id/:status",
  AuthVerifyMiddleware,
  WorksController.updateWorkStatus
);
router.get(
  "/listWorkByStatus/:status",
  AuthVerifyMiddleware,
  WorksController.listWorkByStatus
);

router.get(
  "/workStatusCount",
  AuthVerifyMiddleware,
  WorksController.workStatusCount
);
module.exports = router;
