// ===================================
// UPDATE NAVBAR LOGIN UI
// ===================================
function updateNavbarLogin() {
  const loginBtn = document.getElementById('loginBtn');
  
  if (!loginBtn) {
    console.log('No loginBtn found');
    return;
  }

  const user = localStorage.getItem("user");
  const token = localStorage.getItem("token");

  console.log('=== NAVBAR CHECK ===');
  console.log('User:', user);
  console.log('Token:', token);

  // Clear button completely
  loginBtn.innerHTML = '';

  if (user) {
    const userData = JSON.parse(user);
    const userName = userData.name || userData.email || "User";
    
    console.log('Showing: Welcome, ' + userName);
    
    // Add icon
    const icon = document.createElement('i');
    icon.className = 'ti ti-user';
    loginBtn.appendChild(icon);
    
    // Add space and text
    loginBtn.appendChild(document.createTextNode(' Welcome, ' + userName));
    
    loginBtn.classList.remove('btn-login');
    loginBtn.href = '#';
    loginBtn.style.cursor = 'pointer';

    loginBtn.onclick = function(e) {
      e.preventDefault();
      
      if (confirm('Logout?')) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        location.reload();
      }
    };
  } 
  else if (token) {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      
      const userData = JSON.parse(jsonPayload);
      const userName = userData.email || "User";
      
      console.log('Decoded token, Showing: Welcome, ' + userName);
      
      // Add icon
      const icon = document.createElement('i');
      icon.className = 'ti ti-user';
      loginBtn.appendChild(icon);
      
      // Add space and text
      loginBtn.appendChild(document.createTextNode(' Welcome, ' + userName));
      
      loginBtn.classList.remove('btn-login');
      loginBtn.href = '#';
      loginBtn.style.cursor = 'pointer';

      loginBtn.onclick = function(e) {
        e.preventDefault();
        
        if (confirm('Logout?')) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          location.reload();
        }
      };
    } catch (err) {
      console.log('Could not decode token');
      loginBtn.innerHTML = '<i class="ti ti-user"></i> Login';
      loginBtn.classList.add('btn-login');
      loginBtn.href = '../html/login.html';
      loginBtn.onclick = null;
    }
  }
  else {
    console.log('Showing: Login');
    loginBtn.innerHTML = '<i class="ti ti-user"></i> Login';
    loginBtn.classList.add('btn-login');
    loginBtn.href = '../html/login.html';
    loginBtn.style.cursor = 'pointer';
    loginBtn.onclick = null;
  }
}

function updateNavbarLogin() {
  const loginBtn = document.getElementById('loginBtn');
  if (!loginBtn) return;

  const user = localStorage.getItem("user");
  const token = localStorage.getItem("token");

  let userName = null;

  if (user) {
    try {
      const userData = JSON.parse(user);
      userName = userData.name || userData.email;
    } catch (e) {}
  }

  if (!userName && token) {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(c =>
        '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
      ).join(''));
      const payload = JSON.parse(jsonPayload);
      userName = payload.name || payload.email;
    } catch (e) {}
  }

  if (userName) {
    loginBtn.innerHTML = `<i class="ti ti-user"></i> Welcome, ${userName}`;
    loginBtn.href = '#';
    loginBtn.onclick = function(e) {
      e.preventDefault();
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      location.reload();
    };
  } else {
    loginBtn.innerHTML = `<i class="ti ti-user"></i> Login`;
    loginBtn.href = '../html/login.html';
    loginBtn.onclick = null;
  }
}

window.addEventListener('DOMContentLoaded', function() {
  setTimeout(updateNavbarLogin, 50);
});