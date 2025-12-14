let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
let activeDate = null;
let showDone = false;

const timeEl = document.getElementById('time');
const taskList = document.getElementById('taskList');
const dateTabs = document.getElementById('dateTabs');
const sheet = document.getElementById('sheet');

// Time
function updateTime() {
  const now = new Date();
  const days = ['Minggu','Senin','Selasa','Rabu','Kamis','Jumat','Sabtu'];

  const dateStr = `${days[now.getDay()]}, ${now.toLocaleDateString('en-US')}`;
  const timeStr = now.toLocaleTimeString('en-US');

  timeEl.innerHTML = `
    <div>${dateStr}</div>
    <div>${timeStr}</div>
  `;
}
setInterval(updateTime, 1000); updateTime();

// Open / Close Sheet
document.getElementById('openAdd').onclick = () => sheet.classList.add('show');
sheet.onclick = e => { if (e.target === sheet) sheet.classList.remove('show'); };

// Add Task
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

// Toggle
document.getElementById('showTodo').onclick = () => toggle(false);
document.getElementById('showDone').onclick = () => toggle(true);

function toggle(val) {
  showDone = val;
  showTodo.classList.toggle('active', !val);
  showDoneBtn.classList.toggle('active', val);
  render();
}

// Render
function render() {
  const dates = [...new Set(tasks.map(t => t.date))];
  dateTabs.innerHTML = '';

  dates.forEach(d => {
    const btn = document.createElement('button');
    btn.className = 'date-btn' + (d === activeDate ? ' active' : '');
    btn.textContent = d;
    btn.onclick = () => { activeDate = d; render(); };
    dateTabs.appendChild(btn);
  });

  if (!activeDate && dates.length) activeDate = dates[0];

  taskList.innerHTML = '';
  tasks.filter(t => t.date === activeDate && t.done === showDone)
    .forEach(t => {
      const li = document.createElement('li');
      const left = document.createElement('div'); left.className = 'task-left';

      const cb = document.createElement('input'); cb.type = 'checkbox'; cb.checked = t.done;
      cb.onchange = () => { t.done = cb.checked; save(); };

      const span = document.createElement('span'); span.textContent = t.text;
      if (t.done) span.classList.add('done');

      const badge = document.createElement('span');
      badge.className = `badge ${t.priority}`;
      badge.textContent = t.priority;

      left.append(cb, span, badge);

      const del = document.createElement('button'); del.textContent = '✕'; del.className = 'delete';
      del.onclick = () => { tasks = tasks.filter(x => x.id !== t.id); save(); };

      li.append(left, del);
      taskList.appendChild(li);
    });

  ['low','medium','high','urgent'].forEach(p => {
    document.getElementById(p+'Count').textContent =
      tasks.filter(t => t.priority === p && !t.done).length;
  });
}

// Delete All
document.getElementById('deleteAllBtn').onclick = () => {
  tasks = tasks.filter(t => t.date !== activeDate);
  activeDate = null;
  save();
};

function save() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
  render();
}

render();