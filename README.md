# Daily Desk (Tauri + React + TypeScript + Tailwind)

一个全新的 Windows 桌面效率应用（非基于当前静态网页改造），支持每日记录、Todo、全局快捷键、托盘恢复与本地离线存储。

## 功能清单

- 按日期记录每日内容（今日记录 + 历史日期查看）
- Todo List：添加、完成、删除
- 今日任务和历史任务分区展示
- 默认窗口置顶（always on top）
- 主界面隐藏按钮（一键隐藏）
- 全局快捷键唤醒：`Ctrl + Alt + Space`
- 系统托盘支持：隐藏后可从托盘点击或菜单恢复
- 本地数据存储（`localStorage`，离线可用）
- 极简 Apple-ish 视觉：大留白、圆角、半透明、柔和阴影

## 项目结构

```text
.
├─ index.html
├─ package.json
├─ postcss.config.js
├─ tailwind.config.js
├─ tsconfig.json
├─ vite.config.ts
├─ src/
│  ├─ App.tsx
│  ├─ main.tsx
│  └─ styles.css
└─ src-tauri/
   ├─ Cargo.toml
   ├─ build.rs
   ├─ tauri.conf.json
   └─ src/
      ├─ lib.rs
      └─ main.rs
```

## Windows 本地运行

### 1) 安装依赖

- Node.js 18+
- Rust（stable）
- Visual Studio 2022 Build Tools（勾选 C++ 构建工具）
- WebView2 Runtime（大部分 Win11 已预装）

### 2) 安装前端依赖

```bash
npm install
```

### 3) 启动开发模式

```bash
npm run tauri dev
```

## 打包成 .exe

```bash
npm run tauri build
```

打包产物通常位于：

- `src-tauri/target/release/bundle/`（含 NSIS/MSI 等）
- 可执行文件位于对应 bundle 子目录中。

## 使用说明

- 在输入框中输入文本：
  - 点击“记为今日记录”会保存到所选日期记录。
  - 点击“添加任务”会加入今日 Todo。
- Todo 可勾选完成，或删除。
- 关闭窗口不会退出，而是隐藏到托盘。
- 使用快捷键 `Ctrl + Alt + Space` 可随时唤起主窗口。
