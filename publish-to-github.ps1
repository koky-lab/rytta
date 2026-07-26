param(
  [string]$RepoName = "rytta",
  [switch]$Private
)

$ErrorActionPreference = "Stop"

if (-not (Get-Command gh -ErrorAction SilentlyContinue)) {
  Write-Host "GitHub CLI no esta en el PATH. Instalandolo con winget..."
  winget install --id GitHub.cli --source winget --silent --accept-package-agreements --accept-source-agreements
  $env:Path = [Environment]::GetEnvironmentVariable("Path", "Machine") + ";" + [Environment]::GetEnvironmentVariable("Path", "User")
}

if (-not (Test-Path ".git")) {
  git init
  git branch -M main
}

git config user.name "ealva"
git config user.email "ealva@users.noreply.github.com"

if ((git status --short).Length -gt 0) {
  git add .
  git commit -m "Update DnD campaign atlas app"
}

gh auth status 2>$null
if ($LASTEXITCODE -ne 0) {
  gh auth login --web --git-protocol https
}

$visibility = if ($Private) { "--private" } else { "--public" }
$remoteExists = git remote get-url origin 2>$null

if (-not $remoteExists) {
  gh repo create $RepoName $visibility --source . --remote origin --push
} else {
  git push -u origin main
}

$repoFullName = gh repo view --json nameWithOwner --jq ".nameWithOwner"
try {
  gh api --method POST "repos/$repoFullName/pages" -f "source[branch]=main" -f "source[path]=/"
} catch {
  Write-Host "GitHub Pages ya estaba activo o GitHub todavia esta procesando el repositorio."
}

Write-Host ""
Write-Host "Repositorio listo:"
gh repo view --web
