import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import 'tdesign-react/es/style/index.css';
import './index.css'
import './theme.css'
import {$app} from "./app/app";

// 监听系统深浅色模式变化
const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

// 初始化主题
const setThemeBySystem = () => {
  if ($app.isAutoTheme()) {
    $app.setTheme(darkModeMediaQuery.matches ? 'dark' : 'light', true);
  }
};

// 首次设置主题
setThemeBySystem();

// 添加系统主题变化的监听
darkModeMediaQuery.addEventListener('change', (e) => {
  setThemeBySystem();
});


ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App/>
  </React.StrictMode>
)

$app.showVersion();
// $app.registerServiceWorker()

// 可以在控制台通过以下命令手动切换主题：
// $app.setTheme('dark', false) - 切换到深色模式并禁用自动跟随系统
// $app.setTheme('light', false) - 切换到浅色模式并禁用自动跟随系统
// $app.setTheme('dark', true) 或 $app.setTheme('light', true) - 重新启用自动跟随系统
