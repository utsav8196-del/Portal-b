const express = require("express");

const router = express.Router();

const materials = [
  "Sand",
  "Aggregate",
  "Cement",
  "Steel",
  "Fabrication",
  "Hardware",
  "Bricks",
  "Stone",
  "Tiles",
  "Granite",
  "Electric",
  "Plumbing",
  "Plywood",
  "Paint",
];

const machinery = ["JCB", "Tractor"];

router.get("/home", (req, res) => {
  res.json({
    success: true,
    data: {
      totalProjects: 12,
      totalWorkers: 84,
      progress: 68,
    },
  });
});

router.get("/projects", (req, res) => {
  res.json({ success: true, data: { title: "Projects" } });
});

router.get("/material", (req, res) => {
  res.json({ success: true, data: materials });
});

router.get("/labour", (req, res) => {
  res.json({ success: true, data: { title: "Labour" } });
});

router.get("/machinery", (req, res) => {
  res.json({ success: true, data: machinery });
});

router.get("/settings", (req, res) => {
  res.json({ success: true, data: { title: "Settings" } });
});

module.exports = router;
