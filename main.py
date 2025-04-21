import requests
import json
import time

# === CONFIG ===

API_KEY = ""  # <-- Replace this with your actual API key
team_ids = ['4415ce44-0f24-11e2-8525-18a905767e44', '4416272f-0f24-11e2-8525-18a905767e44', 
            '44167db4-0f24-11e2-8525-18a905767e44', '441660ea-0f24-11e2-8525-18a905767e44',
              '4416ba1a-0f24-11e2-8525-18a905767e44', '441713b7-0f24-11e2-8525-18a905767e44', 
              '4415b0a7-0f24-11e2-8525-18a905767e44', '4417eede-0f24-11e2-8525-18a905767e44', 
              '44174b0c-0f24-11e2-8525-18a905767e44', '441862de-0f24-11e2-8525-18a905767e44', 
              '44159241-0f24-11e2-8525-18a905767e44', '44179d47-0f24-11e2-8525-18a905767e44', 
              '42376e1c-6da8-461e-9443-cfcf0a9fcc4d', '715a1dba-4e9f-4158-8346-3473b6e3557f', 
              '44182a9d-0f24-11e2-8525-18a905767e44', '441766b9-0f24-11e2-8525-18a905767e44', 
              '44180e55-0f24-11e2-8525-18a905767e44', '44151f7a-0f24-11e2-8525-18a905767e44', 
              '1fb48e65-9688-4084-8868-02173525c3e1', '4417d3cb-0f24-11e2-8525-18a905767e44', 
              '441730a9-0f24-11e2-8525-18a905767e44', '4415ea6c-0f24-11e2-8525-18a905767e44', 
              '4418464d-0f24-11e2-8525-18a905767e44', '4417b7d7-0f24-11e2-8525-18a905767e44', 
              '441643b7-0f24-11e2-8525-18a905767e44', '441781b9-0f24-11e2-8525-18a905767e44', 
              '44169bb9-0f24-11e2-8525-18a905767e44', '4416d559-0f24-11e2-8525-18a905767e44', 
              '4416f5e2-0f24-11e2-8525-18a905767e44', '44155909-0f24-11e2-8525-18a905767e44', 
              '44157522-0f24-11e2-8525-18a905767e44', '4416091c-0f24-11e2-8525-18a905767e44']

BASE_URL = "https://api.sportradar.com/nhl/trial/v7/en"

def get_depth_chart(team_id):
    url = f"{BASE_URL}/teams/{team_id}/depth_chart.json?api_key={API_KEY}"
    response = requests.get(url)

    # Debug info
    print(f"Status Code: {response.status_code}")
    
    try:
        return response.json()
    except requests.exceptions.JSONDecodeError:
        print("❌ Error: Response is not valid JSON. Check API key, rate limit, or endpoint.")
        return None

def extract_data(data):
    arr = []

    team = f'{data["market"]} {data["name"]}'
    # alias = data["alias"]
    arr.append(team)
    positions = data["positions"]

    for type in positions:
        pos = positions[type]["name"]
        players = positions[type]["players"]

        for player in players:
            try:
                jersey_number = player["jersey_number"]
            except KeyError:
                jersey_number = None  # or "" or 0, depending on how you want to handle it

            player_json = {
                    "id": player["id"],
                    "jersey_number": jersey_number
            }

            arr.append(player_json)
    
    return arr


def get_player_data(id, team):
    url = f"https://api.sportradar.com/nhl/trial/v7/en/players/{id}/profile.json?api_key={API_KEY}"

    headers = {"accept": "application/json"}

    response = requests.get(url, headers=headers)

    # Load JSON and pretty-print
    if response.status_code == 200:
        data = response.json()
        birth_place = data["birth_place"]
        nationality = birth_place.split(",")[-1].strip()


        player_info = {
            "name": data["full_name"],
            "team": team,
            "position": data["primary_position"],
            "height": data["height"],
            "weight": data["weight"],
            # "experience": data["experience"],
            "handedness": data["handedness"],
            "birthdate": data["birthdate"],
            "nationality": nationality
        }
        
        return player_info
    
def main():
    global index
    arr_players = []
    correct = 0
    null_players = 0
    #run code for index = 8 @ 10:40 AM Thursday, April 17th
    #6, #5

    TEAM_ID = team_ids[index]

    depth_data = get_depth_chart(TEAM_ID)

    arr = extract_data(depth_data)

    team = arr[0]
    print(team)

    time.sleep(2)


    for i in range(1, len(arr)):
        player_json = get_player_data(arr[i]["id"], team)
        print(i)
        if player_json != None:
            arr_players.append(player_json)
            correct += 1
        else:
            print("NULL")
            null_players += 1
        # print(json.dumps(player_json, indent=4))  # <-- pretty print with 4 spaces
        time.sleep(1.2)
    
    print("\n")

    print("Null: ", null_players, " Player: ", correct)
        

    with open(f"Teams/{team}.json", "w", encoding="utf-8") as f:
        json.dump(arr_players, f, ensure_ascii=False, indent=4)
    
    index += 1

    return True



if __name__ == "__main__":
    index = 0
    run = True
    while run:
        run = main()
    
    


    
    

