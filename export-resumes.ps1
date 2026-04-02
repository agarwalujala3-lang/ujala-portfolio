$ErrorActionPreference = "Stop"

$workspace = Split-Path -Parent $MyInvocation.MyCommand.Path
$edgePath = Join-Path ${env:ProgramFiles(x86)} "Microsoft\Edge\Application\msedge.exe"

if (-not (Test-Path -LiteralPath $edgePath)) {
  throw "Microsoft Edge was not found at $edgePath"
}

$exports = @(
  @{ Source = "Ujala_Agarwal_Resume_ATS.html"; Output = "Ujala_Agarwal_Resume.pdf" },
  @{ Source = "Ujala_Agarwal_Resume_Cloud.html"; Output = "Ujala_Agarwal_Resume_Cloud.pdf" },
  @{ Source = "Ujala_Agarwal_Resume_Frontend.html"; Output = "Ujala_Agarwal_Resume_Frontend.pdf" },
  @{ Source = "Ujala_Agarwal_Resume_Software.html"; Output = "Ujala_Agarwal_Resume_Software.pdf" }
)

$profileRoot = Join-Path $workspace ".edge-resume-export"

if (Test-Path -LiteralPath $profileRoot) {
  Remove-Item -LiteralPath $profileRoot -Recurse -Force
}

New-Item -ItemType Directory -Path $profileRoot | Out-Null

try {
  foreach ($export in $exports) {
    $sourcePath = Join-Path $workspace $export.Source
    $outputPath = Join-Path $workspace $export.Output
    $profileDir = Join-Path $profileRoot ([System.IO.Path]::GetFileNameWithoutExtension($export.Output))
    $sourceUri = ([System.Uri]::new($sourcePath).AbsoluteUri) + "?export=1"

    New-Item -ItemType Directory -Path $profileDir | Out-Null

    if (Test-Path -LiteralPath $outputPath) {
      Remove-Item -LiteralPath $outputPath -Force
    }

    $args = @(
      "--headless=new",
      "--disable-gpu",
      "--no-first-run",
      "--run-all-compositor-stages-before-draw",
      "--virtual-time-budget=2500",
      "--print-to-pdf-no-header",
      "--user-data-dir=$profileDir",
      "--print-to-pdf=$outputPath",
      $sourceUri
    )

    $process = Start-Process -FilePath $edgePath -ArgumentList $args -WindowStyle Hidden -PassThru -Wait

    if ($process.ExitCode -ne 0) {
      throw "Resume export failed for $($export.Source) with exit code $($process.ExitCode)"
    }

    if (-not (Test-Path -LiteralPath $outputPath)) {
      throw "Resume export did not produce $($export.Output)"
    }
  }
}
finally {
  if (Test-Path -LiteralPath $profileRoot) {
    Remove-Item -LiteralPath $profileRoot -Recurse -Force
  }
}

Write-Host "Resume PDFs exported successfully."
