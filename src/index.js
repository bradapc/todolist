import './style.css';

const notehandler = (() => {
    const createNote = function(title, description, dueDate, priority, notes, checklist) {
        return {title, description, dueDate, priority, notes, checklist};
    }
    return {createNote};
})();

const projecthandler = (() => {
    const createProject = function(name, items) {
        return {name, items};
    }
    return {createProject};
    const defaultProject = createProject('Default Project');
})();

const domhandler = (() => {

})();