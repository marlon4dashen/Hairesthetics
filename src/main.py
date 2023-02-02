import googlemaps
import pandas as pd
import time
import openpyxl
import argparse


def miles_to_meter(miles):
    try:
        return miles * 1_609.344
    except:
        return 0


def find_nearby(API_KEY, distance, filter):
    map_client = googlemaps.Client(API_KEY)

    location = (43.8594059105088, -79.31981073115197)  # need to be used as real-time location of user
    search_string = 'hair'
    business_list = []

    response = map_client.places_nearby(
        location=location,
        keyword=search_string,
        name='hair salon',
        radius=distance
    )


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

    sort_by_rating = int(filter['sort_by_rating'])
    top_n_rating = sorted(response['results'], key = lambda x : ('rating' not in x, x.get('rating', None)),reverse = True)[0:sort_by_rating]

    return top_n_rating


def output_to_file(output_file_name, business_list):
    df = pd.DataFrame(business_list)
    df['url'] = 'https://www.google.com/maps/place/?q=place_id:' + df['place_id']
    df.to_excel(output_file_name, index=False)


def parse_args():
    """
    Get user command line parameters
    """
    parser = argparse.ArgumentParser(description="Available Options")

    parser.add_argument('-d', '--distance', dest='distance', default=False,
                        required=True, help="Enter the distance of businesses you want to search for")
    parser.add_argument('-r', '--sort_by_rating', dest='sort_by_rating', default=False,
                        required=True, help="Enter the number of businesses you want to search according to descending order of ratings")
    parser.add_argument('-n', '--sort_by_num_of_ratings', dest='sort_by_num_of_ratings', default=False,
                        required=False, help="Enter the number of businesses you want to search for")

    args = vars(parser.parse_args())

    # To Display The Command Line Arguments
    print("## Command Arguments #################################################")
    print("\n".join("{}:{}".format(i, j) for i, j in args.items()))
    print("######################################################################")

    return args


if __name__ == '__main__':
    args = parse_args()

    filter = {}

    if args['sort_by_rating']:
        sort_by_rating = args['sort_by_rating']
        filter['sort_by_rating'] = sort_by_rating

    if args['sort_by_num_of_ratings']:
        sort_by_num_of_ratings = args['sort_by_num_of_ratings']
        filter['sort_by_num_of_ratings'] = sort_by_num_of_ratings

    #set_filter()




    ######################################
    ######## find nearby business ########
    ######################################
    API_KEY = open('API_KEY.txt', 'r').read()
    if args['distance']:
        distance = miles_to_meter(int(args['distance']))

    business_list = find_nearby(API_KEY, distance, filter)



    ######################################
    ######## collect data in file ########
    ######################################
    output_file_name = 'hair_salon.xlsx'
    output_to_file(output_file_name, business_list)


