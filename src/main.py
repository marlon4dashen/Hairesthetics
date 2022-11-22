import googlemaps
import pandas as pd
import time
import openpyxl

def miles_to_meter(miles):
    try:
        return miles * 1_609.344
    except:
        return 0



# Press the green button in the gutter to run the script.
if __name__ == '__main__':
    API_KEY = open('API_KEY.txt', 'r').read()
    map_client = googlemaps.Client(API_KEY)

    #print(dir(map_client))
    loc = googlemaps.geolocate()
    print(loc)
    location = (43.8594059105088, -79.31981073115197)
    search_string = 'hair'
    distance = miles_to_meter(15)
    business_list = []

    response = map_client.places_nearby(
        location=location,
        keyword=search_string,
        name='hair salon',
        radius=distance
    )

    #print(response.keys())
    business_list.extend(response.get('results'))
    next_page_token = response.get('next_page_token')

    while next_page_token:
        time.sleep(2)
        response = map_client.places_nearby(
            location=location,
            keyword=search_string,
            name='hair salon',
            radius=distance,
            page_token=next_page_token
        )
        business_list.extend(response.get('results'))
        next_page_token = response.get('next_page_token')

    df = pd.DataFrame(business_list)
    df['url'] = 'https://www.google.com/maps/place/?q=place_id:' + df['place_id']
    df.to_excel('hair_salon.xlsx', index=False)

