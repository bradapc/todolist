import './style.css';

const notehandler = (() => {
    const createNote = function(title, description, dueDate, priority, notes, checklist) {
        defaultProject.items.push({title, description, dueDate, priority, notes, checklist});
    }
    return {createNote};
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
            notehandler.createNote(titleInput.value, descInput.value, dueInput.value, prioInput.value);
            updateNoteLibrary();
        });
    })();
    function updateNoteLibrary() {
        const noteHolder = document.querySelector('.notes');
        noteHolder.querySelectorAll('div').forEach(removeExisting => removeExisting.remove());
        for(let i = 0; i < defaultProject.items.length; i++) {
            const newNoteDOM = document.createElement('div');
            const headerContainer = document.createElement('div');
            headerContainer.classList.add('note-header-container');
            const bodyContainer = document.createElement('div');
            bodyContainer.classList.add('note-body-container');
            newNoteDOM.appendChild(headerContainer);
            newNoteDOM.appendChild(bodyContainer);
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
            newNoteDOM.classList.add('note');
            noteHolder.appendChild(newNoteDOM);
        }
    }
    return {updateNoteLibrary};
})();