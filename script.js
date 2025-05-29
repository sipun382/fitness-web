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

// Main logic
document.addEventListener("DOMContentLoaded", () => {
    updateCalorieDisplay();

    // Attach event listeners to "Add" buttons
    document.querySelectorAll(".add-button").forEach(button => {
        button.addEventListener("click", (event) => {
            event.preventDefault();
            const calories = parseInt(button.dataset.calories);
            addCalories(calories);
        });
    });

    // Attach event listeners to "Remove" buttons
    document.querySelectorAll(".remove-button").forEach(button => {
        button.addEventListener("click", (event) => {
            event.preventDefault();
            const calories = parseInt(button.dataset.calories);
            removeCalories(calories);
        });
    });

    // Modal functionality for "Watch Video" or "Watch Recipe"
    const modal = document.getElementById("videoModal");
    const closeBtn = document.querySelector(".close");
    const iframe = document.querySelector("#modalVideo") || document.querySelector("#videoFrame");

    const videoButtons = document.querySelectorAll(".open-modal, .watch-button");

    videoButtons.forEach(button => {
        button.addEventListener("click", () => {
            const videoId = button.getAttribute("data-video");
            const videoUrl = videoId.includes("http")
                ? `${videoId}?autoplay=1`
                : `https://www.youtube.com/embed/${videoId}?autoplay=1`;

            iframe.src = videoUrl;
            modal.style.display = "flex";
            setTimeout(() => {
                modal.style.opacity = "1";
                modal.style.visibility = "visible";
            }, 10);
        });
    });

    function closeModal() {
        iframe.src = "";
        modal.style.opacity = "0";
        modal.style.visibility = "hidden";
        setTimeout(() => {
            modal.style.display = "none";
        }, 300);
    }

    if (closeBtn) closeBtn.addEventListener("click", closeModal);
    if (modal) modal.addEventListener("click", (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });
});
