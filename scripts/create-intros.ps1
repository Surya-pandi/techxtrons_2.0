param([Parameter(Mandatory = $true)][string]$FFmpegPath)
$ErrorActionPreference = 'Stop'
$outputRoot = [System.IO.Path]::GetFullPath((Join-Path $PSScriptRoot '..\public\videos'))
$fontPath = (Join-Path $env:WINDIR 'Fonts\arialbd.ttf').Replace('\','/').Replace(':','\:')
New-Item -ItemType Directory -Force -Path $outputRoot | Out-Null
foreach ($variant in @(@{Name='desktop';Width=1280;Height=720;TitleSize=95;SmallSize=16}, @{Name='mobile';Width=720;Height=1280;TitleSize=58;SmallSize=14})) {
 $videoSize = '{0}x{1}' -f $variant.Width,$variant.Height
 $titleSize = $variant.TitleSize
 $smallSize = $variant.SmallSize
 $filter = "drawbox=x=iw*0.12:y=ih*0.62:w=iw*0.76:h=7:color=0xF2D600:t=fill,drawtext=fontfile='$fontPath':text='DEPARTMENT OF INFORMATION TECHNOLOGY':fontcolor=0xB6B6B0:fontsize=$smallSize`:x=(w-tw)/2:y=h*0.35,drawtext=fontfile='$fontPath':text='TECHXTRONS 2.0':fontcolor=0xF2D600:fontsize=$titleSize`:x=(w-tw)/2:y=(h-th)/2,drawbox=x=iw*0.50:y=ih*0.62:w=iw*0.38:h=7:color=0xFF4B16:t=fill,drawtext=fontfile='$fontPath':text='2026  /  PLACEHOLDER INTRO':fontcolor=0xA6A69E:fontsize=$smallSize`:x=(w-tw)/2:y=h*0.69,fade=t=in:st=0:d=0.5:color=0x080808,fade=t=out:st=2.5:d=0.7:color=0x080808"
 $output = Join-Path $outputRoot ($variant.Name + '-intro.mp4')
 & $FFmpegPath -hide_banner -loglevel error -y -f lavfi -i "color=c=0x080808:s=$videoSize`:r=30:d=3.2" -vf $filter -c:v libx264 -preset fast -crf 25 -pix_fmt yuv420p -movflags +faststart -an $output
 if ($LASTEXITCODE -ne 0) { throw 'Intro generation failed.' }
}
