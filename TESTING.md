# Testing the Website

## Quick Test (Simplest Method)

1. **Double-click `index.html`** - This will open it directly in your default browser
2. The website should load with all interviews displayed

⚠️ Note: Opening directly via file:// may show CORS warnings in the console, but the website will still work since the data is hardcoded.

## Better Test (Using a Local Server)

For a better testing experience (especially if you plan to load files dynamically), use a local web server:

### Option 1: Python (Easiest - if you have Python installed)

Open PowerShell in this directory and run:

```powershell
# Python 3
python -m http.server 8000

# Or Python 2
python -m SimpleHTTPServer 8000
```

Then open your browser and go to: **http://localhost:8000**

### Option 2: Node.js (if you have Node.js installed)

```powershell
npx http-server -p 8000
```

Then open: **http://localhost:8000**

### Option 3: VS Code Live Server Extension

1. Install the "Live Server" extension in VS Code
2. Right-click on `index.html`
3. Select "Open with Live Server"

## Testing Features

Once the website loads, try:

- ✅ **Search**: Type "spark" in the search box
- ✅ **Filter by Company**: Select "EXL" or "Publicis Sapient" from the dropdown
- ✅ **Filter by Role**: Select a role from the role dropdown
- ✅ **Clear Filters**: Click the "Clear" button to reset all filters
- ✅ **Statistics**: Check that the stats show 2 interviews and 2 companies
- ✅ **Responsive**: Resize your browser window to test mobile view

## Stopping the Server

If you started a local server:
- Press `Ctrl + C` in the terminal/PowerShell window

