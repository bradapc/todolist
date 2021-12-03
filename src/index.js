import './style.css';
import TrashIcon from './trash.png';

const projecthandler = (() => {
    let projects = [];
    let currentProjectID = 0;
    const createProject = function(name, items) {
        return {name, items};
    }
    function addProject(project) {
        projects.push(project);
    }
    function switchProject(projectID) {
        projecthandler.currentProjectID = projectID;
        domhandler.updateProjectLibrary();
        domhandler.updateNoteLibrary();
    }
    function deleteProject(projectID) {
        projecthandler.projects.splice(projectID, 1);
        switchProject(0);
    }
    return {createProject, addProject, projects, currentProjectID, switchProject, deleteProject};
})();
const defaultProject = projecthandler.createProject('Default Project', []);
projecthandler.addProject(defaultProject);
const projectTwo = projecthandler.createProject('Project Two', []);
projecthandler.addProject(projectTwo);

const notehandler = (() => {
    const createNote = function(title, description, dueDate, priority, notes, checklist) {
        if(title.length >= 1 && description.length >= 1 && dueDate.length >= 1) {
            projecthandler.projects[projecthandler.currentProjectID].items.push({title, description, dueDate, priority, notes, checklist});
            domhandler.clearNoteFields();
        } else {
            alert('Please fill out all fields before adding a note.');
        }
    }
    function removeNote(noteID) {
        projecthandler.projects[projecthandler.currentProjectID].items.splice(noteID, 1);
        domhandler.updateNoteLibrary();
    }
    function updateDone(noteID) {
        if(projecthandler.projects[projecthandler.currentProjectID].items[noteID].checklist === false) {
            projecthandler.projects[projecthandler.currentProjectID].items[noteID].checklist = true;
        } else if(projecthandler.projects[projecthandler.currentProjectID].items[noteID].checklist === true) {
            projecthandler.projects[projecthandler.currentProjectID].items[noteID].checklist = false;
        }
        domhandler.updateNoteLibrary();
    }
    function updatePrio(noteID) {
        if(projecthandler.projects[projecthandler.currentProjectID].items[noteID].priority === 'low') {
            projecthandler.projects[projecthandler.currentProjectID].items[noteID].priority = 'medium';
        } else if(projecthandler.projects[projecthandler.currentProjectID].items[noteID].priority === 'medium') {
            projecthandler.projects[projecthandler.currentProjectID].items[noteID].priority = 'high';
        } else if(projecthandler.projects[projecthandler.currentProjectID].items[noteID].priority === 'high') {
            projecthandler.projects[projecthandler.currentProjectID].items[noteID].priority = 'low';
        }
        domhandler.updateNoteLibrary();
    }
    return {createNote, removeNote, updateDone, updatePrio};
})();

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
        for(let i = 0; i < projecthandler.projects[projecthandler.currentProjectID].items.length; i++) {
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
            noteTitle.textContent = projecthandler.projects[projecthandler.currentProjectID].items[i].title;
            headerContainer.appendChild(noteTitle);
            const noteDesc = document.createElement('p');
            noteDesc.classList.add('note-desc');
            noteDesc.textContent = projecthandler.projects[projecthandler.currentProjectID].items[i].description;
            bodyContainer.appendChild(noteDesc);
            const noteDue = document.createElement('p');
            noteDue.textContent = `Due ${projecthandler.projects[projecthandler.currentProjectID].items[i].dueDate}`;
            bodyContainer.appendChild(noteDue);
            const priority = document.createElement('div');
            priority.classList.add('prio-circle');
            if(projecthandler.projects[projecthandler.currentProjectID].items[i].priority === 'low') {
                priority.style.backgroundColor = 'green';
            } else if(projecthandler.projects[projecthandler.currentProjectID].items[i].priority === 'medium') {
                priority.style.backgroundColor = 'rgb(189, 189, 4)';
            } else if(projecthandler.projects[projecthandler.currentProjectID].items[i].priority === 'high') {
                priority.style.backgroundColor = 'red';
            }
            headerContainer.appendChild(priority);
            const removeButton = document.createElement('button');
            removeButton.classList.add('remove-note-button');
            removeButton.textContent = 'X';
            removeButton.style.visibility = 'hidden';
            const checklistButton = document.createElement('div');
            checklistButton.classList.add('check-note');
            if(projecthandler.projects[projecthandler.currentProjectID].items[i].checklist === false){
                checklistButton.textContent = '';
            } else if(projecthandler.projects[projecthandler.currentProjectID].items[i].checklist === true) {
                checklistButton.textContent = '✔';
            }
            optionsContainer.appendChild(checklistButton);
            optionsContainer.appendChild(removeButton);
            newNoteDOM.classList.add('note');
            noteHolder.appendChild(newNoteDOM);
        }
        removeButtonHandler();
        checkBoxHandler();
        priorityHandler();
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
    function priorityHandler() {
        const getPrio = document.querySelectorAll('.prio-circle');
        getPrio.forEach(prio => prio.addEventListener('click', () => {
            notehandler.updatePrio(prio.closest('.note').getAttribute('note-id'))
        }));
    }
    function updateProjectLibrary() {
        const projectTitle = document.querySelector('.manager-title');
        projectTitle.textContent = projecthandler.projects[projecthandler.currentProjectID].name;
        const projectContainer = document.querySelector('.projects-list');
        projectContainer.querySelectorAll('div').forEach(remove => remove.remove());
        for(let i = 0; i < projecthandler.projects.length; i++) {
            const projectDIV = document.createElement('div');
            projectDIV.classList.add('project');
            projectDIV.textContent = projecthandler.projects[i].name;
            projectDIV.setAttribute('project-id', i);
            projectDIV.addEventListener('click', () => projecthandler.switchProject(projectDIV.getAttribute('project-id')));
            projectContainer.appendChild(projectDIV);
        }
        const addProjectButton = document.querySelector('.add-project');
        addProjectButton.addEventListener('click', addProjectPopup);
        projectRemoveHandler();
    }
    updateProjectLibrary();
    function addProjectPopup() {
        const proj = document.querySelector('.project-input');
        const style = window.getComputedStyle(proj).getPropertyValue('display');
        if(style == 'none') {
            proj.style.display = 'flex';
        } else if(style == 'flex') {
            proj.style.display = 'none';
        }
        const projectAddConfirm = document.querySelector('.project-add-confirm');
        projectAddConfirm.addEventListener('click', confirmAddProject)
    }
    function confirmAddProject() {
        const projText = document.querySelector('#proj');
        if(projText.value.length >= 1 && projText.value.length <= 20) {
            const newProj = projecthandler.createProject(projText.value, []);
            projecthandler.addProject(newProj);
            projText.value = '';
            document.querySelector('.project-input').style.display = 'none';
        } else {
            alert('Please enter a name between 1 and 20 characters');
        }
        updateProjectLibrary();
    }
    function clearNoteFields() {
        const inputfields = document.querySelectorAll('input');
        inputfields.forEach(clear => clear.value = '');
    }
    function projectRemoveHandler() {
        const projDiv = document.querySelectorAll('.project');
        projDiv.forEach(proj => proj.addEventListener('mouseenter', () => {
            const deleteProj = document.createElement('div');
            deleteProj.classList.add('delete-proj');
            const trashIcon = new Image();
            trashIcon.src = TrashIcon;
            trashIcon.style.width = '18px';
            trashIcon.style.height = '18px';
            deleteProj.appendChild(trashIcon);
            proj.appendChild(deleteProj);
            deleteProj.addEventListener('click', () => {
                projecthandler.deleteProject(deleteProj.closest('.project').getAttribute('project-id'));
            })
        }));
        projDiv.forEach(proj => proj.addEventListener('mouseleave', () => {
            const deleteProj = document.querySelector('.delete-proj')
            deleteProj.remove();
        }))
    }
    return {updateNoteLibrary, updateProjectLibrary, clearNoteFields};
})();