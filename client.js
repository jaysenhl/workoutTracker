// Components
const restartBtnComponent = document.getElementById('restartBtnComponent')
const exerciseInputComponent = document.getElementById('exerciseInputComponent')
const exerciseListComponent = document.getElementById('exerciseListComponent')
const restTimerFormComponent = document.getElementById('restTimerFormComponent')
const restTimerComponent = document.getElementById('restTimerComponent')

//Buttons
const addExerciseBtn = document.getElementById('addExerciseBtn')
const resetBtn = document.getElementById('resetBtn')
const addToListBtn = document.getElementById('addToListBtn')
const completedBtn = document.getElementById('completedBtn')
const deleteBtn = document.getElementById('deleteBtn')
const hideShowBtn = document.getElementById('hideShowBtn')
const showTimerBtn = document.getElementById('showTimerBtn')
const addTimeBtn = document.getElementById('addTimeBtn')
const startTimerBtn = document.getElementById('startTimerBtn')

// Inputs
const exerciseNameInput = document.getElementById('exerciseNameInput')
const machineTypeInput = document.getElementById('machineTypeInput')
const repetitionInput = document.getElementById('repetitionInput')
const weightInput = document.getElementById('weightInput')

exerciseInputComponent.style.display = 'none'
hideShowBtn.style.visibility = 'hidden'
restTimerFormComponent.style.display = 'none'
restTimerComponent.style.display = 'none'

let totalTimeSeconds = 0;
let initialTime = 0;

const alarmSound = new Audio('alarm.mp3')
alarmSound.preload = 'auto';

addExerciseBtn.addEventListener('click',()=>{
    exerciseInputComponent.style.display = 'block'
    addExerciseBtn.style.display = 'none'
    hideShowBtn.style.visibility = 'visible'
})

hideShowBtn.addEventListener('click',()=>{
    if(exerciseInputComponent.style.display === 'none' || exerciseInputComponent.style.display === ''){
        exerciseInputComponent.style.display = 'block'
        //hideShowBtn.textContent = 'Hide Form'; 
        hideShowBtn.innerHTML = 'Hide Form <i class="fa-solid fa-eye-slash"></i>'
    }else{
        exerciseInputComponent.style.display = 'none'
        hideShowBtn.textContent = 'Show Form'; 
        hideShowBtn.innerHTML = 'Show Form <i class="fa-solid fa-eye"></i>'
    }
})

resetBtn.addEventListener('click',()=> location.reload())

showTimerBtn.addEventListener('click',()=>{
    if(restTimerFormComponent.style.display === 'none' || restTimerFormComponent.style.display === ''){
        restTimerFormComponent.style.display = 'block'
       // showTimerBtn.textContent = 'Hide Timer'; 
        showTimerBtn.innerHTML = 'Hide Timer <i class="fa-solid fa-stopwatch-20"></i>'
    }else{
        restTimerFormComponent.style.display = 'none'
       // showTimerBtn.textContent = 'Edit Timer'; 
       showTimerBtn.innerHTML = 'Edit Timer <i class="fa-solid fa-stopwatch-20"></i>'

    }
})

addTimeBtn.addEventListener('click', () => {
    const minutes = parseInt(document.getElementById('minutes').value) || 0;
    const seconds = parseInt(document.getElementById('seconds').value) || 0;
    totalTimeSeconds = minutes * 60 + seconds;
    initialTime = totalTimeSeconds;  // Almacenar el tiempo total
    showTimerBtn.textContent = 'Edit Timer'; 

    restTimerFormComponent.style.display = 'none';
    restTimerComponent.style.display = 'block';
    document.getElementById('timerText').textContent = `${minutes} minute ${seconds} seconds `;
});

function setProgress(percent) {
    const circle = document.getElementById('timerCircle');
    const radius = circle.r.baseVal.value;
    const circumference = 2 * Math.PI * radius;
    const offset = ((100 - percent) / 100) * circumference;

    circle.style.strokeDasharray = `${circumference}`;
    circle.style.strokeDashoffset = offset;

    // Actualiza el texto dentro del círculo SVG
    const svgTimerText = document.getElementById('svgTimerText');
    const minutes = Math.floor(totalTimeSeconds / 60);
    const seconds = totalTimeSeconds % 60;
    svgTimerText.textContent = `${minutes}:${seconds}`;
}

startTimerBtn.addEventListener('click', () => {
    totalTimeSeconds = initialTime;  // Reiniciar a tiempo total al comenzar

    clearInterval(window.timerInterval);

    window.timerInterval = setInterval(() => {
        if (totalTimeSeconds <= 0) {
            clearInterval(window.timerInterval);
            document.getElementById('svgTimerText').textContent = "Time's up!";
            Swal.fire({
                title: "Time's Up!",
                text: "Rest Time is Finished!",
                icon: "success"
              });

            alarmSound.play()
            return;
        }

        totalTimeSeconds -= 1;
        const minutes = Math.floor(totalTimeSeconds / 60);
        const seconds = totalTimeSeconds % 60;
        document.getElementById('svgTimerText').textContent = `${minutes} minute(s) ${seconds} second(s)`;

        const percent = (totalTimeSeconds / initialTime) * 100;
        setProgress(percent);
    }, 1000);
});

// Initialize exercise count and table
let exerciseCount = 0;
let tableComponent = document.createElement('table');
tableComponent.setAttribute('id', 'exerciseListTable');
tableComponent.classList.add('table', 'table-dark', 'align-middle')
tableComponent.style.display = 'none'
const thead = document.createElement('thead');
thead.classList.add('table-light');
const trowDetails = document.createElement('tr');
const details = ['#', "Exercise", 'Type', 'Repetitions', 'Weight', 'Complete A Set', 'Total Sets', 'Total Reps', 'Delete'];
details.forEach(detail => {
    const th = document.createElement('th');
    th.classList.add('table-dark')
    th.textContent = detail;
    trowDetails.appendChild(th);
});

thead.appendChild(trowDetails);
tableComponent.appendChild(thead);
exerciseListComponent.appendChild(tableComponent);

// Add exercises to the list
addToListBtn.addEventListener('click', () => {
    tableComponent.style.display = 'block'
    const exercise = exerciseNameInput.value;
    const machineType = machineTypeInput.value;
    const repetitions = repetitionInput.value;
    const weight = weightInput.value;

    if (tableComponent.rows.length <= 1) {
        exerciseCount = 0;
    }

    exerciseCount = tableComponent.rows.length - 1;

    addToRows(tableComponent,exerciseCount + 1,exercise,machineType,repetitions,weight)
    renumberRows()
});

// Event delegation for the delete button
exerciseListComponent.addEventListener('click', (event) => {
    if (event.target.classList.contains('fa-trash-can')) {
        const row = event.target.closest('tr');
        row.remove();
        renumberRows(); // Renumerar las filas después de eliminar una
        
        if (tableComponent.rows.length <= 1) {
            exerciseCount = 0;
        }
    }
});

// Event delegation for the complete button
exerciseListComponent.addEventListener('click', (event) => {
    if (event.target.classList.contains('completedBtn')) {
        const row = event.target.closest('tr');
        let totalSetsCell = row.cells[6];
        let totalRepsCell = row.cells[7];
        const reps = parseInt(row.cells[3].textContent);
        totalSetsCell.textContent = parseInt(totalSetsCell.textContent) + 1;
        totalRepsCell.textContent = parseInt(totalRepsCell.textContent) + reps;
    }
});

function addToRows(table,exerCount,exer,machine,reps,weig){
    const row = table.insertRow();
    row.innerHTML = `
        <td>${exerCount}</td>
        <td>${exer}</td>
        <td>${machine}</td>
        <td>${reps}</td>
        <td>${weig} Lib</td>
        <td><button id="completedBtn" class="completedBtn">Complete <i class="fa-regular fa-circle-check"></i></button></td>
        <td>0</td>
        <td>0</td>
        <td><button id="deleteBtn" class="deleteBtn"><i class="fa-regular fa-trash-can"></i></button></td>
    `;

    exerciseNameInput.value = '';
    machineTypeInput.value = '';
    repetitionInput.value = '';
    weightInput.value = '';
}

function renumberRows() {
    const rows = tableComponent.rows;
    // Comienza en 1 para saltar la fila del encabezado de la tabla
    for (let i = 1; i < rows.length; i++) {
        rows[i].cells[0].textContent = i;
    }
}

