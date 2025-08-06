/*
 * スクリプトファイル
 * ToDoリストの主要な機能（追加、削除、完了、編集、保存）
 * と、その他インタラクティブな要素（アニメーション、パネル表示）を管理する
 */
document.addEventListener('DOMContentLoaded', () => {
    const todoInput = document.getElementById('todo-input');
    const addButton = document.getElementById('add-button');
    const todoList = document.getElementById('todo-list');
    const showPanelButton = document.getElementById('show-panel-button');
    const closePanelButton = document.getElementById('close-panel-button');
    const outputPanel = document.getElementById('output-panel');
    const outputContent = document.getElementById('output-content');
    
    // 絞り込みボタン
    const filterButtons = document.querySelectorAll('.filter-area button');

    // 進捗状況
    const progressText = document.getElementById('progress-text');
    let currentFilter = 'all';

    let todos = JSON.parse(localStorage.getItem('todos')) || [];

    // Todos配列を元にリストをレンダリングする
    function renderTodos() {
        todoList.innerHTML = '';
        const filteredTodos = todos.filter(todo => {
            if (currentFilter === 'all') return true;
            if (currentFilter === 'incomplete') return !todo.completed;
            if (currentFilter === 'completed') return todo.completed;
        });

        filteredTodos.forEach((todo, index) => {
            const li = document.createElement('li');
            li.className = `todo-item ${todo.completed ? 'completed' : ''}`;
            
            const span = document.createElement('span');
            span.className = 'task-text';
            span.textContent = todo.text;
            
            // タスク編集機能
            span.addEventListener('click', () => {
                if (!li.classList.contains('editing')) {
                    startEdit(li, todo, index);
                }
            });
            
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
        updateProgress();
    }
    
    // タスク編集機能の開始
    function startEdit(li, todo, index) {
        li.classList.add('editing');
        const input = document.createElement('input');
        input.type = 'text';
        input.value = todo.text;
        
        const saveButton = document.createElement('button');
        saveButton.textContent = '保存';
        saveButton.className = 'save-button';
        saveButton.addEventListener('click', () => {
            saveEdit(input, index);
        });
        
        li.innerHTML = '';
        li.appendChild(input);
        li.appendChild(saveButton);
        input.focus();
    }

    // タスク編集内容の保存
    function saveEdit(input, index) {
        todos[index].text = input.value.trim();
        saveAndRender();
    }

    // 進捗状況の更新
    function updateProgress() {
        const total = todos.length;
        const completed = todos.filter(todo => todo.completed).length;
        progressText.textContent = `タスクの進捗状況：${completed} / ${total}`;
    }

    // タスク完了時の紙吹雪アニメーション
    function launchConfetti() {
        confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 }
        });
    }

    // 出力パネルにデータを表示する
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

    // パネルを表示する
    showPanelButton.addEventListener('click', () => {
        renderOutputPanel();
        outputPanel.classList.add('is-visible');
    });

    // パネルを閉じる
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
        if (todos[index].completed) {
            launchConfetti();
        }
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

    // 絞り込みボタンのクリックイベント
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            currentFilter = button.id.replace('show-', '');
            renderTodos();
        });
    });

    renderTodos();
});
