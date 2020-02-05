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

let UID;

function signIn(){
  var email = inemail.value;
  var password = inpass.value;
  if (email.length < 4 || !email.includes("@pec.edu")) {
    alert('Please enter your pec.edu email address');
    return;
  }
  if (password.length < 4) {
    alert('Please enter a password');
    return;
  }
  firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
    var errorCode = error.code;
    var errorMessage = error.message;
    if (errorCode === 'auth/wrong-password') {
      alert('Wrong password.');
    } else {
      alert(errorMessage);
    }
    console.log(error);
  });
  
  firebase.auth().onAuthStateChanged(function (user){
    if(user){
      if(user.emailVerified){
          login.style.display="none";
          home.style.display="block";
          // let usr = firebase.auth().currentUser;
          dispname.innerHTML=user.displayName;
          UID = user.uid;
          console.log(UID);
      }
      else{
        signOut();
        alert("Please verify your email and then continue");
        sendEmailVerification();
      }
    }
  });
}

function handleSignUp() {
  var email = document.getElementById('upemail').value;
  var password = document.getElementById('uppassword').value;
  if (email.length < 4 || !email.includes("@pec.edu")) {
    alert('Please enter your pec.edu email address');
    return;
  }
  if (password.length < 4) {
    alert('Please enter a password.');
    return;
  }

  firebase.auth().createUserWithEmailAndPassword(email, password)
    .then(function (result) {
      return result.user.updateProfile({
        displayName: document.getElementById("upname").value
      })
    }).catch(function (error) {
      console.log(error);
    var errorMessage = error.message;
    if (errorCode == 'auth/weak-password') {
      alert('The password is too weak.');
    } else {
      alert(errorMessage);
    }
    });
    // signOut();
    // alert("hi");
    firebase.auth().onAuthStateChanged(function (user){
      if(user){
        signOut();
        alert("Account created and verification email sent! Please verify your email then sign in");
      }});  
}

function signOut() {
  if (firebase.auth().currentUser) {
    firebase.auth().signOut(); 
      login.style.display = "block";
    home.style.display = "none";
  }
}
function passReset(){
  var email = inemail.value;
    alert('Please wait');
  firebase.auth().sendPasswordResetEmail(email).then(function () {
    alert('Password Reset Email Sent!');
  }).catch(function (error) {
    var errorCode = error.code;
    var errorMessage = error.message;
    if (errorCode == 'auth/invalid-email') {
      alert(errorMessage);
    } else if (errorCode == 'auth/user-not-found') {
      alert(errorMessage);
    }
    console.log(error);
  });
}

function sendEmailVerification() {
  firebase.auth().currentUser.sendEmailVerification().then(function() {
    alert('Email Verification Sent!');
  });
}

function disp(){
  var name, email, photoUrl, uid, emailVerified;
  //firebase.auth().currentUser
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
    dispname.innerHTML = user.displayName;
    UID = firebase.auth().currentUser.uid;
  }
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
  database.ref('posts/' + postId + '/star').set(0);
  getPost();

}

function getPost(){
  postContainer.innerHTML="";
  let database = firebase.database();
  let ref=database.ref('posts/');
  ref.once('value', function (snapshot) {
    snapshot.forEach(function (childSnapshot) {
      let symbol = "-";
      let code=0;
      let postKey = childSnapshot.key;
      let childData = childSnapshot.val();
      let like = JSON.stringify(childData);

        if(like.includes(UID)){
          // symbol = "&#x1F497";
          // symbol="&#x2764;";
          symbol="&#x1f44d;";
          code=1;
        }
      postContainer.innerHTML += '<eachpost>' + childData['content'] + '</eachpost><button onclick=addLike("' + postKey +'",'+code+ ')>'+symbol+'</button>'+ childData['starCount']+'<br><br>';

    });
  });
}

function addLike(key,c){
  let database = firebase.database();
  if(c==0){
  database.ref('posts/'+key+'/starCount').once('value',function (count){
    database.ref('posts/' + key + '/starCount').set(count.val()+1);
    database.ref('posts/' + key + '/star/' + UID).set(0);
  });
  }
  else{
    database.ref('posts/'+key+'/starCount').once('value',function (count){
      database.ref('posts/' + key + '/starCount').set(count.val()-1);
      database.ref('posts/' + key + '/star/' + UID).set(null);
    });
  }
  getPost();
}