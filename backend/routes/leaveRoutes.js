import express from "express";
import oracledb from "oracledb";

import getConnection from "../config/db.js";

const router = express.Router();

// Submit leave request
router.post("/", async (req, res) => {
  const { student_id, start_date, end_date, reason } = req.body;
  try {
    const connection = await getConnection();
    await connection.execute(
      `INSERT INTO leave_requests (student_id, from_date, to_date, reason, status)
         VALUES (:student_id, TO_DATE(:start_date, 'YYYY-MM-DD'), TO_DATE(:end_date, 'YYYY-MM-DD'), :reason, 'PENDING')`,
      { student_id, start_date, end_date, reason }
    );
    await connection.commit();
    await connection.close();
    res.json({ message: "Leave request submitted." });
  } catch (err) {
    console.error("Error submitting leave request:", err);
    res.status(500).json({ error: err.message });
  }
});

// Approve leave (calls PL/SQL proc approve_leave)
router.put("/:id/approve", async (req, res) => {
  const { id } = req.params;
  try {
    const connection = await getConnection();
    await connection.execute(
      `BEGIN
           approve_leave(:id);
         END;`,
      { id }
    );
    await connection.commit();
    await connection.close();
    res.json({ message: "Leave approved." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all leave requests
router.get("/", async (req, res) => {
  try {
    const connection = await getConnection();
    const result = await connection.execute("SELECT * FROM leave_requests");
    await connection.close();
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get leave requests by student
router.get("/:studentId", async (req, res) => {
  const { studentId } = req.params;
  try {
    const connection = await getConnection();
    const result = await connection.execute(
      "SELECT * FROM leave_requests WHERE student_id = :studentId",
      { studentId }
    );
    await connection.close();
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
