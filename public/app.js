var firebaseConfig = {
apiKey: "AIzaSyC5ZH2s7eGof2Dk6wOWe0APbdAcjq4sxnc",
authDomain: "pec-promoclub.firebaseapp.com",
databaseURL: "https://pec-promoclub.firebaseio.com",
projectId: "pec-promoclub",
storageBucket: "pec-promoclub.appspot.com",
messagingSenderId: "771915701365",
appId: "1:771915701365:web:a27c09fd55344ed18cec3c",
measurementId: "G-MPL29PDR1K"
};
// firebase.initializeApp(firebaseConfig);
// firebase.analytics();

function toggleSignIn() {
  if (firebase.auth().currentUser) {
    // [START signout]
    firebase.auth().signOut();
    // [END signout]
  } else {
    var email = document.getElementById('email').value;
    var password = document.getElementById('password').value;
    // if (email.length < 4) {
    //   alert('Please enter an email address.');
    //   return;
    // }
    // if (password.length < 4) {
    //   alert('Please enter a password.');
    //   return;
    // }
    // Sign in with email and pass.
    // [START authwithemail]
    firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      // [START_EXCLUDE]
      if (errorCode === 'auth/wrong-password') {
        alert('Wrong password.');
      } else {
        alert(errorMessage);
      }
      console.log(error);
      document.getElementById('quickstart-sign-in').disabled = false;
      // [END_EXCLUDE]
    });
    // [END authwithemail]
  }
  document.getElementById('quickstart-sign-in').disabled = true;
}

/**
 * Handles the sign up button press.
 */
function handleSignUp() {
  var email = document.getElementById('upemail').value;
  var password = document.getElementById('uppassword').value;
  // if (email.length < 4) {
  //   alert('Please enter an email address.');
  //   return;
  // }
  // if (password.length < 4) {
  //   alert('Please enter a password.');
  //   return;
  // }
  // firebase.auth().createUserWithEmailAndPassword(email, password).catch(function(error) {
  //   var errorCode = error.code;
  //   var errorMessage = error.message;
  //   if (errorCode == 'auth/weak-password') {
  //     alert('The password is too weak.');
  //   } else {
  //     alert(errorMessage);
  //   }
  //   console.log(error);
  // });

  firebase.auth().createUserWithEmailAndPassword(email, password)
    .then(function (result) {
      return result.user.updateProfile({
        displayName: document.getElementById("upname").value
      })
    }).catch(function (error) {
      console.log(error);
      // var errorCode = error.code;
    var errorMessage = error.message;
    if (errorCode == 'auth/weak-password') {
      alert('The password is too weak.');
    } else {
      alert(errorMessage);
    }
    // console.log(error);
    });
  // [END createwithemail]
}

/**
 * Sends an email verification to the user.
 */
function sendEmailVerification() {
  // [START sendemailverification]
  firebase.auth().currentUser.sendEmailVerification().then(function() {
    // Email Verification sent!
    // [START_EXCLUDE]
    alert('Email Verification Sent!');
    // [END_EXCLUDE]
  });
  // [END sendemailverification]
}

function sendPasswordReset() {
  var email = document.getElementById('email').value;
  // [START sendpasswordemail]
  firebase.auth().sendPasswordResetEmail(email).then(function() {
    // Password Reset Email Sent!
    // [START_EXCLUDE]
    alert('Password Reset Email Sent!');
    // [END_EXCLUDE]
  }).catch(function(error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    // [START_EXCLUDE]
    if (errorCode == 'auth/invalid-email') {
      alert(errorMessage);
    } else if (errorCode == 'auth/user-not-found') {
      alert(errorMessage);
    }
    console.log(error);
    // [END_EXCLUDE]
  });
  // [END sendpasswordemail];
}

/**
 * initApp handles setting up UI event listeners and registering Firebase auth listeners:
 *  - firebase.auth().onAuthStateChanged: This listener is called when the user is signed in or
 *    out, and that is where we update the UI.
 */
// initApp();
function initApp() {
  // Listening for auth state changes.
  // [START authstatelistener]
  firebase.auth().onAuthStateChanged(function(user) {
    // [START_EXCLUDE silent]
    document.getElementById('quickstart-verify-email').disabled = true;
    // [END_EXCLUDE]
    if (user) {
      // User is signed in.
      var displayName = user.displayName;
      var email = user.email;
      var emailVerified = user.emailVerified;
      var photoURL = user.photoURL;
      var isAnonymous = user.isAnonymous;
      var uid = user.uid;
      var providerData = user.providerData;
      // [START_EXCLUDE]
      document.getElementById('quickstart-sign-in-status').textContent = 'Signed in';
      document.getElementById('quickstart-sign-in').textContent = 'Sign out';
      document.getElementById('quickstart-account-details').textContent = JSON.stringify(user, null, '  ');
      if (!emailVerified) {
        document.getElementById('quickstart-verify-email').disabled = false;
      }
      // [END_EXCLUDE]
    } else {
      // User is signed out.
      // [START_EXCLUDE]
      document.getElementById('quickstart-sign-in-status').textContent = 'Signed out';
      document.getElementById('quickstart-sign-in').textContent = 'Sign in';
      document.getElementById('quickstart-account-details').textContent = 'null';
      // [END_EXCLUDE]
    }
    // [START_EXCLUDE silent]
    document.getElementById('quickstart-sign-in').disabled = false;
    // [END_EXCLUDE]
  });
  // [END authstatelistener]

  document.getElementById('quickstart-sign-in').addEventListener('click', toggleSignIn, false);
  document.getElementById('quickstart-sign-up').addEventListener('click', handleSignUp, false);
  document.getElementById('quickstart-verify-email').addEventListener('click', sendEmailVerification, false);
  document.getElementById('quickstart-password-reset').addEventListener('click', sendPasswordReset, false);
}


function disp(){

  var name, email, photoUrl, uid, emailVerified;

  firebase.auth().onAuthStateChanged(function (user){
    name = user.displayName;
    email = user.email;
    photoUrl = user.photoURL;
    emailVerified = user.emailVerified;
    uid = user.uid;  // The user's ID, unique to the Firebase project. Do NOT use
    // this value to authenticate with your backend server, if
    // you have one. Use User.getToken() instead.
    console.log(name+email+photoUrl+emailVerified+uid);
  });
}
function autoLogin() {

  firebase.auth().onAuthStateChanged(function (user) {
    if(user!=null){
    login.style.display = "none";
    home.style.display = "block";
    dispname.innerHTML = user.displayName;}
    getPost();
  });
 
}

function addpost(){
  let database = firebase.database();
  // postId="vcajbsjq";
  // database.ref('posts/' + postId + '/starCount').once('value').then(function (snapshot) {
  //   console.log(snapshot.val());
  // });
  // postId="something";
  postId = database.ref('posts/').push().key;
  database.ref('posts/' + postId + '/content').set(newpost.value);
  database.ref('posts/' + postId + '/starCount').set(0);
  getPost();
}

function getPost(){
  postContainer.innerHTML="";
  let database = firebase.database();
  let ref=database.ref('posts/');
  ref.once('value', function (snapshot) {
    snapshot.forEach(function (childSnapshot) {
      // var childKey = childSnapshot.key;
      let childData = childSnapshot.val();
      // console.log(childData);
      // console.log(childData["content"]);

      // var eachpost = document.createElement("eachpost");                 // Create a <p> element
      // eachpost.innerHTML = childData["content"]+"<br>"+childData["starCount"];                // Insert text
      // document.getElementById("postContainer").appendChild(eachpost);
      // document.getElementById("postContainer").appendChild(document.createElement("br"));
      // document.getElementById("postContainer").appendChild(document.createElement("br"));

      // ...
      // childSnapshot.forEach(function (childofchild){

      // })
      postContainer.innerHTML+="<eachpost>"+childData["content"]+" &nbsp;&nbsp; Stars = "+childData["starCount"]+"</eachpost><br><br>";

    });
  });
}