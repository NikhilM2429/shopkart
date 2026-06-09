const firebaseConfig = {
  apiKey: "AIzaSyAePYMssEkL-XRSMk0-A5bCaH8yo8O2GAg",
  authDomain: "shopkart-web.firebaseapp.com",
  projectId: "shopkart-web",
  storageBucket: "shopkart-web.firebasestorage.app",
  messagingSenderId: "400024339264",
  appId: "1:400024339264:web:0631415892270d1d1770a5",
  measurementId: "G-L33565CJW8"
};

firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();

function googleLogin() {
  const provider = new firebase.auth.GoogleAuthProvider();

  auth.signInWithPopup(provider)
    .then((result) => {
      const user = result.user;

      localStorage.setItem("user", JSON.stringify({
        name: user.displayName,
        email: user.email,
        photo: user.photoURL
      }));

      alert("Google Login Successful");

      window.location.href = "../html/index.html";
    })
    .catch((error) => {
      console.error(error);
      alert("Google Login Failed");
    });
}