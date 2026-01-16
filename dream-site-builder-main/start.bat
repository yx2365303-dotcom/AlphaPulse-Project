@echo off
echo ========================================
echo  AlphaPulse 网站启动脚本
echo ========================================
echo.

cd /d "c:\Users\Lenovo\Documents\Obsidian Vault\AlphaPulse Project\dream-site-builder-main"

echo 检查 node_modules...
if not exist "node_modules" (
    echo 首次运行，正在安装依赖...
    call npm install
) else (
    echo 依赖已安装
)

echo.
echo ========================================
echo  启动开发服务器...
echo ========================================
echo.
echo 网站将在浏览器中自动打开
echo 按 Ctrl+C 停止服务器
echo.

call npm run dev

pause
