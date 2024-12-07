window.onload = function () {
    getEvent();
}

const url ="https://cors-anywhere-49h7.onrender.com/" + "http://openapi.seoul.go.kr:8088/706968566f6b61643735746a6b7378/json/culturalEventInfo/1/1000"

let dataDiv = document.getElementById("dataDiv");
let watchButton = document.getElementById("what");
let gu = document.getElementById("gu");

async function getEvent() {
    const respon = await fetch(url);
    var data =  await respon.json();

    console.log(data);

    let eventList = data.culturalEventInfo.row;
    let gus = gu.options[gu.selectedIndex].value;

    for (var i = 0; i < eventList.length; i++) {
        if(gus == eventList[i].CODENAME) {
            var div = document.createElement("div");
            div.innerHTML = '<div class="card" style="width: 18rem;">'+
            '<img class="card-img-top" src='+ eventList[i].MAIN_IMG+">"+
            "<br>* 제목:   "+ eventList[i].TITLE+
            "<br>* 공연기간:   "+ eventList[i].DATE+
            "<br>* 공연장:   "+ eventList[i].PLACE+
            "<br>* <a href="+ eventList[i].ORG_LINK+" target=blank>"
            +"홈페이지 바로가기   " +"</a><br>";

            if (dataDiv.childElementCount == 0) {
                dataDiv.appendChild(div);
            }
            else {
                dataDiv.insertBefore(div, dataDiv.firstChild);
            }
        }
    }
} 

watchButton.addEventListener("click", () => {
    getEvent()
})