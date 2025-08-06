document.addEventListener('DOMContentLoaded', () => {
    const todoInput = document.getElementById('todo-input');
    const addButton = document.getElementById('add-button');
    const todoList = document.getElementById('todo-list');
    const showPanelButton = document.getElementById('show-panel-button');
    const closePanelButton = document.getElementById('close-panel-button');
    const outputPanel = document.getElementById('output-panel');
    const outputContent = document.getElementById('output-content');
    const exportCsvButton = document.getElementById('export-csv-button'); // CSV出力ボタンの要素を取得

    // ローカルストレージからタスクを読み込む
    let todos = JSON.parse(localStorage.getItem('todos')) || [];

    // Todos配列を元にリストをレンダリングする
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

    // 出力パネルにデータを表示する（QRコードも生成）
    function renderOutputPanel() {
        outputContent.innerHTML = '';
        const todos = JSON.parse(localStorage.getItem('todos')) || [];
        todos.forEach((todo, index) => {
            const div = document.createElement('div');
            div.className = `data-item ${todo.completed ? 'completed' : ''}`;
            
            // タスク情報をまとめる
            const taskInfo = `タスク: ${todo.text}, 完了状態: ${todo.completed ? '完了' : '未完了'}`;
            const textSpan = document.createElement('span');
            textSpan.textContent = taskInfo;
            
            // QRコードを表示する要素
            const qrCodeDiv = document.createElement('div');
            qrCodeDiv.id = `qrcode-${index}`;
            qrCodeDiv.className = 'qrcode'; // CSSでスタイルを当てるためのクラス
            
            div.appendChild(textSpan);
            div.appendChild(qrCodeDiv); // QRコード要素を追加
            
            outputContent.appendChild(div);
            
            // QRコードを生成
            new QRCode(document.getElementById(`qrcode-${index}`), {
                text: taskInfo,
                width: 80,
                height: 80
            });
        });
    }

    // パネルを表示する
    showPanelButton.addEventListener('click', () => {
        renderOutputPanel(); // パネルにデータを表示
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

    // CSV出力ボタンのクリックイベント
    exportCsvButton.addEventListener('click', () => {
        let csvContent = "タスク,完了状態\n";
        const todos = JSON.parse(localStorage.getItem('todos')) || [];
        todos.forEach(todo => {
            const status = todo.completed ? "完了" : "未完了";
            csvContent += `"${todo.text}","${status}"\n`;
        });

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'todo-list.csv';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    });

    // 初期表示
    renderTodos();
});
