// Your web app's Firebase configuration
var firebaseConfig = {
  apiKey: "AIzaSyCu8Z3Hg1yPH9t2JDMr34Osqrp1AD0KHeA",
  authDomain: "notes-app-f827b.firebaseapp.com",
  projectId: "notes-app-f827b",
  storageBucket: "notes-app-f827b.appspot.com",
  messagingSenderId: "704654939957",
  appId: "1:704654939957:web:c8aef89d1fc3494b6c5e7c"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
function enterto(){
  location.href="notes-app.html"
}
function signUp() {
  var email = document.getElementById("email");
  var password = document.getElementById("password");
  const promise = auth.createUserWithEmailAndPassword(email.value, password.value);
  promise.catch(e => alert(e.message));
  promise.then(e => alert("Signed Up"))
  promise.then(e=> enterto())
}

function signIn() {
  var email = document.getElementById("email");
  var password = document.getElementById("password");
  const promise = auth.signInWithEmailAndPassword(email.value, password.value);
  promise.catch(e => alert(e.message));
  promise.then(e => alert("SignedIn " + email.value))
  promise.then(e=> enterto())
  //Take user to different or home page
}

function signOut() {
  auth.signOut();
  alert("SignedOut")
}

auth.onAuthStateChanged(function (user) {

  if (user) {
    var email = user.email;
    alert("Active User " + email);
    //is signed in
  } else {
    alert("No Active User");
    //no user is signed in
  }

});