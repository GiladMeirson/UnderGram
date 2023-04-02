USER = {};
BGcolor = "";
allDB = [];
allPosts = [];
PrivateIDtoSend = -1;
allmsg = [];
initt = true;

function init() {
  ref = firebase.database().ref("DB");
  listenToNewMessages();
  listentoUpdate();
  setTimeout(delay, 2000);
  //ref.push().set({ users: [{name:'sini',pass:'sini',islog:false},{name:'mazor',pass:'mazor',islog:false},{name:'gambash',pass:'gambash',islog:false}], messgs:[{to:'mazor',from:'sini',content:'bla bla' ,time:'6'},{to:'sini',from:'mazor',content:'bla dsdsdsdsds' ,time:'7'}] }); //to add child
  // listen to incoming messages
  // listenToNewMessages();
  // // listen to removing messages
  // listenToRemove();
  // ph = document.getElementById("ph");
  if (localStorage["USER"] != undefined) {
    USER = JSON.parse(localStorage["USER"]);
    if (!USER.Rem) {
      document.getElementById("nameIN").value = USER.name;
      document.getElementById("memoIN").checked = USER.Rem;
    } else {
      TurnOnline(true);
      console.log("in init() remember me ????online???", USER);
      $("#SignIn").fadeOut(1);
      $("#container").fadeIn(500);
      $("#logOut").fadeIn(500);
    }
  }

  document.getElementById("msgINn").addEventListener("keypress", (e) => {
    if (e.key == "Enter" && !e.shiftKey) {
      const msgBody = document.getElementById("msgINn").value;
      console.log(e.key, msgBody);
      e.preventDefault();
      document.getElementById("msgINn").value = "";
      console.log(PrivateIDtoSend);
      const ToUserObj = GetUserById(PrivateIDtoSend);
      if (msgBody != "") {
        const DataSendObj = {
          Id: allDB.length,
          UltraType: "chatMSG",
          Body: msgBody,
          From: USER.name,
          FromId: USER.Id,
          To: ToUserObj.name,
          ToUserId: ToUserObj.Id,
          Time: GetTime(),
        };
        console.log(DataSendObj);
        InsertObjToDB(DataSendObj);
      }
    }
  });
}

//------------------------------Manage Fuctions------------------------------//

function SignUp() {
  const name = document.getElementById("nameIN").value;
  const pass = document.getElementById("passIN").value;
  const Rem = document.getElementById("memoIN").checked;
  const Online = true;
  const Times = GetTime();
  if (name != "" && pass != "") {
    const NewUser = {
      Id: allDB.length,
      UltraType: "user",
      name: name,
      password: pass,
      Rem: Rem,
      Online: Online,
      RegisterTime: Times,
      LastVisitTime: Times,
    };

    InsertObjToDB(NewUser);
    USER = NewUser;
    localStorage["USER"] = JSON.stringify(USER);
    swal("connect", `welcome ${name} you are online `, "success");
    $("#SignIn").fadeOut(250);
    $("#container").fadeIn(500);
    $("#logOut").fadeIn(500);
  } else {
    swal("Empty Values!", "Empty Values is not allowed", "error");
  }
}
function LogOut() {
  $("#container").fadeOut(250);
  $("#SignIn").fadeIn(500);
  $("#logOut").fadeOut(250);
  closeWebSite();
}
function closeWebSite() {
  console.log("CLOSE XXXXXXXXXXXXXXXXXXXXXX");
  //online=false;
  TurnOnline(false);
}

function SignIn() {
  const name = document.getElementById("nameIN").value;
  const pass = document.getElementById("passIN").value;
  const Rem = document.getElementById("memoIN").checked;
  const Online = true;
  const AllUsers = BringAllDataByType("user");
  let flag = true;

  AllUsers.forEach((user) => {
    if (user.password == pass && user.name == name) {
      swal(`Hello ${user.name}`, "Welcome back", "success");
      let usertoOnline = user;
      usertoOnline.Online = true;
      usertoOnline.Rem = Rem;
      localStorage["USER"] = JSON.stringify(usertoOnline);
      USRE = usertoOnline;
      UpdateSpecific(usertoOnline.Id, usertoOnline);
      $("#SignIn").fadeOut(1);
      $("#container").fadeIn(500);
      $("#logOut").fadeIn(500);
      flag = false;
    }
  });

  if (flag) {
    swal("Wrong", "password incorrect", "error");
  }

  // if (!(USER.name == undefined)) {
  //   if (name == USER.name && pass == USER.pass) {
  //     console.log("connect");
  //     USER.rem = Rem;
  //     localStorage["USER"] = JSON.stringify(USER);
  //     swal("connect", "welcome back", "success");
  //     $("#SignIn").fadeOut(750);
  //     $("#container").fadeIn(750);
  //     //getAllfromDB()
  //   } else {
  //     swal("Wrong", "password incorrect", "error");
  //   }
  // } else {
  //   console.log("new user");
  //   USER.name = name;
  //   USER.pass = pass;
  //   USER.rem = Rem;
  //   localStorage["USER"] = JSON.stringify(USER);
  //   console.log("connect");
  //   swal("sign up complete", "you are connect now", "success");
  //   $("#SignIn").fadeOut(750);
  //   $("#container").fadeIn(750);
  //   // getAllfromDB()
  // }
}

function UploadPost() {
  const type = document.getElementById("CatIN").value;
  const msg = document.getElementById("msgIN").value;
  const anonymous = document.getElementById("anonimosIN").checked;
  let bgColor = BGcolor;
  const Times = GetTime();
  if (BGcolor == "") {
    bgColor = "basic";
  }

  if (msg != "") {
    const DataSendObj = {
      Id: allDB.length,
      UltraType: "post",
      Type: type,
      Msg: msg,
      Anonymous: anonymous,
      BgColor: bgColor,
      From: USER.name,
      Date: Times[0],
      Time: Times[1],
    };

    InsertObjToDB(DataSendObj);
    swal("success", "send your message", "success");
    document.getElementById("msgIN").value = "";
    $("#PostModal").fadeOut(750);
  } else {
    swal("Empty content!", `Please insert content to your ${type} `, "error");
  }
}

function GetTime() {
  //return array of string [0]-->date [1]-->time
  let d = new Date();
  let month = d.getMonth() + 1;
  let day = d.getDate();
  let hour = d.getHours();
  let min = d.getMinutes();

  if (month < 10) {
    month = "0" + (d.getMonth() + 1);
  }
  if (day < 10) {
    day = "0" + d.getDate();
  }
  if (hour < 10) {
    hour = "0" + d.getHours();
  }
  if (min < 10) {
    min = "0" + d.getMinutes();
  }

  const date = day + "-" + month + "-" + d.getFullYear();
  const time = hour + ":" + min;
  const result = [date, time];

  return result;
}

function SetBGcolor(div) {
  alldivs = document.getElementsByClassName("cube");
  const modal = document.getElementById("PostModal");
  //console.log(modal.classList);
  let id = div.className.split("cube ");
  for (let index = 0; index < alldivs.length; index++) {
    const cube = alldivs[index];
    if (cube.className.includes(id[1])) {
      cube.style.border = "2px gold solid";
      for (let index = 0; index < modal.classList.length; index++) {
        const element = modal.classList[index];
        //console.log(element);
        modal.classList.remove(element);
      }
      modal.classList.add(id[1]);
      BGcolor = id[1];
    } else {
      cube.style.border = "1px black solid";
    }
  }
}

function CheckForNotification(Msg) {
  console.log("HERE !!!!!!!!!!!!!!!!!!!!!!!!", Msg.ToUserId, USER.Id);
  if (Msg.ToUserId == USER.Id) {
    console.log("HERE !!!!!!!!!!!!!!!!!!!!!!!!", Msg.ToUserId, USER.Id);
    RenderToNotification(Msg.From, Msg.FromId);
    ShowNotifications();
  }
}

function delay() {
  initt = false;
}
//----------------------------------------------------------------------//

//------------------------------LISTNERS------------------------------//
function listenToNewMessages() {
  // child_added will be evoked for every child that was added
  // on the first entry, it will bring all the childs

  ref.on("child_added", (snapshot) => {
    const Piecse = snapshot.val();
    //console.log(Piecse);
    allDB.push(Piecse);
    if (Piecse.UltraType == "post") {
      allPosts.push(Piecse);
      RenderToPostPH(allPosts);
    }
    if (Piecse.UltraType == "chatMSG") {
      if (initt == false) {
        CheckForNotification(Piecse);
      }
      allmsg.push(Piecse);
      RenderToChatPH(allmsg);
    }
  });
}

function listentoUpdate() {
  ref.on("child_changed", (snapshot) => {
    const Piecse = snapshot.val();
    if (Piecse.UltraType == "user") {
      if (Piecse.Online && Piecse.Id != USER.Id) {
        RenderToNotificationOnlines(Piecse.name, Piecse.Id);
        ShowNotifications();
      }
      //USER = Piecse;
    }
    console.log("XXX---> ", Piecse);
    console.log("allDB: ", allDB);
    RenderToUsersPH();
  });
}
//----------------------------------------------------------------------//

//------------------------------DataBase Functions------------------------------//

function UpdateSpecific(ChildID, newObjtoSave) {
  //give me condition by id and new object to save and will update spesific child in the DB
  let flag = true;
  ref.once("value", (snapshot) => {
    snapshot.forEach((element) => {
      const Piecse = element.val();
      if (Piecse.Id == ChildID) {
        ref.child(element.key).set(newObjtoSave);
        console.log("update success !!");
        flag = false;
        return true;
      }
    });
    if (flag) {
      console.log("didnt find element with this id:" + ChildID);
      return false;
    }
  });
}

function InsertObjToDB(obj) {
  ref.push().set(obj);
}
function BringAllData() {
  let arrReturn = [];
  ref.once("value", (snapshot) => {
    snapshot.forEach((element) => {
      const Piecse = element.val();
      arrReturn.push(Piecse);
    });
  });
  return arrReturn;
}

function GetUserById(id) {
  allusers = BringAllDataByType("user");
  let res = false;
  allusers.forEach((us) => {
    if (us.Id == id) {
      res = us;
    }
  });
  return res;
}

function BringAllDataByType(type) {
  let arrReturn = [];
  ref.once("value", (snapshot) => {
    snapshot.forEach((element) => {
      const Piecse = element.val();
      if (Piecse.UltraType == type) {
        arrReturn.push(Piecse);
      }
    });
  });
  return arrReturn;
}

function TurnOnline(togg) {
  if (localStorage["USER"] != undefined) {
    USER = JSON.parse(localStorage["USER"]);
    USER.Online = togg;
    UpdateSpecific(USER.Id, USER);
    localStorage["USER"] = JSON.stringify(USER);
  }
}

//----------------------------------------------------------------------//

//------------------------------RENDERS------------------------------//

function RenderToPostPH(array) {
  const ph = document.getElementById("postPH");
  let str = ``;

  array.forEach((item) => {
    let nameToPrint = item.From;
    if (item.Anonymous) {
      nameToPrint = "Anonymous";
    }
    str += `<div class="Card ${item.BgColor}">`;
    str += `<div class="CardContent">`;
    str += `<p class="Typetitle">${item.Type}</p>`;
    str += `<p class="Bodytitle" >${item.Msg}</p>`;
    str += `<p class="titleFrom">Author: ${nameToPrint}</p>`;
    str += `<p class="timetitle">${item.Date}  ${item.Time}</p>`;
    str += `</div>`;
    str += `</div>`;
  });

  ph.innerHTML = str;
}

function RenderToUsersPH() {
  allUsers = BringAllDataByType("user");
  const PH = document.getElementById("UsersPH");
  let str = ``;

  allUsers.forEach((us) => {
    if (us.Id == USER.Id) {
      //do nothing
    } else {
      let claddAdd = "";
      if (us.Online) {
        claddAdd = "online";
      } else {
        claddAdd = "offline";
      }

      str += `<div onclick="OpenChatModal(this.id)" id="${us.Id}" class="UserCard ${claddAdd}">`;
      str += `<p class="UserTitle">${us.name}</p>`;
      str += `</div>`;
    }
  });

  PH.innerHTML = str;
}

function RenderToChatPH(arrayMSG) {
  const PH = document.getElementById("ChatPH");
  let str = ``;
  if (PrivateIDtoSend == -1) {
    return;
  } else {
    arrayMSG.forEach((msg) => {
      if (msg.FromId == USER.Id && PrivateIDtoSend == msg.ToUserId) {
        // console.log('XXXXXXXXXX ----->',msg)
        str += `<div class="mesg me">`;
        str += `<p class="contentMSG">${msg.Body}</p>`;
        str += `<p class="fromMSG">${msg.From}</p>`;
        str += `<p class="dateMSG">${msg.Time[0]} ${msg.Time[1]}</p>`;
        str += `</div>`;
      } else if (msg.FromId == PrivateIDtoSend && USER.Id == msg.ToUserId) {
        // console.log('XXXXXXXXXX ----->',msg)
        str += `<div class="mesg he">`;
        str += `<p class="contentMSG">${msg.Body}</p>`;
        str += `<p class="fromMSG">${msg.From}</p>`;
        str += `<p class="dateMSG">${msg.Time[0]} ${msg.Time[1]}</p>`;
        str += `</div>`;
      }
    });
    if (str == "") {
      str = "<h1>There is no messages right now...</h1>";
    }

    PH.innerHTML = str;
    PH.scrollTo(0, PH.scrollHeight);
  }

  //   <div class="mesg he">
  //   <p class="contentMSG">blablablaldfdf efe fd  qdsks fdlklsfk d sodk sodk ? ! fkodks ! </p>
  //   <p class="fromMSG">Mazor</p>
  //   <p class="dateMSG">12.12.12 15:15</p>
  // </div>
}

function RenderToNotification(from, fromId) {
  const ph = document.getElementById("PushWraper");
  let str = `<img onclick="OpenChatModal(${fromId})" src="./img/email.png" alt="">`;
  str += `<p onclick="OpenChatModal(${fromId})" id="Push-Content">You Got new Message From ${from} !</p>`;
  ph.innerHTML = str;
}
function RenderToNotificationOnlines(from, fromId) {
  const ph = document.getElementById("PushWraper");
  let str = `<img onclick="OpenChatModal(${fromId})" src="./img/smile.png" alt="">`;
  str += `<p onclick="OpenChatModal(${fromId})" id="Push-Content">${from} just connected! click to send him message</p>`;
  ph.innerHTML = str;
}

//---------------------------------------------------------------------//

//------------------------------Modal Fuctions------------------------------//
function ClosePostModalF() {
  $("#PostModal").fadeOut(500);
}
function CloseChatModal() {
  $("#ChatContainer").fadeOut(200);
  $("#postPH").fadeIn(300);
  $("#btnplus").fadeIn(300);
  initt = false;
}

function ShowNotifications() {
  $("#PushNot").animate({ top: "35px", opacity: 1 }, 1000);

  setTimeout(CloseNotification, 5000);
}

function CloseNotification() {
  $("#PushNot").animate({ top: "-55px", opacity: 0 }, 200);
}

function OpenChatModal(id) {
  console.log(id);
  PrivateIDtoSend = id;
  RenderToChatPH(allmsg);

  if (id == USER.Id) {
    swal("Error", `cant chat with yourself !`, "error");
  } else {
    $("#postPH").fadeOut(250);
    $("#UsersContainer").fadeOut(250);
    $("#btnplus").fadeOut(200);
    $("#ChatContainer").fadeIn(250);
    initt = true;
    document
      .getElementById("ChatPH")
      .scrollTo(0, document.getElementById("ChatPH").scrollHeight);
  }
}

function openUsersModal() {
  RenderToUsersPH();
  $("#UsersContainer").fadeIn(500);
}

function CloseUserModal() {
  $("#UsersContainer").fadeOut(250);
}
function openModal() {
  $("#PostModal").fadeIn(750);
}
//---------------------------------------------------------------------//
