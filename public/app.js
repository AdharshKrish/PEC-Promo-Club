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
          // console.log(UID);
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
    firebase.auth().onAuthStateChanged(function (user){
      if(user){
        firebase.database().ref('users/'+user.uid+'/name').set(user.displayName);
        //   database.ref('posts/' + key + '/starCount').set(count.val()+1);
        //   database.ref('posts/' + key + '/star/' + UID).set(0);
        // });
        signOut();
        sendEmailVerification();
        alert("Account created and verification email will be sent shortly. Please verify your email then sign in");
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
    uid = user.uid;
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
    getImg('profile-img/'+UID+'.jpg','profile-img');
    getPost();
  }
    // viewLikes("-M-FK6A6-75N0CmUcv59");

  });
}

function addpost(){
  if(newpost.value!=""){
    let database = firebase.database();
    postId = database.ref('posts/').push().key;
    database.ref('posts/' + postId + '/content').set(newpost.value);
    database.ref('posts/' + postId + '/starCount').set(0);
    database.ref('posts/' + postId + '/star').set(0);
    database.ref('posts/' + postId + '/owner/id').set(UID);
    database.ref('posts/' + postId + '/owner/name').set(firebase.auth().currentUser.displayName);
    getPost();
  }
  else{
    alert("enter some content");
  }

}

function getPost(){
  postContainer.innerHTML="";
  const ref=firebase.database().ref('posts/');
  ref.once('value', function (allposts) {
    allposts.forEach(function (eachpost) {
      let symbol = "-";
      let code=0;
      const postKey = eachpost.key;
      const childData = eachpost.val();
      let owner=childData.owner;
      let hidn="hidden";
      if(typeof(owner)!='undefined')
      {
        owner=childData.owner.name;
        if(childData.owner.id==UID){
          hidn="";
        }
      }
      const like = JSON.stringify(childData);
      const likes=like.replace('"id":"'+UID+'",','');
        if(likes.includes(UID)){
          // symbol = "&#x1F497";
          // symbol="&#x2764;";
          symbol="&#x1f44d;";
          code=1;
        }
      postContainer.innerHTML += '<eachpost>' + childData['content'] + '</eachpost><button onclick=addLike("' + postKey +'",'+code+ ')>'+symbol+'</button>'+ childData['starCount']+'&nbsp;<button class="linky" onclick=viewLikes("'+postKey+'")>view likes</button>&nbsp;&nbsp;by '+owner+'&nbsp;<input class="linky" value="delete" onclick=deletePost("'+postKey+'") '+hidn+'><br><br>';

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

function getImg(loc,elt){

  var storage = firebase.storage();
  var gsReference = storage.refFromURL('gs://pec-promoclub.appspot.com/'+loc);

  gsReference.getDownloadURL().then(function(url) {

    // var xhr = new XMLHttpRequest();
    // xhr.responseType = 'blob';
    // xhr.onload = function(event) {
    //   var blob = xhr.response;
    // };
    // xhr.open('GET', url);
    // xhr.send();

    var img = document.getElementById(elt);
    img.src = url;
  }).catch(function(error) {
    // A full list of error codes is available at
    // https://firebase.google.com/docs/storage/web/handle-errors
    switch (error.code) {
      case 'storage/object-not-found':
        // elt.alt="no image uploaded";
        break;

      case 'storage/unauthorized':
        // User doesn't have permission to access the object
        break;

      case 'storage/canceled':
        // User canceled the upload
        break;

      case 'storage/unknown':
        // Unknown error occurred, inspect the server response
        break;
    }
  });
}

function viewLikes(postID){
  temp.innerHTML="";
  let ref=firebase.database().ref('posts/'+postID+'/star/');
  ref.once('value', (likes)=>{
    if(likes.val()==null){
      temp.innerHTML="no likes yet";
    }
    likes.forEach((eachlike)=>{
      let userId = eachlike.key;
      firebase.database().ref('users/'+userId+'/name/').once('value',(name)=>{
        // console.log(name.val());
        temp.innerHTML+=name.val()+'<br>';
      });
    });
  });
}

function deletePost(postID){
  firebase.database().ref('posts/'+postID).set(null);
  getPost();
}