// Select the calorie display container
const totalCaloriesDisplay = document.getElementById("total-calories");

// Retrieve stored calories from localStorage or initialize to 0
let totalCalories = parseInt(localStorage.getItem("totalCalories")) || 0;

// Function to update the displayed total calories
function updateCalorieDisplay() {
    totalCaloriesDisplay.textContent = `Total Calories: ${totalCalories}`;
}

// Function to add calories
function addCalories(calories) {
    totalCalories += calories;
    localStorage.setItem("totalCalories", totalCalories);
    updateCalorieDisplay();
}

// Function to remove calories
function removeCalories(calories) {
    totalCalories = Math.max(0, totalCalories - calories);
    localStorage.setItem("totalCalories", totalCalories);
    updateCalorieDisplay();
}

// Initialize display on page load
document.addEventListener("DOMContentLoaded", () => {
    updateCalorieDisplay();

    // Attach event listeners to all "Add" and "Remove" buttons
    document.querySelectorAll(".add-button").forEach(button => {
        button.addEventListener("click", (event) => {
            event.preventDefault(); // Prevent any default action
            const calories = parseInt(button.dataset.calories);
            addCalories(calories);
        });
    });

    document.querySelectorAll(".remove-button").forEach(button => {
        button.addEventListener("click", (event) => {
            event.preventDefault(); // Prevent any default action
            const calories = parseInt(button.dataset.calories);
            removeCalories(calories);
        });
    });
});

document.addEventListener("DOMContentLoaded", () => {
    const modal = document.getElementById("video-modal");
    const closeBtn = document.querySelector(".close-btn");
    const youtubeIframe = document.getElementById("youtube-video");
    const watchBtn = document.getElementById("watch-video-btn");

    // Replace with your desired YouTube video URL
    const videoUrl = "https://www.youtube.com/embed/dQw4w9WgXcQ";

    watchBtn.addEventListener("click", () => {
        youtubeIframe.src = videoUrl + "?autoplay=1";
        modal.style.display = "block";
    });

    closeBtn.addEventListener("click", () => {
        youtubeIframe.src = "";
        modal.style.display = "none";
    });

    window.addEventListener("click", (event) => {
        if (event.target == modal) {
            youtubeIframe.src = "";
            modal.style.display = "none";
        }
    });
});




  