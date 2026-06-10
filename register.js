function register() {
  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const password = document.getElementById("password").value.trim();
  const confirmPassword = document.getElementById("confirmPassword").value.trim();
  const API = "https://appealing-spirit-production-8f7f.up.railway.app";

  if (!name || !email || !phone || !password) {
    alert("Please fill all fields");
    return;
  }

  if (password !== confirmPassword) {
    alert("Passwords do not match");
    return;
  }
  
  fetch("https://appealing-spirit-production-da94.up.railway.app/api/users/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ name, email, phone, password })
  })

  .then(res => res.json())
  .then(data => {
    console.log(data);

    if (data.message) {
      alert("Registration successful 🎉");
      window.location.href = "login.html";
    } else {
      alert("Registration failed");
    }
  })
  .catch(err => {
    console.log(err);
    alert("Server error");
  });
}