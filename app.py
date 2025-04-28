from flask import Flask, render_template, jsonify
import random

app = Flask(__name__)

# Step 1: Read the names from the file
file_path = 'Public Name Information.txt'

# Initialize a list to hold the names
names = []

# Read data from the file
with open(file_path, 'r') as file:
    for line in file:
        # Split line and get the name (ignoring the ID part)
        parts = line.split(' ')
        name = " ".join(parts[1:])  # Join the name after the first part (the code)
        names.append(name.strip())

# Step 2: Function to format the name as "First Last" for LinkedIn URL
def format_linkedin_name(name):
    # Assume names in format "Last, First Middle"
    try:
        last_name, first_middle_name = name.split(',', 1)
        first_middle_name = first_middle_name.strip()
        first_last = first_middle_name.split()
        first_name = first_last[0]
        last_name = last_name.strip()
        # Join first and last for LinkedIn URL
        return f"{first_name}{last_name}"
    except Exception as e:
        print(f"Error formatting name '{name}': {e}")
        return name.replace(' ', '').lower()  # Fallback for unexpected formats

# Step 3: Mock function to return a LinkedIn profile
def get_random_linkedin_profile():
    # Pick a random name
    random_name = random.choice(names)
    
    # Format the name for LinkedIn URL
    linkedin_name = format_linkedin_name(random_name)
    
    # For the mock, let's generate a mock LinkedIn profile
    # In real scenarios, you would fetch this from LinkedIn (API or scraping)
    profile = {
        "name": random_name,
        "headline": "Software Engineer at ExampleCorp",
        "linkedinLink": f"https://www.linkedin.com/in/{linkedin_name.lower()}",
        "image": "https://randomuser.me/api/portraits/men/1.jpg"  # Placeholder image
    }
    
    return profile

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/fetch-linkedin')
def fetch_linkedin():
    profile = get_random_linkedin_profile()
    return jsonify(profile)

if __name__ == '__main__':
    app.run(debug=True)
