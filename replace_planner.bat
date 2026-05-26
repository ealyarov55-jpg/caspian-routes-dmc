@echo off
cd /d "d:\Projects\caspian-next.worktrees\agents-project-overview-request"
REM Replace the old planner page with the new simple version
powershell -Command "Get-Content 'src\app\[locale]\planner\page-backup.tsx' | Set-Content 'src\app\[locale]\planner\page.tsx'"
dir "src\app\[locale]\planner\page.tsx"
