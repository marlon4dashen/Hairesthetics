import requests


class SalonRecommendation:
    
    def __init__(self, lat, lng, api_key):
        self._lat = lat
        self._lng = lng
        self._salons = []
        self._size = 0
        self._api_key = api_key
        self._total_average_ratings = 0
    
    def get_size(self):
        return self._size
    
    def get_nearby_salons(self):  
        results = self.__fetch_nearby_salons()
        for result in results:
            salon = dict()
            salon['name'] = result['name']
            salon['lat'] = result['geometry']['location']['lat']
            salon['lng'] = result['geometry']['location']['lng']
            salon['rating'] = result['rating']
            salon['user_ratings_total'] = result['user_ratings_total']
            self._total_average_ratings += result['rating']
            place_id = result['place_id']
            place_details = None
            try:
                place_details = self.__fetch_place_details(place_id)
            except Exception as e:
                print(e)
                continue
            salon['place_id'] = place_id        
            if place_details:
                salon['address'] = place_details.get("formatted_address", '')
                salon['website'] = place_details.get('website','')
            self._size += 1
            self._salons.append(salon)
        self.__rank_salons()
        return self._salons
    
    def __fetch_nearby_salons(self):
        nearby_search_api = f"https://maps.googleapis.com/maps/api/place/nearbysearch/json?location={self._lat}%2C{self._lng}&radius=1200&type=hair_care&keyword=salon&key={self._api_key}"
        payload={}
        headers = {}
        response = requests.request("GET", nearby_search_api, headers=headers, data=payload)
        results = response.json()['results']
        return results

    def __fetch_place_details(self, place_id):
        place_details_api = f"https://maps.googleapis.com/maps/api/place/details/json?place_id={place_id}&key={self._api_key}"
        place_details = None
        payload={}
        headers = {}
        response = requests.request("GET", place_details_api, headers=headers, data=payload)
        place_details = response.json()['result']
        return place_details

    def __rank_salons(self):
        self._salons = sorted(self._salons, key=lambda salon: self.__bayesian_average(salon['user_ratings_total'], salon['rating'], self._total_average_ratings, 25))
    
    def __bayesian_average(self, salon_ratings_count, salon_ratings_avg, total_avg_ratings_count, C):
        return (salon_ratings_count*salon_ratings_avg + total_avg_ratings_count*C) / (salon_ratings_count+C)