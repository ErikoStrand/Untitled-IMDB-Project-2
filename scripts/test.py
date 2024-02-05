import requests
import json
url = "https://eu-central-1.aws.data.mongodb-api.com/app/data-lmvpc/endpoint/data/v1/action/findOne"

payload = json.dumps({
    "collection": "episode_count",
    "database": "Untitled_Project",
    "dataSource": "UntitledProject",
    "projection": {
        "data": 1,
    }
})
headers = {
  'Content-Type': 'application/json',
  'Access-Control-Request-Headers': '*',
  'api-key': 'NcwcnlCSdGddzxaUsv3B4KJOpKfFjz0XdSok3xRNlyrMXL1Czib0oIzbSdmcGg6z',
}

response = requests.request("POST", url, headers=headers, data=payload)

print(response.text)