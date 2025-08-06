/*
 * スクリプトファイル
 * ToDoリストの主要な機能（追加、削除、完了、保存）と、
 * その他インタラクティブな要素（アニメーション、パネル表示、絞り込み、進捗バー）を管理する
 */
document.addEventListener('DOMContentLoaded', () => {
    // HTML要素の取得
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

    // ローカルストレージからタスクを読み込む
    let todos = JSON.parse(localStorage.getItem('todos')) || [];

    // Todos配列を元にリストをレンダリングする
    function renderTodos() {
        todoList.innerHTML = '';
        // フィルターボタンの状態に応じてタスクを絞り込む
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
    
    // 進捗状況を更新する
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

    // パネルにデータを表示する
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
    
    // 新しいタスクを追加する
    function addTodo() {
        const text = todoInput.value.trim();
        if (text) {
            todos.push({ text, completed: false });
            todoInput.value = '';
            saveAndRender();
        }
    }
    
    // タスクの完了状態を切り替える
    function toggleTodo(index) {
        todos[index].completed = !todos[index].completed;
        if (todos[index].completed) {
            launchConfetti(); // 完了時に紙吹雪を出す
        }
        saveAndRender();
    }
    
    // タスクを削除する
    function deleteTodo(index) {
        todos.splice(index, 1);
        saveAndRender();
    }
    
    // Todos配列をローカルストレージに保存し、リストを再描画する
    function saveAndRender() {
        localStorage.setItem('todos', JSON.stringify(todos));
        renderTodos();
    }
    
    // ボタンクリックでタスク追加
    addButton.addEventListener('click', addTodo);
    // Enterキーでもタスク追加
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

    // 初期表示
    renderTodos();
});
