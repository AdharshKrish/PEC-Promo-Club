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

let UID,USER;
let flag;




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
      // if(user.emailVerified){
          // login.style.display="none";
          // home.style.display="block";
          // // let usr = firebase.auth().currentUser;
          // dispname.innerHTML=user.displayName;
          // UID = user.uid;
          // // console.log(UID);
      // }
      if(!user.emailVerified){
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
        let id=user.uid,name=user.displayName;
        firebase.database().ref('users/'+id+'/name').set(name);
        firebase.database().ref('users/' + id + '/email').set(user.email);
        sendEmailVerification();
        signOut();
        alert("Account created and verification email will be sent shortly. Please verify your email then sign in");
        window.location.reload();
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

// function disp(){
//   var name, email, photoUrl, uid, emailVerified;
//   //firebase.auth().currentUser
//   firebase.auth().onAuthStateChanged(function (user){
//     name = user.displayName;
//     email = user.email;
//     photoUrl = user.photoURL;
//     emailVerified = user.emailVerified;
//     uid = user.uid;
//   });
// }
function autoLogin() {

  firebase.auth().onAuthStateChanged(function (user) {
    if(user!=null){
    login.style.display = "none";
    home.style.display = "block";
    dispname.innerHTML = user.displayName;
    UID = firebase.auth().currentUser.uid;
    USER = firebase.auth().currentUser;
    document.getElementById('dispname').addEventListener('click', () => {
      getProfile(UID);
    });
    getProfile(UID);
    getImg('profile-img/'+UID+'.jpg','profimg');
    getImg('profile-img/' + UID + '.jpg', 'expprofimg');
    getPost();
  }
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
    database.ref('posts/' + postId + '/owner/name').set(USER.displayName);
    let d = new Date();
    let yr = d.getFullYear()*100000000;
    let mo = (d.getMonth()+1)*1000000;
    let dt = d.getUTCDate()*10000;
    let hr = d.getHours()*100;
    let mi = d.getMinutes();
    let date = yr+mo+dt+hr+mi;
    database.ref('posts/'+postId+'/date').set(date);
    // database.ref('posts/' + postId + '/date/date').set(d.getDate());
    // database.ref('posts/' + postId + '/date/month').set(d.getMonth()+1);
    // database.ref('posts/' + postId + '/date/year').set(d.getFullYear());
    // database.ref('posts/' + postId + '/date/hours').set(d.getHours());
    // database.ref('posts/' + postId + '/date/minutes').set(d.getMinutes());
    newpost.value = "";
    getPost();
  }
  else{
    alert("enter some content");
  }

}

function getPost(){
  postContainer.innerHTML="";
// var topUserPostsRef = firebase.database().ref('user-posts/' + myUserId).orderByChild('starCount');
  let d = new Date();
  let yr = d.getFullYear()*100000000;
  let mo = (d.getMonth()+1)*1000000;
  let dt = d.getUTCDate()*10000;
  let hr = d.getHours()*100;
  let mi = d.getMinutes();
  let lastweek = yr+mo+dt+hr+mi-7*10000;

  const ref=firebase.database().ref('posts/').orderByChild('date').startAt(lastweek);
  ref.once('value', function (allposts) {
    // allposts.reverse();
    // console.log(allposts);
    allposts.forEach(function (eachpost) {
      // let symbol = false;
      let code=0;
      const postKey = eachpost.key;
      const childData = eachpost.val();
      let hidn="hidden";
      let owner=childData.owner.name;
      if(childData.owner.id==UID){
        hidn="";
      }
      const like = JSON.stringify(childData);
      const likes=like.replace('"id":"'+UID+'",','');
        if(likes.includes(UID)){
          // symbol = "&#x1F497";
          // symbol="&#x2764;";
          // symbol=true;
          code=1;
        }
        let date=childData.date;

    if(typeof(childData.date)!="undefined")
        date=childData.date.toString().substring(6,8)+'/'+childData.date.toString().substring(4,6)+'/'+childData.date.toString().substring(0,4)+' '+childData.date.toString().substring(8,10)+':'+childData.date.toString().substring(10,12);
      var likeimg;

        if(code == 1){
          likeimg="<img src='img/liked.svg'/>";
        }else{
          likeimg = "<img src='img/unlike.svg'>";
        }
      // postContainer.innerHTML += '<eachpost>' + childData['content'] + '</eachpost><button onclick=addLike("' + postKey +'",'+code+ ')>'+symbol+'</button>'
      // + childData['starCount']+'&nbsp;<button class="linky" onclick=viewLikes("'+postKey+'")>view likes</button>&nbsp;&nbsp;by '
      // +owner+'&nbsp;&nbsp;on: '+date+'&nbsp; <input class="linky" value="delete" onclick=deletePost("'+postKey+'") '+hidn+'><br><br>';
      //  getImg('profile-img/'+childData.owner.id+'.jpg',postKey);
      postContainer.innerHTML += `<div class="card" style="width: 100%;">
        <div class="card-body">
          <h5 class="card-title" onclick=getProfile('${childData.owner.id}')>${owner}</h5>
          <img style="float:right" onclick=deletePost('${postKey}') src="img/delete_forever-24px.svg" ${hidn}>
          <h6 class="card-subtitle mb-2 text-muted">${date}</h6>
          <p class="card-text">${childData['content']}</p>
          <button class="lkbtn" onclick=addLike("${postKey}",${code})>${likeimg}</button>
          <button class="likecount" data-toggle="modal" data-target="#exampleModalCenter" onclick=viewLikes("${postKey}")>${childData['starCount']}</button>
        </div>
      </div>`;
      
      // console.log(childData.owner.id+' '+postKey);

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

function getProfile(ownerid) {
   var ownername, bio, phone,bday;
  const ref = firebase.database().ref('users/'+ownerid);
  ref.once('value',function(arg){
    // console.log(arg.val()['name'])

    if(arg.val()['name'] == undefined){
      firebase.database().ref('users/' + ownerid + '/name').set(USER.displayName);
      ownername = arg.val()['name'];
    }
    else{
      ownername = arg.val()['name'];
    }
    mail = arg.val()['email'];
    bio = (arg.val()['bio'] == undefined) ? "":arg.val()['bio'];
    phone = (arg.val()['phone'] == undefined) ? "" : arg.val()['phone'];
    bday = (arg.val()['bday'] == undefined) ? "" : arg.val()['bday'];
    // console.log(ownername);
    var profcard;
    if(ownerid == UID){
       profcard = `
          <img id="expprofimg"><button class="likecount" onclick="upimg.click()" style="margin:0 auto">Change Profile Image</button>
          <div class="card-body">
            <h5 class="card-title">${ownername}</h5>
            <div class="input-group mb-3">
              <input id="bioinput" type="text" value="${bio}"  class="form-control" placeholder="Bio" aria-label="Recipient's username" aria-describedby="basic-addon2" disabled>
              <div class="input-group-append">
                <span  onclick="edit('${ownerid}','bio')" class="input-group-text" id="biobtn"><img src="img/create-24px.svg"></span>
              </div>
            </div>
          </div>
          <ul class="list-group list-group-flush">
          <li class="list-group-item">${mail}</li>

            <li class="list-group-item"><div class="input-group mb-3">
              <input id="phoneinput" type="text"  value="${phone}" class="form-control" placeholder="Phone" aria-label="Recipient's username" aria-describedby="basic-addon2" disabled>
              <div class="input-group-append">
                <span  onclick="edit('${ownerid}','phone')" class="input-group-text" id="phonebtn"><img src="img/create-24px.svg"></span>
              </div>
            </div></li>
            <li class="list-group-item"><div class="input-group mb-3">
              <input id="bdayinput" type="date" value="${bday}" class="form-control" placeholder="Bday" aria-label="Recipient's username" aria-describedby="basic-addon2" disabled>
              <div class="input-group-append">
                <span  onclick="edit('${ownerid}','bday')" class="input-group-text" id="bdaybtn"><img src="img/create-24px.svg"></span>
              </div>
            </div></li>
            
          </ul>
          `;
    }else{
     profcard = `
          <img id="expprofimg">
          <div class="card-body">
            <h5 class="card-title">${ownername}</h5>
            <p class="card-text">${bio}
            </p>
          </div>
          <ul class="list-group list-group-flush">
            <li class="list-group-item">${mail}</li>
            <li class="list-group-item">${phone}</li>
            <li class="list-group-item">${bday}</li>
          </ul>
          `;
    }
    window.profcard.innerHTML = profcard;
    getImg('profile-img/' + ownerid + '.jpg', 'expprofimg');

  })
  
  
}

function edit(ownerid,eltid) {
let elt = document.getElementById(eltid+'input');
if(elt.disabled){
  document.getElementById(eltid+'btn').innerHTML = '<img src="img/save.svg">';
  elt.disabled = false;
}else{
  document.getElementById(eltid+'btn').innerHTML = '<img src="img/create-24px.svg">';
  elt.disabled = true;
  let database = firebase.database();
  // postId = database.ref('users/'+ownerid).push().key;
  database.ref('users/' + ownerid + '/' + eltid).set(elt.value);
}

  

  
}

function getImg(loc,elt){
  var img = document.getElementById(elt);
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

    img.src = url;
    // console.log(url);
    // img.onerror = "this.alt='hi'";
  }).catch(function(error) {
    // A full list of error codes is available at
    // https://firebase.google.com/docs/storage/web/handle-errors
    switch (error.code) {
      case 'storage/object-not-found':
        img.style.display="none";
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

function uploadImg(elt){
  let file = document.getElementById(elt).files[0];
  var storageRef = firebase.storage().ref();
  var uploadTask = storageRef.child('profile-img/'+UID+'.jpg').put(file);
  // Register three observers:
  // 1. 'state_changed' observer, called any time the state changes
  // 2. Error observer, called on failure
  // 3. Completion observer, called on successful completion
  uploadTask.on('state_changed', function(snapshot){
    // Observe state change events such as progress, pause, and resume
    // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
    var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
    console.log('Upload is ' + progress + '% done');
    switch (snapshot.state) {
      case firebase.storage.TaskState.PAUSED: // or 'paused'
        console.log('Upload is paused');
        break;
      case firebase.storage.TaskState.RUNNING: // or 'running'
        console.log('Upload is running');
        break;
    }
  }, function(error) {
    // Handle unsuccessful uploads
  }, function() {
    // Handle successful uploads on complete
    // For instance, get the download URL: https://firebasestorage.googleapis.com/...
    uploadTask.snapshot.ref.getDownloadURL().then(function(downloadURL) {
      // console.log('File available at', downloadURL);
      location.reload();
    });
  });
}

function viewLikes(postID){
  likesmodal.innerHTML='';
  let ref=firebase.database().ref('posts/'+postID+'/star/');
  ref.once('value', (likes)=>{
    if(likes.val()==0){
      likesmodal.innerHTML="no likes yet";
    }
    else{
      likes.forEach((eachlike)=>{
        let userId = eachlike.key;
        firebase.database().ref('users/'+userId+'/name/').once('value',(name)=>{
          likesmodal.innerHTML+=name.val()+'<br>';
        });
      });
    }
  });


}

function deletePost(postID){
  firebase.database().ref('posts/'+postID).set(null);
  getPost();
}