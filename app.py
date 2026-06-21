from fastapi import FastAPI, UploadFile, File
from analyzer import analyze_dashboard
import os
from fastapi.responses import HTMLResponse

app = FastAPI()

results = [] 
 
os.makedirs("screenshots", exist_ok=True)
 
 
@app.post("/upload-screenshot")
async def upload_screenshot(file: UploadFile = File(...)):
 
    filepath = f"screenshots/{file.filename}"
 
    with open(filepath, "wb") as f:
        f.write(await file.read())
 
    analysis = analyze_dashboard(filepath)
 
    results.append({
        "image": filepath,
        "analysis": analysis
    })
 
    return {
        "status": "success",
        "image": filepath,
        "analysis": analysis
    }
 
 

@app.get("/", response_class=HTMLResponse)
def dashboard():
 
    html = """
    <html>
 
    <head>
 
        <title>Qlik Dashboard Insights</title>
 
        <style>
 
            body {
                font-family: Arial, sans-serif;
                margin: 30px;
                background: #f4f6f8;
            }
 
            h1 {
                color: #222;
            }
 
            .card {
                background: white;
                padding: 20px;
                margin-bottom: 20px;
                border-radius: 12px;
                box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            }
 
            .title {
                font-size: 20px;
                font-weight: bold;
                margin-bottom: 10px;
                color: #1f4e79;
            }
 
            .analysis {
                white-space: pre-wrap;
                line-height: 1.6;
                font-size: 15px;
            }
 
        </style>
 
    </head>
 
    <body>
 
        <h1>📊 Qlik Dashboard Insights</h1>
 
    """
    for i, r in enumerate(results, start=1):
 
        analysis = r["analysis"]
 
        analysis = analysis.replace("###", "")
        analysis = analysis.replace("**", "")
        analysis = analysis.replace("---", "")
 
        html += f"""
 
        <div class="card">
 
            <div class="title">
                Dashboard {i}
            </div>
 
            <div class="analysis">
                {analysis}
            </div>
 
        </div>
 
        """
 
 
    html += """
 
    </body>
 
    </html>
 
    """
 
    return HTMLResponse(content=html)


 

 