const express = require("express");

const router = express.Router();

const {
    monitorWebsites,
    getHistory,
    downloadReport
} = require("../controllers/monitorController");


router.post("/monitor", monitorWebsites);

router.get("/history", getHistory);

router.get("/report", downloadReport);


module.exports = router;