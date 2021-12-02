import './style.css';

const notehandler = (() => {
    const createNote = function(title, description, dueDate, priority, notes, checklist) {
        defaultProject.items.push({title, description, dueDate, priority, notes, checklist});
    }
    function removeNote(noteID) {
        defaultProject.items.splice(noteID, 1);
        domhandler.updateNoteLibrary();
    }
    function updateDone(noteID) {
        if(defaultProject.items[noteID].checklist === false) {
            defaultProject.items[noteID].checklist = true;
        } else if(defaultProject.items[noteID].checklist === true) {
            defaultProject.items[noteID].checklist = false;
        }
        domhandler.updateNoteLibrary();
    }
    return {createNote, removeNote, updateDone};
})();

const projecthandler = (() => {
    const createProject = function(name, items) {
        return {name, items};
    }
    return {createProject};
})();
const defaultProject = projecthandler.createProject('Default', []);

const domhandler = (() => {
    const createNoteListener = (() => {
        const addNoteButton = document.querySelector('.add-note');
        const titleInput = document.querySelector('#title');
        const descInput = document.querySelector('#desc');
        const dueInput = document.querySelector('#due');
        const prioInput = document.querySelector('#prio');
        addNoteButton.addEventListener('click', () => {
            notehandler.createNote(titleInput.value, descInput.value, dueInput.value, prioInput.value, '', false);
            updateNoteLibrary();
        });
    })();
    function updateNoteLibrary() {
        const noteHolder = document.querySelector('.notes');
        noteHolder.querySelectorAll('div').forEach(removeExisting => removeExisting.remove());
        for(let i = 0; i < defaultProject.items.length; i++) {
            const newNoteDOM = document.createElement('div');
            newNoteDOM.setAttribute('note-id', i);
            const headerContainer = document.createElement('div');
            headerContainer.classList.add('note-header-container');
            const bodyContainer = document.createElement('div');
            const optionsContainer = document.createElement('div');
            optionsContainer.classList.add('note-options-container');
            bodyContainer.classList.add('note-body-container');
            newNoteDOM.appendChild(headerContainer);
            newNoteDOM.appendChild(bodyContainer);
            newNoteDOM.appendChild(optionsContainer);
            const noteTitle = document.createElement('h2');
            noteTitle.classList.add('note-title');
            noteTitle.textContent = defaultProject.items[i].title;
            headerContainer.appendChild(noteTitle);
            const noteDesc = document.createElement('p');
            noteDesc.classList.add('note-desc');
            noteDesc.textContent = defaultProject.items[i].description;
            bodyContainer.appendChild(noteDesc);
            const noteDue = document.createElement('p');
            noteDue.textContent = `Due ${defaultProject.items[i].dueDate}`;
            bodyContainer.appendChild(noteDue);
            const priority = document.createElement('div');
            priority.classList.add('prio-circle');
            if(defaultProject.items[i].priority === 'low') {
                priority.style.backgroundColor = 'green';
            } else if(defaultProject.items[i].priority === 'medium') {
                priority.style.backgroundColor = 'rgb(189, 189, 4)';
            } else if(defaultProject.items[i].priority === 'high') {
                priority.style.backgroundColor = 'red';
            }
            headerContainer.appendChild(priority);
            const removeButton = document.createElement('button');
            removeButton.classList.add('remove-note-button');
            removeButton.textContent = 'X';
            removeButton.style.visibility = 'hidden';
            const checklistButton = document.createElement('div');
            checklistButton.classList.add('check-note');
            if(defaultProject.items[i].checklist === false){
                checklistButton.textContent = '';
            } else if(defaultProject.items[i].checklist === true) {
                checklistButton.textContent = '✔';
            }
            optionsContainer.appendChild(checklistButton);
            optionsContainer.appendChild(removeButton);
            newNoteDOM.classList.add('note');
            noteHolder.appendChild(newNoteDOM);
        }
        removeButtonHandler();
        checkBoxHandler();
    }
    function removeButtonHandler() {
        const getNotes = document.querySelectorAll('.note');
        getNotes.forEach(note => note.addEventListener('mouseenter', () => {
            const removeButton = note.querySelector('.remove-note-button');
            removeButton.style.visibility = 'visible';
        }));
        getNotes.forEach(note => note.addEventListener('mouseleave', () => {
            const removeButton = note.querySelector('.remove-note-button');
            removeButton.style.visibility = 'hidden';
        }))
        const getRemoveButtons = document.querySelectorAll('.remove-note-button');
        getRemoveButtons.forEach(button => button.addEventListener('click', () => {
            notehandler.removeNote(button.closest('.note').getAttribute('note-id'));
        }))
    }
    function checkBoxHandler() {
        const getTicks = document.querySelectorAll('.check-note');
        getTicks.forEach(tick => tick.addEventListener('click', () => {
            notehandler.updateDone(tick.closest('.note').getAttribute('note-id'));
        }));
    }
    return {updateNoteLibrary};
})();