document.addEventListener('DOMContentLoaded', () => {
    const todoInput = document.getElementById('todo-input');
    const addButton = document.getElementById('add-button');
    const todoList = document.getElementById('todo-list');
    const showPanelButton = document.getElementById('show-panel-button');
    const closePanelButton = document.getElementById('close-panel-button');
    const outputPanel = document.getElementById('output-panel');
    const outputContent = document.getElementById('output-content');

    let todos = JSON.parse(localStorage.getItem('todos')) || [];

    function renderTodos() {
        todoList.innerHTML = '';
        todos.forEach((todo, index) => {
            const li = document.createElement('li');
            li.className = `todo-item ${todo.completed ? 'completed' : ''}`;
            
            const span = document.createElement('span');
            span.textContent = todo.text;
            
            const toggleButton = document.createElement('button');
            toggleButton.textContent = todo.completed ? '未完了に戻す' : '完了';
            toggleButton.className = 'toggle-button';
            toggleButton.addEventListener('click', () => {
                toggleTodo(index);
            });

            const deleteButton = document.createElement('button');
            deleteButton.textContent = '削除';
            deleteButton.className = 'delete-button';
            deleteButton.addEventListener('click', () => {
                deleteTodo(index);
            });

            li.appendChild(span);
            li.appendChild(toggleButton);
            li.appendChild(deleteButton);
            todoList.appendChild(li);
        });
    }

    function renderOutputPanel() {
        outputContent.innerHTML = '';
        const todos = JSON.parse(localStorage.getItem('todos')) || [];
        todos.forEach(todo => {
            const div = document.createElement('div');
            div.className = `data-item ${todo.completed ? 'completed' : ''}`;
            
            const status = todo.completed ? '完了' : '未完了';
            div.textContent = `${todo.text} - ${status}`;
            
            outputContent.appendChild(div);
        });
    }

    showPanelButton.addEventListener('click', () => {
        renderOutputPanel();
        outputPanel.classList.add('is-visible');
    });

    closePanelButton.addEventListener('click', () => {
        outputPanel.classList.remove('is-visible');
    });
    
    function addTodo() {
        const text = todoInput.value.trim();
        if (text) {
            todos.push({ text, completed: false });
            todoInput.value = '';
            saveAndRender();
        }
    }
    
    function toggleTodo(index) {
        todos[index].completed = !todos[index].completed;
        saveAndRender();
    }
    
    function deleteTodo(index) {
        todos.splice(index, 1);
        saveAndRender();
    }
    
    function saveAndRender() {
        localStorage.setItem('todos', JSON.stringify(todos));
        renderTodos();
    }
    
    addButton.addEventListener('click', addTodo);
    todoInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addTodo();
        }
    });

    renderTodos();
});
