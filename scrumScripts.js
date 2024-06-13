document.addEventListener('DOMContentLoaded', function() {
    let sessions = []; // This will be loaded from your JSON
    let currentSessionIndex = 0;
    let timer = null;

    const startButton = document.getElementById('start-btn');
    const pauseButton = document.getElementById('pause-btn');
    const fastForwardButton = document.getElementById('fast-forward-btn');
    const countdownDisplay = document.getElementById('countdown');
    const sessionsTableBody = document.getElementById('sessions-table').getElementsByTagName('tbody')[0];
    const currentDescriptionDisplay = document.getElementById('currentDescription');


    // Fetch the JSON file and load it into the 'sessions' variable
    fetch('houseOfCard.json')
        .then(response => response.json())
        .then(data => {
            sessions = data.sessions;
            populateTable(sessions);
            updateActivityDisplay();
        })
        .catch(error => {
            console.error('Error loading the JSON file:', error);
        });

    // Function to populate the table with sessions
    function populateTable(sessions) {
        sessions.forEach((session, index) => {
            let row = sessionsTableBody.insertRow();
            let activityCell = row.insertCell(0);
            let durationCell = row.insertCell(1);
            // let descriptionCell = row.insertCell(2);

            activityCell.textContent = session.activity;
            durationCell.textContent = `${session.duration} minutes`;
            // descriptionCell.textContent = session.description || 'No description provided';

            // Assign a data attribute to each row for easy access
            row.setAttribute('data-session-index', index);
        });
    }

    // Function to update the display for the current activity
    function updateActivityDisplay() {
        const currentSession = sessions[currentSessionIndex];
        
        highlightCurrentSession();
        
        // Update the countdown display
        countdownDisplay.textContent = formatTime(currentSession.duration * 60); // Convert minutes to seconds
        
        // Render the current description HTML
        currentDescriptionDisplay.innerHTML = currentSession.description || 'No description provided.';
    }

    // Function to format the time into mm:ss format
    function formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
    }

    // Function to update the highlighting of the current session
    function highlightCurrentSession() {
        
        // First, remove highlight from all rows
        Array.from(sessionsTableBody.rows).forEach(row => row.classList.remove('table-success'));
        
        // Then, apply highlight to the current session
        let currentRow = sessionsTableBody.querySelector(`[data-session-index="${currentSessionIndex}"]`);
        if (currentRow) {
            currentRow.classList.add('table-success');
        }
        // currentDescriptionDisplay.textContent = currentSession.description || 'No description provided.';

    }

    // Function to start the timer
    function startTimer() {
        const session = sessions[currentSessionIndex];
        let timeRemaining = session.duration * 60; // Convert minutes to seconds

        timer = setInterval(function() {
            timeRemaining--;
            countdownDisplay.textContent = formatTime(timeRemaining);

            if (timeRemaining <= 0) {
                clearInterval(timer);
                if (currentSessionIndex < sessions.length - 1) {
                    currentSessionIndex++;
                    updateActivityDisplay();
                    startTimer();
                }
            }
        }, 1000);
    }

    // Event listeners for buttons
    startButton.addEventListener('click', function() {
        updateActivityDisplay();
        startTimer();
        startButton.disabled = true;
        pauseButton.disabled = false;
        fastForwardButton.disabled = false;
    });

    pauseButton.addEventListener('click', function() {
        clearInterval(timer);
        pauseButton.disabled = true;
        startButton.disabled = false;
    });

    fastForwardButton.addEventListener('click', function() {
        clearInterval(timer);
        if (currentSessionIndex < sessions.length - 1) {
            currentSessionIndex++;
            updateActivityDisplay();
            startTimer();
        }
    });
});
