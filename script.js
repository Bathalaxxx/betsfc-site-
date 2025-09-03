// Function to load prediction data
async function loadPredictions() {
    try {
        const response = await fetch('data/predictions.json');
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error loading predictions:', error);
        return null;
    }
}

// Function to display current predictions
function displayCurrentPredictions(predictions) {
    const container = document.getElementById('current-predictions-container');
    
    if (!predictions || !predictions.current || predictions.current.length === 0) {
        container.innerHTML = '<p>No current predictions available.</p>';
        return;
    }
    
    let html = '';
    predictions.current.forEach(match => {
        const predictionClass = `prediction-${match.prediction}`;
        const predictionText = match.prediction === '1' ? 'Home Win' : 
                             match.prediction === '2' ? 'Away Win' : 'Draw';
        
        html += `
            <div class="prediction-card">
                <div class="match-title">${match.match}</div>
                <div>Date: ${new Date(match.date).toLocaleString()}</div>
                <div class="prediction">
                    <span class="prediction-badge ${predictionClass}">${match.prediction}</span>
                    <span>Prediction: ${predictionText}</span>
                </div>
            </div>
        `;
    });
    
    container.innerHTML = html;
    
    // Update last updated date
    if (predictions.lastUpdated) {
        document.getElementById('last-updated-date').textContent = 
            new Date(predictions.lastUpdated).toLocaleString();
    }
}

// Function to display previous results
function displayPreviousResults(predictions, selectedDate = null) {
    const container = document.getElementById('previous-results-container');
    
    if (!predictions || !predictions.previous || predictions.previous.length === 0) {
        container.innerHTML = '<p>No previous results available.</p>';
        return;
    }
    
    // Filter by date if selected
    let filteredResults = predictions.previous;
    if (selectedDate) {
        filteredResults = predictions.previous.filter(item => item.date.startsWith(selectedDate));
    }
    
    if (filteredResults.length === 0) {
        container.innerHTML = '<p>No results available for the selected date.</p>';
        return;
    }
    
    let html = '';
    filteredResults.forEach(match => {
        const predictionClass = `prediction-${match.prediction}`;
        const resultClass = match.actualResult ? 
            `prediction-${match.actualResult}` : '';
        const predictionText = match.prediction === '1' ? 'Home Win' : 
                             match.prediction === '2' ? 'Away Win' : 'Draw';
        const resultText = match.actualResult === '1' ? 'Home Win' : 
                         match.actualResult === '2' ? 'Away Win' : 
                         match.actualResult === 'x' ? 'Draw' : 'Not played yet';
        
        html += `
            <div class="prediction-card">
                <div class="match-title">${match.match}</div>
                <div>Date: ${new Date(match.date).toLocaleString()}</div>
                <div class="prediction">
                    <span class="prediction-badge ${predictionClass}">${match.prediction}</span>
                    <span>Prediction: ${predictionText}</span>
                </div>
                <div class="prediction">
                    <span class="prediction-badge ${resultClass}">${match.actualResult || '-'}</span>
                    <span>Actual Result: ${resultText}</span>
                </div>
            </div>
        `;
    });
    
    container.innerHTML = html;
}

// Function to populate date filter
function populateDateFilter(predictions) {
    const filter = document.getElementById('date-filter');
    
    if (!predictions || !predictions.previous) return;
    
    // Get unique dates
    const dates = [...new Set(predictions.previous.map(item => item.date.split('T')[0]))].sort().reverse();
    
    dates.forEach(date => {
        const option = document.createElement('option');
        option.value = date;
        option.textContent = new Date(date).toLocaleDateString();
        filter.appendChild(option);
    });
    
    // Add event listener
    filter.addEventListener('change', () => {
        displayPreviousResults(predictions, filter.value);
    });
}

// Tab functionality
document.querySelectorAll('.tab').forEach(tab => {
    tab.addEventListener('click', () => {
        // Remove active class from all tabs and content
        document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
        
        // Add active class to clicked tab and corresponding content
        tab.classList.add('active');
        document.getElementById(`${tab.dataset.tab}-${tab.dataset.tab === 'current' ? 'predictions' : 'results'}`).classList.add('active');
    });
});

// Initialize the page
document.addEventListener('DOMContentLoaded', async () => {
    const predictions = await loadPredictions();
    
    if (predictions) {
        displayCurrentPredictions(predictions);
        populateDateFilter(predictions);
    } else {
        document.getElementById('current-predictions-container').innerHTML = 
            '<p>Failed to load predictions. Please try again later.</p>';
    }
});
