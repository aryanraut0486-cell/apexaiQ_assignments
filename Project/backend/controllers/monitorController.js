const { Parser } = require("json2csv");

const pool = require("../config/db");

const {
    sequentialMonitor,
    concurrentMonitor
} = require("../services/websiteMonitor");


// ==========================================
// MONITOR WEBSITES
// ==========================================

async function monitorWebsites(req, res) {
    try {
        const { urls } = req.body;

        // Validate input
        if (!Array.isArray(urls)) {
            return res.status(400).json({
                message: "urls must be an array"
            });
        }

        if (urls.length === 0) {
            return res.status(400).json({
                message: "At least one URL is required"
            });
        }

        if (urls.length > 100) {
            return res.status(400).json({
                message: "Maximum 100 websites allowed"
            });
        }

        // Remove duplicates and empty URLs
        const cleanUrls = [
            ...new Set(
                urls
                    .map(url => url.trim())
                    .filter(url => url.length > 0)
            )
        ];

        console.log("Starting sequential monitoring...");

        const sequential =
            await sequentialMonitor(cleanUrls);

        console.log("Sequential monitoring completed");

        console.log("Starting concurrent monitoring...");

        const concurrent =
            await concurrentMonitor(cleanUrls);

        console.log("Concurrent monitoring completed");


        // ==========================================
        // PERFORMANCE CALCULATION
        // ==========================================

        const sequentialTime =
            sequential.totalTime;

        const concurrentTime =
            concurrent.totalTime;

        const speedup =
            concurrentTime > 0
                ? sequentialTime / concurrentTime
                : 0;

        const improvement =
            sequentialTime > 0
                ? (
                    (sequentialTime - concurrentTime)
                    / sequentialTime
                ) * 100
                : 0;


        // ==========================================
        // SAVE MONITORING RUN
        // ==========================================

        const [runResult] =
            await pool.execute(
                `INSERT INTO monitoring_runs
                (
                    sequential_time,
                    concurrent_time,
                    speedup,
                    improvement
                )
                VALUES (?, ?, ?, ?)`,
                [
                    sequentialTime,
                    concurrentTime,
                    speedup,
                    improvement
                ]
            );

        const runId =
            runResult.insertId;


        // ==========================================
        // SAVE INDIVIDUAL RESULTS
        // ==========================================

        for (const result of concurrent.results) {

            const [existing] =
                await pool.execute(
                    `SELECT id
                     FROM websites
                     WHERE url = ?`,
                    [result.url]
                );

            let websiteId;

            if (existing.length > 0) {

                websiteId =
                    existing[0].id;

            } else {

                const [inserted] =
                    await pool.execute(
                        `INSERT INTO websites (url)
                         VALUES (?)`,
                        [result.url]
                    );

                websiteId =
                    inserted.insertId;
            }


            await pool.execute(
                `INSERT INTO monitoring_results
                (
                    run_id,
                    website_id,
                    http_status,
                    response_time,
                    availability,
                    ssl_status,
                    page_title,
                    error_message
                )
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
                [
                    runId,
                    websiteId,
                    result.status,
                    result.responseTime,
                    result.availability,
                    result.ssl,
                    result.title,
                    result.error
                ]
            );
        }


        // ==========================================
        // SEND RESPONSE TO REACT
        // ==========================================

        res.json({
            success: true,

            runId: runId,

            sequentialTime:
                Number(sequentialTime.toFixed(2)),

            concurrentTime:
                Number(concurrentTime.toFixed(2)),

            speedup:
                Number(speedup.toFixed(2)),

            improvement:
                Number(improvement.toFixed(2)),

            results:
                concurrent.results
        });

    } catch (error) {

        console.error(
            "Monitoring error:",
            error
        );

        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
}


// ==========================================
// GET MONITORING HISTORY
// ==========================================

async function getHistory(req, res) {

    try {

        const [rows] =
            await pool.execute(
                `SELECT
                    mr.id,
                    mr.sequential_time,
                    mr.concurrent_time,
                    mr.speedup,
                    mr.improvement,
                    mr.created_at,
                    COUNT(mres.id) AS website_count

                FROM monitoring_runs mr

                LEFT JOIN monitoring_results mres
                    ON mr.id = mres.run_id

                GROUP BY mr.id

                ORDER BY mr.created_at DESC`
            );

        res.json(rows);

    } catch (error) {

        console.error(
            "History error:",
            error
        );

        res.status(500).json({
            message: "Could not fetch history"
        });
    }
}


// ==========================================
// DOWNLOAD CSV REPORT
// ==========================================

async function downloadReport(req, res) {

    try {

        const [rows] =
            await pool.execute(
                `SELECT
                    r.id AS run_id,
                    r.created_at,
                    w.url,
                    mr.http_status,
                    mr.response_time,
                    mr.availability,
                    mr.ssl_status,
                    mr.page_title,
                    mr.error_message

                FROM monitoring_results mr

                JOIN websites w
                    ON mr.website_id = w.id

                JOIN monitoring_runs r
                    ON mr.run_id = r.id

                ORDER BY
                    r.id DESC,
                    mr.id ASC`
            );


        // CSV fields

        const fields = [
            "run_id",
            "created_at",
            "url",
            "http_status",
            "response_time",
            "availability",
            "ssl_status",
            "page_title",
            "error_message"
        ];


        // Convert database rows to CSV

        const parser =
            new Parser({
                fields
            });

        const csv =
            parser.parse(rows);


        // Send CSV file

        res.setHeader(
            "Content-Type",
            "text/csv"
        );

        res.setHeader(
            "Content-Disposition",
            "attachment; filename=website-monitor-report.csv"
        );

        res.send(csv);

    } catch (error) {

        console.error(
            "CSV Report Error:",
            error
        );

        res.status(500).json({
            message: "Could not generate report",
            error: error.message
        });
    }
}


// ==========================================
// EXPORT CONTROLLERS
// ==========================================

module.exports = {

    monitorWebsites,

    getHistory,

    downloadReport

};