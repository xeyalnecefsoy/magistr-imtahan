Add-Type -AssemblyName PresentationCore
$sourceDir = "extracted_images"
$files = Get-ChildItem "$sourceDir/*.wdp"

if ($files.Count -eq 0) {
    Write-Host "No .wdp files found."
    exit
}

Write-Host "Found $($files.Count) .wdp files. Converting..."

foreach ($file in $files) {
    try {
        $outPath = $file.FullName -replace '\.wdp$', '.png'
        
        # skip if already exists
        if (Test-Path $outPath) {
            continue
        }

        $stream = [System.IO.File]::OpenRead($file.FullName)
        $decoder = [System.Windows.Media.Imaging.BitmapDecoder]::Create($stream, [System.Windows.Media.Imaging.BitmapCreateOptions]::PreservePixelFormat, [System.Windows.Media.Imaging.BitmapCacheOption]::Default)
        $bitmap = $decoder.Frames[0]
        $encoder = New-Object System.Windows.Media.Imaging.PngBitmapEncoder
        $encoder.Frames.Add([System.Windows.Media.Imaging.BitmapFrame]::Create($bitmap))
        $outStream = [System.IO.File]::Create($outPath)
        $encoder.Save($outStream)
        $outStream.Close()
        $stream.Close()
        # Write-Host "." -NoNewline
    } catch {
        Write-Host "Error converting $($file.Name): $_"
    }
}
Write-Host "Conversion complete."
