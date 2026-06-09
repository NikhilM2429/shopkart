function login() {
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  // 🔥 FRONTEND VALIDATION
  if (!email || !password) {
    alert("Please enter email and password");
    return;
  }

  // ✅ DEBUG
  console.log("Sending Login Request...");
  console.log("Email:", email);

  fetch("https://appealing-spirit-production-8f7f.up.railway.app/api/users/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ email, password })
  })
  .then(res => {
    console.log("Response Status:", res.status);
    return res.json();
  })
  .then(data => {
    console.log("LOGIN RESPONSE:", data);

    if (data.token) {
      alert("Login successful");

      // ✅ SAVE TOKEN + USER INFO
      localStorage.setItem("token", data.token);
      console.log("Token saved:", data.token);

      // Save user info for navbar
      if (data.user) {
        localStorage.setItem("user", JSON.stringify(data.user));
        console.log("User saved:", data.user);
      }

      // 🔥 REDIRECT TO HOME (FIXED PATH)
      console.log("Redirecting to home...");
      window.location.href = "../html/index.html";
    } else {
      alert(data.message || "Login failed");
    }
  })
  .catch(err => {
    console.log("ERROR:", err);
    alert("Server error");
  });
}

// ===================================
// UPDATE NAVBAR ON HOME PAGE
// ===================================
function updateLoginUI() {
  const loginBtn = document.getElementById('loginBtn');
  
  if (!loginBtn) return;

  const user = localStorage.getItem("user");
  const token = localStorage.getItem("token");

  if (user && token) {
    const userData = JSON.parse(user);
    const userName = userData.name || userData.email || "User";
    
    console.log("=== Updating Navbar ===");
    console.log("User:", userName);
    
    loginBtn.innerHTML = `<i class="ti ti-user"></i> Welcome, ${userName}`;
    loginBtn.classList.remove('btn-login');
    loginBtn.href = '#';
    loginBtn.style.cursor = 'pointer';

    loginBtn.onclick = function(e) {
      e.preventDefault();
      
      if (confirm('Are you sure you want to logout?')) {
        logout();
      }
    };
  } else {
    loginBtn.innerHTML = `<i class="ti ti-user"></i> Login`;
    loginBtn.classList.add('btn-login');
    loginBtn.href = '../html/login.html';
    loginBtn.style.cursor = 'pointer';
    loginBtn.onclick = null;
  }
}

// ===================================
// LOGOUT FUNCTION
// ===================================
function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  updateLoginUI();
  alert("Logged out successfully!");
}

// ===================================
// RUN ON PAGE LOAD
// ===================================
window.addEventListener('DOMContentLoaded', function() {
  updateLoginUI();
});

if (data.token) {
  alert("Login successful");
  localStorage.setItem("token", data.token);
  
  // Decode token to get user info
  const base64Url = data.token.split('.')[1];
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
  }).join(''));
  
  const userData = JSON.parse(jsonPayload);
  localStorage.setItem("user", JSON.stringify(userData));
  
  window.location.href = "index.html";
}
console.log("EMAIL RECEIVED:", email);

db.query(sql, [email], async (err, result) => {
  console.log("QUERY RESULT:", result);
});