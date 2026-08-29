import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js";

import { Bar } from "react-chartjs-2";

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

function PerformanceChart({ performance }) {

    const data = {
        labels: ["Execution Time"],

        datasets: [
            {
                label: "Sequential",
                data: [
                    performance.sequentialTime
                ],
            },

            {
                label: "Concurrent",
                data: [
                    performance.concurrentTime
                ],
            },
        ],
    };


    const options = {
        responsive: true,

        plugins: {

            legend: {
                position: "top",
            },

            title: {
                display: true,
                text: "Sequential vs Concurrent Execution",
            },

        },

        scales: {

            y: {

                beginAtZero: true,

                title: {
                    display: true,
                    text: "Time (seconds)",
                },

            },

        },
    };


    return (

        <div className="chart-container">

            <Bar
                data={data}
                options={options}
            />

        </div>

    );
}

export default PerformanceChart;