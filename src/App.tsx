import { useMemo, useState } from 'react';
import { hide } from '@tauri-apps/api/app';

type Todo = {
  id: string;
  content: string;
  done: boolean;
  date: string;
};

type DayRecord = {
  date: string;
  note: string;
};

const today = () => new Date().toISOString().slice(0, 10);

function App() {
  const [date, setDate] = useState(today());
  const [quickInput, setQuickInput] = useState('');
  const [records, setRecords] = useState<DayRecord[]>(() => {
    return JSON.parse(localStorage.getItem('records') ?? '[]');
  });
  const [todos, setTodos] = useState<Todo[]>(() => {
    return JSON.parse(localStorage.getItem('todos') ?? '[]');
  });

  const currentRecord = useMemo(() => records.find((r) => r.date === date), [records, date]);
  const todayTodos = todos.filter((t) => t.date === today());
  const historyTodos = todos.filter((t) => t.date !== today());

  const persist = (nextRecords: DayRecord[], nextTodos: Todo[]) => {
    localStorage.setItem('records', JSON.stringify(nextRecords));
    localStorage.setItem('todos', JSON.stringify(nextTodos));
  };

  const saveRecord = () => {
    if (!quickInput.trim()) return;
    const next = [...records.filter((r) => r.date !== date), { date, note: quickInput.trim() }].sort((a, b) =>
      a.date < b.date ? 1 : -1
    );
    setRecords(next);
    persist(next, todos);
    setQuickInput('');
  };

  const addTodo = () => {
    if (!quickInput.trim()) return;
    const nextTodos = [
      ...todos,
      { id: crypto.randomUUID(), content: quickInput.trim(), done: false, date: today() }
    ];
    setTodos(nextTodos);
    persist(records, nextTodos);
    setQuickInput('');
  };

  const toggleTodo = (id: string) => {
    const next = todos.map((t) => (t.id === id ? { ...t, done: !t.done } : t));
    setTodos(next);
    persist(records, next);
  };

  const removeTodo = (id: string) => {
    const next = todos.filter((t) => t.id !== id);
    setTodos(next);
    persist(records, next);
  };

  return (
    <main className="min-h-screen p-8 text-slate-700">
      <section className="mx-auto max-w-3xl rounded-3xl border border-white/60 bg-white/70 p-8 shadow-soft backdrop-blur-md">
        <header className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-slate-900">Daily Desk</h1>
            <p className="mt-1 text-sm text-slate-500">极简每日记录与待办</p>
          </div>
          <button onClick={() => hide()} className="rounded-xl bg-slate-900 px-4 py-2 text-sm text-white">
            隐藏窗口
          </button>
        </header>

        <div className="mb-6 grid gap-4 md:grid-cols-[1fr,auto,auto]">
          <input
            type="text"
            value={quickInput}
            onChange={(e) => setQuickInput(e.target.value)}
            placeholder="快速输入：今天做了什么 / 新任务"
            className="rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none focus:ring"
          />
          <button onClick={saveRecord} className="rounded-2xl border border-slate-200 px-4 py-3">记为今日记录</button>
          <button onClick={addTodo} className="rounded-2xl bg-slate-900 px-4 py-3 text-white">添加任务</button>
        </div>

        <div className="mb-8">
          <h2 className="mb-3 text-lg font-medium text-slate-900">今日记录</h2>
          <div className="flex items-center gap-3">
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="rounded-xl border px-3 py-2" />
            <span className="text-sm text-slate-500">{currentRecord?.note ?? '暂无记录'}</span>
          </div>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          <section>
            <h2 className="mb-3 text-lg font-medium text-slate-900">今日 Todo</h2>
            <ul className="space-y-2">
              {todayTodos.map((todo) => (
                <li key={todo.id} className="flex items-center justify-between rounded-xl bg-white p-3">
                  <label className="flex items-center gap-2">
                    <input type="checkbox" checked={todo.done} onChange={() => toggleTodo(todo.id)} />
                    <span className={todo.done ? 'line-through text-slate-400' : ''}>{todo.content}</span>
                  </label>
                  <button onClick={() => removeTodo(todo.id)} className="text-sm text-rose-500">删除</button>
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-medium text-slate-900">历史任务</h2>
            <ul className="max-h-60 space-y-2 overflow-auto">
              {historyTodos.map((todo) => (
                <li key={todo.id} className="rounded-xl bg-white p-3 text-sm text-slate-600">
                  <p>{todo.content}</p>
                  <p className="mt-1 text-xs text-slate-400">{todo.date}</p>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </section>
    </main>
  );
}

export default App;
