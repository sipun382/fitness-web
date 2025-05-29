document.getElementById("advisor-form").addEventListener("submit", (e) => {
    e.preventDefault();

    const age = parseInt(document.getElementById("age").value);
    const weight = parseInt(document.getElementById("weight").value);
    const activityLevel = parseInt(document.getElementById("activity").value);

    if (isNaN(age) || isNaN(weight) || isNaN(activityLevel)) {
        alert("Please enter valid values for age, weight, and activity level.");
        return;
    }

    let waterIntake = weight * 30; 
    let tips = [];
    let motivationalMessage = "";

    if (age < 18) {
        waterIntake -= 300; 
        tips.push(
            "Carry a reusable water bottle to stay hydrated during school or activities.",
            "Drink water instead of sugary beverages like soda or energy drinks.",
            "Include fruits like oranges and watermelon, which are high in water content."
        );
        motivationalMessage = "Stay active and hydrated to grow healthy and strong!";
    } else if (age >= 50) {
        waterIntake -= 200; 
        tips.push(
            "Drink water regularly, even if you don't feel thirsty.",
            "Opt for herbal teas or soups to stay hydrated in a gentle way.",
            "Monitor your fluid intake, as older adults are more prone to dehydration."
        );
        motivationalMessage = "Hydration is key to staying energetic and maintaining health as you age!";
    } else {
        tips.push(
            "Start your day with a full glass of water to kickstart your metabolism.",
            "Keep a water bottle handy to sip throughout the day.",
            "Limit caffeine and alcohol, as they can dehydrate your body."
        );
        motivationalMessage = "A hydrated body is a healthy body! Keep it up!";
    }

    if (activityLevel === 2) {
        waterIntake += 500; 
        tips.push(
            "Drink water before, during, and after moderate workouts like walking or yoga.",
            "Avoid large gulps; sip water in small amounts during your activity."
        );
        motivationalMessage = "Moderate activity keeps you fit—stay hydrated to fuel your performance!";
    } else if (activityLevel === 3) {
        waterIntake += 1000; 
        tips.push(
            "Hydrate with water or electrolyte drinks during intense workouts.",
            "Replenish fluids immediately after high-intensity activities like running or gym sessions.",
            "Avoid dehydration by drinking water regularly, even on rest days."
        );
        motivationalMessage = "High-intensity activities demand extra hydration—stay ahead of the game!";
    }

    const recommendation = `Based on your age (${age} years), weight (${weight} kg), and activity level, you should drink approximately ${waterIntake} ml of water daily.`;
    document.getElementById("recommendation").innerText = recommendation;

    const tipsList = document.getElementById("hydration-tips");
    tipsList.innerHTML = ""; 
    tips.forEach((tip) => {
        const li = document.createElement("li");
        li.innerText = tip;
        tipsList.appendChild(li);
    });

    document.getElementById("motivational-message").innerText = motivationalMessage;

    document.getElementById("advice").style.display = "block";
});
