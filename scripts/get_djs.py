import json

import requests
from bs4 import BeautifulSoup


r = requests.get("https://www.db9radio.net/2Schedule.htm")
soup = BeautifulSoup(r.text, "html.parser")
table = soup.find("table")

day = None
data = {}

for tr in table.find_all("tr"):
    if not tr.has_attr("class"):
        day = tr.find("td").text.strip()
    else:
        if day not in data:
            data[day] = []
        tds = tr.find_all("td")
        time_start, time_end = [t.strip() for t in tds[0].text.split("-")]

        dj = {
            "timeStart": time_start,
            "timeEnd": time_end,
            "name": tds[1].text.strip(),
            "styles": tds[2].text.strip(),
        }

        data[day].append(dj)

print(json.dumps(data))
