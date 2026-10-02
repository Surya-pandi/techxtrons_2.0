Add-Type -AssemblyName System.Drawing
$assetRoot = [System.IO.Path]::GetFullPath((Join-Path $PSScriptRoot '..\public\images'))
New-Item -ItemType Directory -Force (Join-Path $assetRoot 'placeholders') | Out-Null
function Save-Art([string]$Name, [int]$Width, [int]$Height, [string]$Kind) {
 $bitmap = New-Object System.Drawing.Bitmap($Width, $Height)
 $g = [System.Drawing.Graphics]::FromImage($bitmap)
 $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
 $g.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAliasGridFit
 $g.Clear([System.Drawing.Color]::Transparent)
 $ink = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255,38,39,36))
 $yellow = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255,245,196,0))
 $muted = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255,139,140,131))
 if ($Kind -eq 'logo') {
  $g.FillRectangle($ink,0,0,$Width,$Height)
  $font = New-Object System.Drawing.Font('Arial',($Width * 0.25),[System.Drawing.FontStyle]::Bold)
  $g.DrawString('DA',$font,$yellow,($Width * 0.12),($Height * 0.17))
  $small = New-Object System.Drawing.Font('Arial',($Width * 0.06))
  $g.DrawString('PLACEHOLDER',$small,$yellow,($Width * 0.12),($Height * 0.72))
  $font.Dispose(); $small.Dispose()
 } elseif ($Kind -eq 'poster') {
  $g.Clear([System.Drawing.Color]::FromArgb(245,245,240))
  $pen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(221,222,213),1)
  for ($i = 0; $i -lt $Width; $i += 40) { $g.DrawLine($pen,$i,0,$i,$Height) }
  for ($i = 0; $i -lt $Height; $i += 40) { $g.DrawLine($pen,0,$i,$Width,$i) }
  $g.FillRectangle($yellow,($Width * 0.46),($Height * 0.28),($Width * 0.08),($Width * 0.08))
  $font = New-Object System.Drawing.Font('Arial',($Width * 0.032),[System.Drawing.FontStyle]::Bold)
  $format = New-Object System.Drawing.StringFormat; $format.Alignment = [System.Drawing.StringAlignment]::Center
  $rect = New-Object System.Drawing.RectangleF(0,($Height * 0.50),$Width,100)
  $g.DrawString('[ IMAGE PLACEHOLDER ]',$font,$muted,$rect,$format)
  $font.Dispose(); $format.Dispose(); $pen.Dispose()
 }
 $target = Join-Path $assetRoot $Name
 $bitmap.Save($target,[System.Drawing.Imaging.ImageFormat]::Png)
 $ink.Dispose(); $yellow.Dispose(); $muted.Dispose(); $g.Dispose(); $bitmap.Dispose()
}
Save-Art 'logo.png' 180 180 'logo'
Save-Art 'placeholders\department-logo.png' 800 600 'poster'
Save-Art 'placeholders\event-placeholder.png' 1000 700 'poster'

