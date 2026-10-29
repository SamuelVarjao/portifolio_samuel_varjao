<#
  Gera a imagem de compartilhamento e os ícones a partir dos modelos:
    tools/og-image.html      → assets/img/og-image.png (1200x630)
    assets/img/favicon.svg   → assets/img/apple-touch-icon.png (180x180)
                             → assets/img/favicon-32.png (32x32)

  Uso: powershell -ExecutionPolicy Bypass -File tools\build-images.ps1
#>
$ErrorActionPreference = "Stop"
Add-Type -AssemblyName System.Drawing

$root = Split-Path $PSScriptRoot -Parent
$img = Join-Path $root "assets\img"
$browser = @(
  "$env:ProgramFiles\Google\Chrome\Application\chrome.exe",
  "${env:ProgramFiles(x86)}\Microsoft\Edge\Application\msedge.exe"
) | Where-Object { Test-Path $_ } | Select-Object -First 1
$tmp = Join-Path $env:TEMP "sv-images"
New-Item -ItemType Directory -Force $tmp | Out-Null

function Shot($url, $out, $w, $h) {
  if (Test-Path $out) { Remove-Item $out }
  $args = @("--headless=new", "--disable-gpu", "--hide-scrollbars", "--no-first-run",
    "--force-device-scale-factor=1", "--window-size=$w,$h", "--virtual-time-budget=6000",
    "--user-data-dir=`"$tmp\profile`"", "--screenshot=`"$out`"", $url)
  $p = Start-Process -FilePath $browser -ArgumentList $args -PassThru -WindowStyle Hidden
  $p.WaitForExit(60000) | Out-Null
}

function Resize($src, $out, $size) {
  $s = [System.Drawing.Image]::FromFile($src)
  $b = New-Object System.Drawing.Bitmap $size, $size
  $g = [System.Drawing.Graphics]::FromImage($b)
  $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
  $g.DrawImage($s, 0, 0, $size, $size)
  $b.Save($out, [System.Drawing.Imaging.ImageFormat]::Png)
  $g.Dispose(); $b.Dispose(); $s.Dispose()
}

# Imagem Open Graph
Shot ("file:///" + (Join-Path $PSScriptRoot "og-image.html").Replace("\", "/")) (Join-Path $img "og-image.png") 1200 630

# Ícones: ícone quadrado (sem cantos arredondados — o iOS arredonda sozinho)
$iconHtml = Join-Path $tmp "icon.html"
@"
<!doctype html><html><head><meta charset="utf-8">

<style>html,body{margin:0;width:512px;height:512px;background:#7cc4ff;display:grid;place-items:center;overflow:hidden}
b{font:700 220px/1 'Comic Sans MS','Comic Neue',cursive;color:#15170f}</style></head>
<body><b>SV</b></body></html>
"@ | Set-Content -Encoding UTF8 $iconHtml
$big = Join-Path $tmp "icon-512.png"
Shot ("file:///" + $iconHtml.Replace("\", "/")) $big 512 512
Resize $big (Join-Path $img "apple-touch-icon.png") 180
Resize $big (Join-Path $img "favicon-32.png") 32

Get-ChildItem $img -File | Format-Table Name, @{ n = "KB"; e = { [math]::Round($_.Length / 1KB, 1) } }
