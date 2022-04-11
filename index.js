const remove = document.getElementById('remove');
const appHeader = document.getElementById('app-header');
const scorecard = document.getElementById('scorecard1');


function getCourses(){
    return fetch('https://golf-courses-api.herokuapp.com/courses').then(
        function(response) {
            return response.json();
        }
    )
}
// load course picture and name cards
async function loadCourses() {
    let appInfo = await getCourses();
    console.log(appInfo);
    let newString = '';
    appInfo.courses.forEach((course, idx) => {
      newString +=  `<li class="course-select" id="course${course.id}">
                        <img id="golf" class="golf" src="${course.image}" onclick="course1()">
                        <h3 id="course-name${idx}" class="course-name">${course.name}</h3>
                        <h2 class="select" id="${course.id}" onclick="course(${idx})">Select</h2>
                    </li>`;
    });
    remove.innerHTML = newString;
}
loadCourses();

// change appheader to course name

function changeName(id) {
    let name = document.getElementById('course-name' + id).innerText;
    appHeader.innerText = name;
}
function course(id) {
    displayNothing();
    changeName(id);
}
//this function removes the golf course pictures
function displayNothing() {
    remove.classList.add('nothing');
    remove.classList.remove('remove');
}

//displays scorecard 
function displayScoreCard() {
    scorecard.style.display = 'block';
}


//course tabel data
function tableData(id){
    return fetch(`https://golf-courses-api.herokuapp.com/courses/${id}`).then(
        function(response) {
            return response.json();
        }
    )
}
async function loadTableData(id) {
    let response = await tableData(id);
    let parOut = 0;
    let parIn = 0;
    console.log(response);
    for (let i = 0; i < 18; i++){
        document.getElementById(`par${i+1}`).innerText = response.data.holes[i].teeBoxes[0].par;
        if (i < 9) {
            parOut = parOut + response.data.holes[i].teeBoxes[0].par; 
            document.getElementById('parOut').innerText = parOut;
        }
        else {
            parIn = parIn + response.data.holes[i].teeBoxes[0].par;
            document.getElementById('parIn').innerText = parIn;
        }
    }
    for (let i = 0; i < 18; i++) {
        document.getElementById(`handicap${i+1}`).innerText = response.data.holes[i].teeBoxes[0].hcp;
    }
}


//add player to table
const addPlayerButton = document.getElementById('add-player');
const table = document.getElementById('table1');
function addPlayer() {
    let playerNumber = playerCount();
    let row = table.insertRow(-1);
    for (let i = 0; i < 23; i++) {
        let tableCell = row.insertCell(i);
        tableCell.id = "cell-" + playerNumber + "-" + i;
        tableCell.className = "inputNumbers";
        tableCell.contentEditable = "true";
        document.getElementById(tableCell.id).addEventListener('blur', updateScore);
    }
    document.getElementById("cell-" + playerNumber + "-0").innerText = "Player Name";

}
addPlayerButton.addEventListener('click', addPlayer);

function playerCount() {
    let rowCount = document.getElementsByTagName('tr').length - 3;
    return rowCount;
}
playerCount();

//out and in sum
function updateScore(event) {
    let playerId = event.currentTarget.id;
    let playerNum = playerId[5];
    let outTotal = 0;
    let inTotal = 0
    let regex = /^\d+$/;
    for (let i = 1; i < 10; i++) {
        let newNumber = document.getElementById(`cell-${playerNum}-${i}`).innerText;
        if (newNumber != '' && regex.test(newNumber)) {
            outTotal = outTotal + parseInt(newNumber); 
        }
        else {
            document.getElementById(`cell-${playerNum}-${i}`).innerText = '';
        }
    }
    for (let i = 12; i < 20; i++) {
        let newNumber = document.getElementById(`cell-${playerNum}-${i}`).innerText;
        if (newNumber != '' && regex.test(newNumber)) {
            inTotal = inTotal + parseInt(newNumber);
        }
        else {
            document.getElementById(`cell-${playerNum}-${i}`).innerText = '';
        }
    }
    document.getElementById(`cell-${playerNum}-10`).innerText = outTotal;
    document.getElementById(`cell-${playerNum}-21`).innerText = inTotal;
    document.getElementById(`cell-${playerNum}-22`).innerText = outTotal + inTotal;
}

//body event listener

document.body.addEventListener('click', (e) => {
    if (e.target.className == 'select') {
        displayScoreCard();
        loadTableData(e.target.id);
        console.log(e.target.id);
    }
    
});

