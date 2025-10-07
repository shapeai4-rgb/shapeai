# PowerShell script to initialize git and push to GitHub
$ErrorActionPreference = "Stop"

# Set UTF-8 encoding
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$OutputEncoding = [System.Text.Encoding]::UTF8

# Project path
$projectPath = "D:\OneDrive - Double K OU\Web-Dev\Витрины\shapeai.co.uk"

Write-Host "Checking if project directory exists..."
if (Test-Path $projectPath) {
    Write-Host "Project directory found: $projectPath"
    
    # Change to project directory
    Set-Location $projectPath
    Write-Host "Current directory: $(Get-Location)"
    
    # Check if git is initialized
    if (Test-Path ".git") {
        Write-Host "Git repository already initialized"
        git status
    } else {
        Write-Host "Initializing git repository..."
        git init
        git remote add origin https://github.com/shapeai4-rgb/shapeai.git
    }
    
    # Add all files
    Write-Host "Adding files to git..."
    git add .
    
    # Commit changes
    Write-Host "Committing changes..."
    git commit -m "fix: Add proper links to Terms/Privacy Policy and fix modal switching

- Fixed Terms and Privacy Policy links in Sign up modal to point to actual legal pages
- Fixed modal switching between Sign up and Log in modes
- Added onModeChange prop to AuthModal component
- Updated all AuthModal usages to support mode switching"
    
    # Push to GitHub
    Write-Host "Pushing to GitHub..."
    git branch -M main
    git push -u origin main
    
    Write-Host "Successfully pushed to GitHub!"
    
} else {
    Write-Host "Project directory not found: $projectPath"
    Write-Host "Available directories in OneDrive:"
    Get-ChildItem "D:\OneDrive - Double K OU\Web-Dev" -Directory | Select-Object Name
}