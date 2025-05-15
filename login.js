document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.querySelector(".login-form");

  loginForm.addEventListener("submit", (event) => {
      event.preventDefault();

      const email = document.getElementById("login-email").value;
      const password = document.getElementById("login-password").value;

      if (!email || !password) {
          alert("Please fill in both fields");
          return;
      }

      fetch('/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password })
      })
      .then(response => response.json())
      .then(data => {
          if (data.success) {
              alert("Login successful!");
              window.location.href = "dashboard.html";  // Redirect only if successful
          } else {
              alert("Invalid email or password. Please try again.");  // Stay on the same page
          }
      })
      .catch(error => {
          console.error('Login Error:', error);
          alert("Error logging in. Please try again.");
      });
  });
});
