import requests
import time
import ssl
import socket
from bs4 import BeautifulSoup


def check_website(url):
    start = time.time()

    try:
        response = requests.get(url, timeout=10)

        response_time = (time.time() - start) * 1000

        if response.status_code < 400:
            availability = "UP"
        else:
            availability = "DOWN"

        title = "-"

        try:
            soup = BeautifulSoup(response.text, "html.parser")

            if soup.title:
                title = soup.title.string.strip()
        except:
            pass

        if url.startswith("https://"):
            try:
                host = url.split("//")[1].split("/")[0]

                context = ssl.create_default_context()

                with socket.create_connection(
                    (host, 443), timeout=5
                ) as sock:

                    with context.wrap_socket(
                        sock,
                        server_hostname=host
                    ):
                        ssl_status = "Valid"

            except:
                ssl_status = "Invalid"
        else:
            ssl_status = "N/A"

        return {
            "url": url,
            "status": response.status_code,
            "response_time": round(response_time, 2),
            "availability": availability,
            "ssl": ssl_status,
            "title": title,
            "error": ""
        }

    except Exception as e:
        return {
            "url": url,
            "status": "-",
            "response_time": 0,
            "availability": "DOWN",
            "ssl": "N/A",
            "title": "-",
            "error": str(e)
        }
    o1= show()
    o1.show()