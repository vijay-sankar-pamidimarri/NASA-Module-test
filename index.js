const API_KEY = 'vUt2vQOiisvdx4du4d5ufU6Vy3fRqkWk6oggXMt6';  // Replace with your API key from NASA
const apiBaseURL = 'https://api.nasa.gov/planetary/apod?api_key=' + API_KEY + '&date=';

const imageContainer = document.querySelector("#current-image-container");
const imageElement = document.querySelector("#image-of-day");
const titleElement = document.querySelector("#image-title");
const descElement = document.querySelector("#image-desc");
const searchForm = document.querySelector("#search-form");
const searchInput = document.querySelector("#search-input");
const searchHistoryList = document.querySelector("#search-history");

// Get the current date
const currentDate = new Date().toISOString().split("T")[0];

// Fetch and display the current image of the day when the page loads
document.addEventListener("DOMContentLoaded", () => {
    getCurrentImageOfTheDay();
    loadSearchHistory();
});

// Function to fetch and display the current image of the day
function getCurrentImageOfTheDay() {
    fetch(apiBaseURL + currentDate)
        .then(response => response.json())
        .then(data => {
            displayImage(data);
        })
        .catch(error => {
            console.error('Error fetching current image of the day:', error);
            alert('Failed to load current image of the day.');
        });
}

// Function to fetch and display the image of the day for the selected date
function getImageOfTheDay(date) {
    fetch(apiBaseURL + date)
        .then(response => response.json())
        .then(data => {
            displayImage(data);
            saveSearch(date);  // Save the search date
            addSearchToHistory(date);  // Add it to the search history UI
        })
        .catch(error => {
            console.error('Error fetching image of the day for the selected date:', error);
            alert('Failed to load image for this date.');
        });
}

// Function to display the image and details in the UI
function displayImage(data) {
    imageElement.src = data.url;
    titleElement.textContent = data.title;
    descElement.textContent = data.explanation;
}

// Function to save the search date to local storage
function saveSearch(date) {
    let searches = JSON.parse(localStorage.getItem("searches")) || [];
    if (!searches.includes(date)) {
        searches.push(date);
        localStorage.setItem("searches", JSON.stringify(searches));
    }
}

// Function to add the search date to the search history UI
function addSearchToHistory(date) {
    const li = document.createElement("li");
    li.textContent = date;
    li.onclick = function() {
        getImageOfTheDay(date);
    };
    searchHistoryList.appendChild(li);
}

// Function to load the search history from local storage
function loadSearchHistory() {
    const searches = JSON.parse(localStorage.getItem("searches")) || [];
    searches.forEach(date => {
        addSearchToHistory(date);
    });
}

// Handle form submission
searchForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const date = searchInput.value;
    getImageOfTheDay(date);
    searchInput.value = "";  // Reset the input field
});

