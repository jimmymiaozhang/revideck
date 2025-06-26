# Restore all backup files
Write-Host "Starting backup restoration process..." -ForegroundColor Green

# Get all backup files excluding node_modules
$backupFiles = Get-ChildItem -Recurse -Filter "*.backup.*" | Where-Object { $_.FullName -notlike "*node_modules*" }

foreach ($backupFile in $backupFiles) {
    # Determine the original file name
    $originalName = $backupFile.Name -replace "\.backup\.", "." -replace "\.backup$", ""
    $originalPath = Join-Path $backupFile.Directory.FullName $originalName
    
    # Handle special backup file formats
    if ($backupFile.Name.StartsWith(".backup.")) {
        $originalName = $backupFile.Name.Substring(8)
        $originalPath = Join-Path $backupFile.Directory.FullName $originalName
    }
    elseif ($backupFile.Name.EndsWith(".backup")) {
        $originalName = $backupFile.Name.Substring(0, $backupFile.Name.Length - 7)
        $originalPath = Join-Path $backupFile.Directory.FullName $originalName
    }
    
    try {
        Copy-Item $backupFile.FullName $originalPath -Force
        Write-Host "✓ Restored: $originalName" -ForegroundColor Yellow
    }
    catch {
        Write-Host "✗ Failed to restore: $($backupFile.Name)" -ForegroundColor Red
        Write-Host "  Error: $($_.Exception.Message)" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "Backup restoration completed!" -ForegroundColor Green
