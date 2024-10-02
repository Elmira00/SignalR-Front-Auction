const connection = new signalR.HubConnectionBuilder()
  .withUrl("https://localhost:7091/offers")
  .configureLogging(signalR.LogLevel.Information)
  .build();

const url = "https://localhost:7091/";
async function start() {
  try {
    await connection.start();

    const element = document.querySelector("#offerValue");
    $.get(url + "api/Offer", function (data, status) {
      console.log(data);
      element.innerHTML = "Begin price : " + data + "$";
    });

    console.log("SignalR Started");
  } catch (err) {
    console.log(err);
    setTimeout(() => {
      start();
    }, 5000);
  }
}

start();

let element = document.querySelector("#info");
connection.on("ReceiveConnectInfo", (message) => {
  // element.innerHTML=message;
});

let element2 = document.querySelector("#disconnectinfo");
connection.on("DisconnectInfo", (message) => {
  //element2.innerHTML=message;
});

connection.on("ReceiveMessage",(message,data)=>{
    let element=document.querySelector("#responseOfferValue");
    element.innerHTML=message+data+"$";
})
connection.on("RecieveReset",()=>{
    let time=document.querySelector('#time');
    time.innerHTML="Time : "+0;
    for (var i = 1; i < 99999; i++)
        window.clearInterval(i);
    let btn=document.querySelector('#bidBtn');
    btn.removeAttribute('disabled');
})
async function IncreaseOffer() {
    let user = document.querySelector("#user");
    let btn=document.querySelector('#bidBtn');
    let counter=10;
    let time=document.querySelector('#time');
    time.innerHTML="Time : "+counter;
    $.get(url + "api/Offer/Increase?data=100", function (data, status) {
        $.get(url + "api/Offer", function (data, status) {
            connection.invoke("SendMessage", user.value);
            connection.invoke("SendReset");
        });
    });
  btn.setAttribute('disabled','disabled');
  const myInterval=setInterval(function () {
    if (btn.getAttribute('disabled')=='disabled') {    
        time.innerHTML="Time : "+(--counter);
      }
  }, 1000);

  setTimeout(function () {
      btn.removeAttribute('disabled');
      clearInterval(myInterval);
      //alert(user.value+" WON ! ")
},10000)

}