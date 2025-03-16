// App.tsx (放在项目根目录)
import React from 'react';
import MainApp from './app/(tabs)/index'; 
// ↑ 假设你真正的业务逻辑入口文件叫 MainApp.tsx 或 index.tsx

export default function App() {
  return <MainApp />;
}
