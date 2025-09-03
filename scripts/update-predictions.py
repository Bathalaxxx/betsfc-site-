#!/usr/bin/env python3
import json
import os
import sys
from datetime import datetime, timedelta

# Get the path to the data file
data_path = os.path.join(os.path.dirname(__file__), '..', 'data', 'predictions.json')

# Load existing data
try:
    with open(data_path, 'r') as f:
        data = json.load(f)
except FileNotFoundError:
    # Initialize data structure if file doesn't exist
    data = {
        "lastUpdated": datetime.utcnow().isoformat() + "Z",
        "current": [],
        "previous": []
    }

# Get prediction data from environment variable or manual input
prediction_data = os.environ.get('PREDICTION_DATA')
if not prediction_data:
    # For manual testing, you can set this or input data
    prediction_data = """Bolton vs AFC Wimbledon (2025-09-06 15:00 UTC)
Prediction: x (draw)

Huddersfield vs Peterborough (2025-09-06 15:00 UTC)
Prediction: 1 (Huddersfield win)

Greenock Morton vs Raith Rovers (2025-09-06 15:00 UTC)
Prediction: x (draw)"""

# Parse the prediction data
new_predictions = []
lines = prediction_data.strip().split('\n')
i = 0
while i < len(lines):
    if 'vs' in lines[i] and 'UTC' in lines[i]:
        # Parse match line
        match_line = lines[i]
        date_start = match_line.find('(')
        date_end = match_line.find(')')
        match_name = match_line[:date_start].strip()
        date_str = match_line[date_start+1:date_end].replace('UTC', '').strip()
        
        # Parse prediction line
        i += 1
        if i < len(lines) and lines[i].startswith('Prediction:'):
            prediction_line = lines[i]
            prediction = prediction_line.split(':')[1].strip().split(' ')[0]
            
            # Convert to ISO format
            try:
                date_obj = datetime.strptime(date_str, '%Y-%m-%d %H:%M')
                date_iso = date_obj.isoformat() + 'Z'
            except ValueError:
                date_iso = date_str + 'T00:00:00Z'
            
            new_predictions.append({
                "match": match_name,
                "date": date_iso,
                "prediction": prediction
            })
    i += 1

# Move yesterday's current predictions to previous (if they exist)
yesterday = (datetime.utcnow() - timedelta(days=1)).strftime('%Y-%m-%d')
if data.get('current'):
    # Archive current predictions
    for prediction in data['current']:
        prediction_date = prediction['date'].split('T')[0]
        if prediction_date < datetime.utcnow().strftime('%Y-%m-%d'):
            # Add to previous with empty actualResult (to be filled later)
            prediction['actualResult'] = ''
            data['previous'].append(prediction)
    
    # Keep only future predictions in current
    data['current'] = [p for p in data['current'] if p['date'].split('T')[0] >= datetime.utcnow().strftime('%Y-%m-%d')]

# Add new predictions to current
data['current'].extend(new_predictions)

# Update last updated timestamp
data['lastUpdated'] = datetime.utcnow().isoformat() + 'Z'

# Save the updated data
with open(data_path, 'w') as f:
    json.dump(data, f, indent=2)

print("Predictions updated successfully!")
