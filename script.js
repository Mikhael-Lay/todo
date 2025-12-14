let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
let activeDate = 'ALL';
let showDone = false;

const timeEl = document.getElementById('time');
const taskList = document.getElementById('taskList');
const dateTabs = document.getElementById('dateTabs');
const sheet = document.getElementById('sheet');
const showTodoBtn = document.getElementById('showTodo');
const showDoneBtn = document.getElementById('showDone');

/* TIME */
function updateTime() {
  const now = new Date();
  const days = ['Minggu','Senin','Selasa','Rabu','Kamis','Jumat','Sabtu'];
  timeEl.innerHTML = `<div>${days[now.getDay()]}, ${now.toLocaleDateString('en-US')}</div><div>${now.toLocaleTimeString('en-US')}</div>`;
}
setInterval(updateTime, 1000); updateTime();

function todayStr() {
  return new Date().toISOString().split('T')[0];
}

/* OPEN / CLOSE SHEET */
document.getElementById('openAdd').onclick = () => sheet.classList.add('show');
sheet.onclick = e => { if (e.target === sheet) sheet.classList.remove('show'); };

/* ADD TASK */
document.getElementById('addTaskBtn').onclick = () => {
  if (!taskText.value || !taskDate.value) return;
  tasks.push({
    id: Date.now(),
    text: taskText.value,
    date: taskDate.value,
    priority: taskPriority.value,
    done: false
  });
  taskText.value = '';
  sheet.classList.remove('show');
  save();
};

/* TOGGLE */
showTodoBtn.onclick = () => toggle(false);
showDoneBtn.onclick = () => toggle(true);

function toggle(val) {
  showDone = val;
  showTodoBtn.classList.toggle('active', !val);
  showDoneBtn.classList.toggle('active', val);
  render();
}

/* RENDER */
function render() {
  const dates = [...new Set(tasks.map(t => t.date))];
  dateTabs.innerHTML = '';

  const allBtn = document.createElement('button');
    allBtn.className = 'date-btn all' + (activeDate === 'ALL' ? ' active' : '');
    allBtn.textContent = 'All';
    allBtn.onclick = () => {
    activeDate = 'ALL';
    render();
    };

dateTabs.appendChild(allBtn);

  dates.forEach(d => {
    const btn = document.createElement('button');
    btn.className = 'date-btn' + (d === activeDate ? ' active' : '');
    btn.textContent = d;
    btn.onclick = () => { activeDate = d; render(); };
    dateTabs.appendChild(btn);
  });

  if (!activeDate && dates.length) activeDate = dates[0];

  taskList.innerHTML = '';
    tasks.filter(t =>
    (activeDate === 'ALL' || t.date === activeDate) &&
    t.done === showDone)
      .forEach(t => {
      const li = document.createElement('li');
      li.className = 'task-item';

      const left = document.createElement('div');

      const main = document.createElement('div');
      main.className = 'task-main';

      const cb = document.createElement('input');
      cb.type = 'checkbox';
      cb.checked = t.done;
      cb.onchange = () => { t.done = cb.checked; save(); };

      const text = document.createElement('div');
      text.className = 'task-text';
      text.textContent = t.text;
      if (t.done) text.classList.add('done');

      main.append(cb, text);

      const meta = document.createElement('div');
      meta.className = 'task-meta';

      const badge = document.createElement('span');
      badge.className = `badge ${t.priority}`;
      badge.textContent = t.priority;
      meta.appendChild(badge);

      const today = new Date().toISOString().split('T')[0];
      if (!t.done && t.date < today) {
        const overdue = document.createElement('span');
        overdue.className = 'overdue';
        overdue.textContent = 'overdue';
        meta.appendChild(overdue);
      }

      left.append(main, meta);

      const del = document.createElement('button');
      del.className = 'delete';
      del.textContent = '✕';
      del.onclick = () => {
        tasks = tasks.filter(x => x.id !== t.id);
        save();
      };

      li.append(left, del);
      taskList.appendChild(li);
    });

    const today = todayStr();

    // Priority (todo only)
    ['low','medium','high','urgent'].forEach(p => {
    document.getElementById(p + 'Count').textContent =
        tasks.filter(t => t.priority === p && !t.done).length;
    });

    // Overdue
    document.getElementById('overdueCount').textContent =
    tasks.filter(t => !t.done && t.date < today).length;

    // To Do
    document.getElementById('todoCount').textContent =
    tasks.filter(t => !t.done).length;

    // Done
    document.getElementById('doneCount').textContent =
    tasks.filter(t => t.done).length;

    // All
    document.getElementById('allCount').textContent = tasks.length;

    }

/* DELETE ALL */
document.getElementById('deleteAllBtn').onclick = () => {
  if (activeDate === 'ALL') {
  tasks = [];
} else {
  tasks = tasks.filter(t => t.date !== activeDate);
}
activeDate = 'ALL';
  activeDate = null;
  save();
};

function save() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
  render();
}

render();