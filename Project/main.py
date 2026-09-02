import csv
import time
from concurrent.futures import ThreadPoolExecutor
from website_monitor import check_website


def read_urls():
    urls = []

    with open("urls.txt", "r", encoding="utf-8") as file:
        for line in file:
            url = line.strip()

            if url and url not in urls:
                urls.append(url)

    return urls[:100]


def sequential_monitor(urls):
    start = time.time()

    results = []

    for url in urls:
        results.append(check_website(url))

    total_time = time.time() - start

    return results, total_time


def concurrent_monitor(urls):
    start = time.time()

    with ThreadPoolExecutor(max_workers=10) as executor:
        results = list(executor.map(check_website, urls))

    total_time = time.time() - start

    return results, total_time


def save_csv(results):
    fields = [
        "url",
        "status",
        "response_time",
        "availability",
        "ssl",
        "title",
        "error"
    ]

    with open(
        "website_report.csv",
        "w",
        newline="",
        encoding="utf-8"
    ) as file:

        writer = csv.DictWriter(
            file,
            fieldnames=fields
        )

        writer.writeheader()
        writer.writerows(results)


def main():

    urls = read_urls()

    if not urls:
        print("No URLs found in urls.txt")
        return

    print("Website Health Monitor")
    print("-" * 40)
    print("Total URLs:", len(urls))

    print("\nSequential monitoring...")

    sequential_results, sequential_time = sequential_monitor(urls)

    print("Sequential monitoring completed.")

    print("\nConcurrent monitoring...")

    concurrent_results, concurrent_time = concurrent_monitor(urls)

    print("Concurrent monitoring completed.")

    speedup = sequential_time / concurrent_time

    improvement = (
        (sequential_time - concurrent_time)
        / sequential_time
    ) * 100

    print("\nWebsite Results")
    print("-" * 80)

    for result in concurrent_results:
        print(
            result["url"],
            "| Status:",
            result["status"],
            "| Time:",
            result["response_time"],
            "ms",
            "|",
            result["availability"]
        )

    total = len(concurrent_results)

    up = sum(
        1
        for result in concurrent_results
        if result["availability"] == "UP"
    )

    down = total - up

    print("\nStatistics")
    print("-" * 40)
    print("Total Websites:", total)
    print("Available:", up)
    print("Unavailable:", down)

    print("\nPerformance")
    print("-" * 40)
    print(
        "Sequential Time:",
        round(sequential_time, 2),
        "seconds"
    )

    print(
        "Concurrent Time:",
        round(concurrent_time, 2),
        "seconds"
    )

    print("Speedup:", round(speedup, 2), "x")
    print("Improvement:", round(improvement, 2), "%")

    save_csv(concurrent_results)

    print("\nReport saved as website_report.csv")


if __name__ == "__main__":
    main()
