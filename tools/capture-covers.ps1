<#
  Gera as capas dos projetos tirando um print da página inicial de cada site.

  Lê os campos "url" e "image" de assets/js/projects.js, abre cada site no
  Chrome (ou Edge) em modo headless, tira um print em 1280x800 e salva uma
  versão otimizada de 800x500 em JPEG no caminho indicado em "image".

  Uso (no PowerShell, na pasta do projeto):
    powershell -ExecutionPolicy Bypass -File tools\capture-covers.ps1
    powershell -ExecutionPolicy Bypass -File tools\capture-covers.ps1 -Only niwa   # só um projeto

  Requer Windows com Google Chrome ou Microsoft Edge instalado.
#>
param(
  [string]$Only = "",
  [int]$Quality = 78
)

$ErrorActionPreference = "Stop"
Add-Type -AssemblyName System.Drawing

$root = Split-Path $PSScriptRoot -Parent
$browser = @(
  "$env:ProgramFiles\Google\Chrome\Application\chrome.exe",
  "${env:ProgramFiles(x86)}\Microsoft\Edge\Application\msedge.exe",
  "$env:ProgramFiles\Microsoft\Edge\Application\msedge.exe"
) | Where-Object { Test-Path $_ } | Select-Object -First 1
if (-not $browser) { throw "Chrome ou Edge não encontrado." }

$source = Get-Content (Join-Path $root "assets\js\projects.js") -Raw -Encoding UTF8
$entries = [regex]::Matches($source, 'url:\s*"([^"]+)",\s*image:\s*"([^"]+)"')

$tmp = Join-Path $env:TEMP "sv-covers"
New-Item -ItemType Directory -Force $tmp | Out-Null

$jpegCodec = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq "image/jpeg" }
$encParams = New-Object System.Drawing.Imaging.EncoderParameters 1
$encParams.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter ([System.Drawing.Imaging.Encoder]::Quality), ([long]$Quality)

foreach ($entry in $entries) {
  $url = $entry.Groups[1].Value
  $image = $entry.Groups[2].Value
  if ($Only -and ($image -notlike "*$Only*")) { continue }

  $png = Join-Path $tmp ([IO.Path]::GetFileNameWithoutExtension($image) + ".png")
  if (Test-Path $png) { Remove-Item $png }
  Write-Host "Capturando $url ..."

  $args = @(
    "--headless=new", "--disable-gpu", "--hide-scrollbars", "--mute-audio",
    "--no-first-run", "--window-size=1280,800", "--virtual-time-budget=12000",
    "--user-data-dir=`"$tmp\profile`"", "--screenshot=`"$png`"", $url
  )
  $proc = Start-Process -FilePath $browser -ArgumentList $args -PassThru -WindowStyle Hidden
  if (-not $proc.WaitForExit(60000)) { $proc.Kill(); Write-Warning "Tempo esgotado: $url"; continue }
  if (-not (Test-Path $png)) { Write-Warning "Falha ao capturar: $url"; continue }

  $out = Join-Path $root $image
  New-Item -ItemType Directory -Force (Split-Path $out -Parent) | Out-Null

  $src = [System.Drawing.Image]::FromFile($png)
  $bmp = New-Object System.Drawing.Bitmap 800, 500
  $g = [System.Drawing.Graphics]::FromImage($bmp)
  $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
  $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
  $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
  $g.DrawImage($src, 0, 0, 800, 500)
  $bmp.Save($out, $jpegCodec, $encParams)
  $g.Dispose(); $bmp.Dispose(); $src.Dispose()

  "{0,-45} {1,6:N0} KB" -f $image, ((Get-Item $out).Length / 1KB) | Write-Host
}
