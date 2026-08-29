import { useState } from "react";
import axios from "axios";
import "./App.css";
import PerformanceChart from "./PerformanceChart";

function App() {
    const [urls, setUrls] = useState(
        "https://google.com\nhttps://github.com\nhttps://example.com"
    );

    const [results, setResults] = useState([]);
    const [performance, setPerformance] = useState(null);
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(false);


    // =====================================
    // MONITOR WEBSITES
    // =====================================

    const monitorWebsites = async () => {

        const urlList = urls
            .split("\n")
            .map((url) => url.trim())
            .filter((url) => url !== "");


        // No URL
        if (urlList.length === 0) {
            alert("Please enter at least one URL");
            return;
        }


        // Maximum 100 URLs
        if (urlList.length > 100) {
            alert("Maximum 100 websites allowed");
            return;
        }


        setLoading(true);


        try {

            const response = await axios.post(
                "http://localhost:5000/api/monitor",
                {
                    urls: urlList,
                }
            );


            const data = response.data;


            // Website results
            setResults(data.results);


            // Performance results
            setPerformance({
                sequentialTime: data.sequentialTime,
                concurrentTime: data.concurrentTime,
                speedup: data.speedup,
                improvement: data.improvement,
            });


        } catch (error) {

            console.error(error);


            alert(
                error.response?.data?.message ||
                "Could not connect to backend"
            );

        } finally {

            setLoading(false);

        }
    };


    // =====================================
    // LOAD MONITORING HISTORY
    // =====================================

    const loadHistory = async () => {

        try {

            const response = await axios.get(
                "http://localhost:5000/api/history"
            );


            setHistory(response.data);


        } catch (error) {

            console.error(error);

            alert("Could not load monitoring history");

        }
    };


    // =====================================
    // DOWNLOAD CSV REPORT
    // =====================================

    const downloadReport = async () => {

        try {

            const response = await axios.get(
                "http://localhost:5000/api/report",
                {
                    responseType: "blob",
                }
            );


            const url = window.URL.createObjectURL(
                new Blob([response.data])
            );


            const link = document.createElement("a");


            link.href = url;

            link.download =
                "website-monitor-report.csv";


            document.body.appendChild(link);


            link.click();


            link.remove();


            window.URL.revokeObjectURL(url);


        } catch (error) {

            console.error(error);

            alert("Could not download report");

        }
    };


    // =====================================
    // STATISTICS
    // =====================================

    const totalWebsites = results.length;


    const upWebsites = results.filter(
        (website) =>
            website.availability === "UP"
    ).length;


    const downWebsites = results.filter(
        (website) =>
            website.availability === "DOWN"
    ).length;


    const averageResponseTime =
        results.length > 0
            ? (
                results.reduce(
                    (sum, website) =>
                        sum +
                        (website.responseTime || 0),
                    0
                ) / results.length
            ).toFixed(2)
            : 0;


    // =====================================
    // UI
    // =====================================

    return (

        <div className="container">


            {/* =================================
                HEADER
            ================================= */}

            <header>

                <h1>
                    Website Health Monitor
                </h1>


                <p>
                    Concurrent monitoring system
                    for website availability
                    and performance
                </p>

            </header>



            {/* =================================
                URL INPUT
            ================================= */}

            <section className="input-section">

                <h2>
                    Monitor Websites
                </h2>


                <p className="help-text">

                    Enter one website URL per line.
                    Maximum 100 websites.

                </p>


                <textarea
                    value={urls}
                    onChange={(e) =>
                        setUrls(e.target.value)
                    }
                    placeholder="https://example.com"
                    rows="8"
                />


                <div className="button-group">


                    {/* Monitor */}

                    <button
                        onClick={monitorWebsites}
                        disabled={loading}
                    >

                        {loading
                            ? "Checking Websites..."
                            : "Start Monitoring"}

                    </button>



                    {/* History */}

                    <button
                        onClick={loadHistory}
                        className="history-button"
                    >

                        Load History

                    </button>



                    {/* CSV */}

                    <button
                        onClick={downloadReport}
                        className="history-button"
                    >

                        Download CSV Report

                    </button>


                </div>

            </section>



            {/* =================================
                OVERVIEW
            ================================= */}

            {results.length > 0 && (

                <section>

                    <h2>
                        Overview
                    </h2>


                    <div className="stats-grid">


                        {/* Total */}

                        <div className="stat-card">

                            <h3>
                                Total Websites
                            </h3>

                            <strong>
                                {totalWebsites}
                            </strong>

                        </div>



                        {/* UP */}

                        <div className="stat-card">

                            <h3>
                                Available
                            </h3>

                            <strong>
                                {upWebsites}
                            </strong>

                        </div>



                        {/* DOWN */}

                        <div className="stat-card">

                            <h3>
                                Unavailable
                            </h3>

                            <strong>
                                {downWebsites}
                            </strong>

                        </div>



                        {/* Average */}

                        <div className="stat-card">

                            <h3>
                                Avg Response
                            </h3>

                            <strong>
                                {averageResponseTime} ms
                            </strong>

                        </div>


                    </div>

                </section>

            )}



            {/* =================================
                PERFORMANCE
            ================================= */}

            {performance && (

                <section>

                    <h2>
                        Sequential vs Concurrent
                    </h2>


                    <div className="performance-grid">


                        {/* Sequential */}

                        <div className="performance-card">

                            <span>
                                Sequential
                            </span>

                            <strong>
                                {performance.sequentialTime}s
                            </strong>

                        </div>



                        {/* Concurrent */}

                        <div className="performance-card">

                            <span>
                                Concurrent
                            </span>

                            <strong>
                                {performance.concurrentTime}s
                            </strong>

                        </div>



                        {/* Speedup */}

                        <div className="performance-card">

                            <span>
                                Speedup
                            </span>

                            <strong>
                                {performance.speedup}x
                            </strong>

                        </div>



                        {/* Improvement */}

                        <div className="performance-card">

                            <span>
                                Improvement
                            </span>

                            <strong>
                                {performance.improvement}%
                            </strong>

                        </div>


                    </div>



                    {/* =================================
                        PERFORMANCE CHART
                    ================================= */}

                    <PerformanceChart
                        performance={performance}
                    />


                </section>

            )}



            {/* =================================
                WEBSITE RESULTS
            ================================= */}

            {results.length > 0 && (

                <section className="results">

                    <h2>
                        Website Results
                    </h2>


                    <div className="table-container">

                        <table>


                            <thead>

                                <tr>

                                    <th>
                                        #
                                    </th>

                                    <th>
                                        Website
                                    </th>

                                    <th>
                                        HTTP Status
                                    </th>

                                    <th>
                                        Response Time
                                    </th>

                                    <th>
                                        Availability
                                    </th>

                                    <th>
                                        SSL
                                    </th>

                                    <th>
                                        Page Title
                                    </th>

                                </tr>

                            </thead>



                            <tbody>

                                {results.map(
                                    (website, index) => (

                                        <tr
                                            key={index}
                                        >


                                            {/* Number */}

                                            <td>
                                                {index + 1}
                                            </td>



                                            {/* URL */}

                                            <td className="url">

                                                {website.url}

                                            </td>



                                            {/* HTTP */}

                                            <td>

                                                {website.status ||
                                                    "-"}

                                            </td>



                                            {/* Response */}

                                            <td>

                                                {
                                                    website.responseTime
                                                }{" "}
                                                ms

                                            </td>



                                            {/* Availability */}

                                            <td>

                                                <span
                                                    className={
                                                        website.availability ===
                                                        "UP"
                                                            ? "status up"
                                                            : "status down"
                                                    }
                                                >

                                                    {
                                                        website.availability
                                                    }

                                                </span>

                                            </td>



                                            {/* SSL */}

                                            <td>

                                                {
                                                    website.ssl
                                                }

                                            </td>



                                            {/* Title */}

                                            <td>

                                                {
                                                    website.title
                                                }

                                            </td>


                                        </tr>

                                    )
                                )}

                            </tbody>

                        </table>

                    </div>

                </section>

            )}



            {/* =================================
                MONITORING HISTORY
            ================================= */}

            {history.length > 0 && (

                <section className="results">

                    <h2>
                        Monitoring History
                    </h2>


                    <div className="table-container">

                        <table>


                            <thead>

                                <tr>

                                    <th>
                                        Run
                                    </th>

                                    <th>
                                        Date
                                    </th>

                                    <th>
                                        Websites
                                    </th>

                                    <th>
                                        Sequential
                                    </th>

                                    <th>
                                        Concurrent
                                    </th>

                                    <th>
                                        Speedup
                                    </th>

                                    <th>
                                        Improvement
                                    </th>

                                </tr>

                            </thead>



                            <tbody>

                                {history.map(
                                    (run) => (

                                        <tr
                                            key={run.id}
                                        >


                                            <td>

                                                #{run.id}

                                            </td>



                                            <td>

                                                {new Date(
                                                    run.created_at
                                                ).toLocaleString()}

                                            </td>



                                            <td>

                                                {
                                                    run.website_count
                                                }

                                            </td>



                                            <td>

                                                {
                                                    run.sequential_time
                                                }s

                                            </td>



                                            <td>

                                                {
                                                    run.concurrent_time
                                                }s

                                            </td>



                                            <td>

                                                {
                                                    run.speedup
                                                }x

                                            </td>



                                            <td>

                                                {
                                                    run.improvement
                                                }%

                                            </td>


                                        </tr>

                                    )
                                )}

                            </tbody>

                        </table>

                    </div>

                </section>

            )}


        </div>

    );
}


export default App;