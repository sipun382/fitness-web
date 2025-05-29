document.addEventListener("DOMContentLoaded", function () {
    const form = document.querySelector("#registrationForm");
    const heightInput = document.querySelector("#height");
    const weightInput = document.querySelector("#weight");
    const bmiInput = document.querySelector("#bmi");
    //calculate BMI 
    function calculateBMI() {
        const height = parseFloat(heightInput.value) / 100;
        const weight = parseFloat(weightInput.value);

        if (height > 0 && weight > 0) {
            bmiInput.value = (weight / (height * height)).toFixed(2);
        } else {
            bmiInput.value = "";
        }
    }

    heightInput.addEventListener("input", calculateBMI);
    weightInput.addEventListener("input", calculateBMI);
    //email 
    form.addEventListener("submit", function (event) {
        event.preventDefault();

        const email = document.querySelector("#email").value;
        const allowedDomainsRegex = /^[^\s@]+@(gmail\.com|yahoo\.com|rediffmail\.com)$/i;

        if (!allowedDomainsRegex.test(email)) {
            alert("Email must be from gmail.com, yahoo.com, or rediffmail.com only.");
            return;
        }

        const formData = {
            name: document.querySelector("#name").value,
            email: email,
            phone: document.querySelector("#phone").value,
            age: document.querySelector("#age").value,
            gender: document.querySelector("#gender").value,
            height: heightInput.value,
            weight: weightInput.value,
            bmi: bmiInput.value,
            goal: document.querySelector("#goal").value,
            password: document.querySelector("#password").value,
        };

        console.log("Sending Data:", formData);
        
        fetch('/form', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData),
        })
        .then(response => response.json())
        .then(data => {
            console.log('Server Response:', data);

            if (data.error) {
                alert("Error: " + data.error);
            } else {
                alert("Registration successful! Please log in.");
                window.location.href = "login.html";
            }
        })
        .catch(error => {
            console.error('Fetch Error:', error);
            alert("Error registering user.");
        });
    });
});
