// Components
const restartBtnComponent = document.getElementById('restartBtnComponent')
const exerciseInputComponent = document.getElementById('exerciseInputComponent')
const exerciseListComponent = document.getElementById('exerciseListComponent')

//Buttons
const addExerciseBtn = document.getElementById('addExerciseBtn')
const resetBtn = document.getElementById('resetBtn')
const addToListBtn = document.getElementById('addToListBtn')
const completedBtn = document.getElementById('completedBtn')
const deleteBtn = document.getElementById('deleteBtn')

// Inputs
const exerciseNameInput = document.getElementById('exerciseNameInput')
const machineTypeInput = document.getElementById('machineTypeInput')
const repetitionInput = document.getElementById('repetitionInput')
const weightInput = document.getElementById('weightInput')

exerciseInputComponent.style.display = 'none'

addExerciseBtn.addEventListener('click',()=>{
    exerciseInputComponent.style.display = 'block'
})

resetBtn.addEventListener('click',()=> location.reload())

// Initialize exercise count and table
let exerciseCount = 0;
let tableComponent = document.createElement('table');
tableComponent.setAttribute('id', 'exerciseListTable');
tableComponent.classList.add('table', 'table-dark', 'table-borderless', 'align-middle')
tableComponent.style.display = 'none'
const thead = document.createElement('thead');
thead.classList.add('table-light');
const trowDetails = document.createElement('tr');
const details = ['#', "Exercise", 'Type', 'Repetitions', 'Weight', 'Complete', 'Total Sets', 'Total Reps', 'Delete'];
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

    exerciseCount++;

    addToRows(tableComponent,exerciseCount,exercise,machineType,repetitions,weight)

});

// Event delegation for the delete button
exerciseListComponent.addEventListener('click', (event) => {
    if (event.target.classList.contains('deleteBtn')) {
        const row = event.target.closest('tr');
        row.remove();
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
        <td>${weig}</td>
        <td><button id="completedBtn" class="completedBtn">Completed</button></td>
        <td>0</td>
        <td>${reps}</td>
        <td><button id="deleteBtn" class="deleteBtn">Delete</button></td>
    `;

    exerciseNameInput.value = '';
    machineTypeInput.value = '';
    repetitionInput.value = '';
    weightInput.value = '';
}

