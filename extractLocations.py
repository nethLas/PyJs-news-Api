
import json
import sys
import nltk
import spacy
 
import locationtagger
 
# initializing sample text
sample_text=sys.argv[1]
# extracting entities.
place_entity = locationtagger.find_locations(text = sample_text)

# getting all countries
# print("The countries in text : ")
# print(place_entity.countries)
 
# # getting all states
# print("The states in text : ")
# print(place_entity.regions)
 
# # getting all cities
# print("The cities in text : ")
# print(place_entity.cities)
# print("The countries regions in text : ")
# print(place_entity.country_regions)


 
# # getting all country cities
# print("The countries cities in text : ")
# print(place_entity.country_cities)
country_cities=place_entity.country_cities
citiesList=[]
newList=[]
for country,cities in country_cities.items():
    for city in cities:
        if(not city in citiesList):
            edition=f'{city}, {country}'
            newList.append(edition)
        citiesList.append(city)
# print('nicely formatted')
# # getting all other countries
# print("All other countries in text : ")
# print(place_entity.other_countries)
 
# # getting all region cities
# print("The region cities in text : ")
# print(place_entity.region_cities)
region_cities_List=[]
region_cities=place_entity.region_cities
for region,cities in region_cities.items():
    for city in cities:
        if(not city in region_cities_List):
            edition=f'{city}, {region}'
            newList.append(edition)
        region_cities_List.append(city)
print(json.dumps(newList)) 

# # getting all other regions
# print("All other regions in text : ")
# print(place_entity.other_regions)
 
# # getting all other entities //not useful
# print("All other entities in text : ")
# print(place_entity.other)