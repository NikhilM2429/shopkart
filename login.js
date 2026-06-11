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

  fetch("https://appealing-spirit-production-da94.up.railway.app/api/users/login", {
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

      // ✅ SAVE TOKEN
      localStorage.setItem("token", data.token);
      console.log("Token saved:", data.token);

      // 🔥 NEW: Set isLoggedIn and userToken
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("userToken", data.token);
      console.log("isLoggedIn set to true");
      console.log("userToken set:", data.token);

      // ✅ SAVE USER INFO (FIXED - check if data.user exists)
      if (data.user) {
        localStorage.setItem("user", JSON.stringify(data.user));
        console.log("User saved:", data.user);
      } else if (data.email) {
        // If API returns email instead of user object
        localStorage.setItem("user", JSON.stringify({ 
          name: data.name || email, 
          email: data.email 
        }));
        console.log("User saved from response:", { name: data.name || email, email: data.email });
      } else {
        // Create user object from token/email
        localStorage.setItem("user", JSON.stringify({ 
          name: email.split('@')[0], 
          email: email 
        }));
        console.log("User created from email:", { name: email.split('@')[0], email: email });
      }

      // 🔥 REDIRECT TO HOME
      console.log("Redirecting to home...");
      window.location.href = "index.html";
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
// LOGOUT FUNCTION (FIXED - on HOME PAGE)
// ===================================
function logout() {
  console.log("🔴 Logout clicked - clearing all data");
  
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  localStorage.removeItem("isLoggedIn");
  localStorage.removeItem("userToken");
  
  console.log("✅ All data cleared:");
  console.log("  isLoggedIn:", localStorage.getItem("isLoggedIn"));
  console.log("  userToken:", localStorage.getItem("userToken"));
  console.log("  user:", localStorage.getItem("user"));
  console.log("  token:", localStorage.getItem("token"));
  
  alert("Logged out successfully!");
  
  // Update navbar
  if (typeof updateLoginUI === 'function') {
    updateLoginUI();
  }
  
}

document.addEventListener('DOMContentLoaded', function() {
  const loginBtn = document.getElementById('loginBtn');
  
  if (loginBtn) {
    console.log('✅ Found loginBtn, binding logout function');
    
    loginBtn.onclick = function(e) {
      e.preventDefault(); // Stop going to login.html
      
      if (localStorage.getItem('isLoggedIn') === 'true') {
        // Logged in → show logout confirm
        console.log('🔴 User is logged in, showing logout confirm');
        
        if (confirm('Are you sure you want to logout?')) {
          console.log('✅ User confirmed logout');
          logout();
        }
      } else {
        // Not logged in → go to login page
        console.log('👤 User not logged in, going to login page');
        window.location.href = 'login.html';
      }
    };
  } else {
    console.log('❌ loginBtn NOT found!');
  }
});



  