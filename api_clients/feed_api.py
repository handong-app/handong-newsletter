import requests,json,os

from config import API_FEED_URL
from config import TEST_RUN

class FeedAPIClient:
    def __init__(self, api_key: str):
        self.api_key = api_key
        self.base_url = API_FEED_URL

    def get_top(self):
        try:
          if TEST_RUN and not API_FEED_URL:
              print("DUMMY DATA")
              base_path = os.path.dirname(__file__)
              json_path = os.path.join(base_path, "feed_api.json")

              with open(json_path, "r", encoding="utf-8") as f:
                  data = json.load(f)
                  return data
          else:
            return self.get_top_data()
        except Exception as e:
          print("Error: ", e)
          return []
    
    def get_top_data(self):
        url = f"{self.base_url}"
        params = {
            "apiKey": self.api_key,
        }

        response = requests.get(url, params=params)
        response.raise_for_status()
        return response.json()