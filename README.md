# Web Scraper & Server (Node.js + Puppeteer + Flask)

This project scrapes a web page using Node.js (Puppeteer) and serves the data using Python (Flask) inside a multi-stage Docker container.

## Prerequisites
- Docker installed on your system.

## Project Structure
```
exactspace-assignment/
│── scrape.js            # Puppeteer scraper script
│── server.py            # Flask server script
│── package.json         # Node.js dependencies
│── requirements.txt     # Python dependencies
│── Dockerfile           # Multi-stage build Dockerfile
│── README.md            # Documentation
```

## Setup & Usage

### **Build the Docker Image**
```sh
docker build --build-arg SCRAPE_URL=https://example.com -t scraper-webserver .
```

### **Run the Container**
```sh
docker run -p 5000:5000 scraper-webserver
```

### **Access the Scraped Data**
Open a web browser and visit:
```
http://localhost:5000
```

You should see the scraped JSON data.

## Implementation Details

### **1. Scraper (`scrape.js`)**
This script:
- Uses **Puppeteer** to launch a headless browser.
- Accepts a URL via an **environment variable (`SCRAPE_URL`)**.
- Extracts the **page title** and **first heading (`h1`)**.
- Saves the data as **JSON**.

```javascript
const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
    const url = process.env.SCRAPE_URL || 'https://example.com';
    
    const browser = await puppeteer.launch({
        headless: "new",
        args: ["--no-sandbox", "--disable-setuid-sandbox"]
    });

    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'domcontentloaded' });

    // Extract data
    const data = await page.evaluate(() => {
        return {
            title: document.title,
            heading: document.querySelector('h1')?.innerText || 'No H1 found'
        };
    });

    await browser.close();

    // Save to JSON file
    fs.writeFileSync('scraped_data.json', JSON.stringify(data, null, 2));
    console.log('Scraping complete, data saved to scraped_data.json');
})();
```

### **2. Python Flask Server (`server.py`)**
This script:
- Reads `scraped_data.json`.
- Serves it as **JSON** on the root (`/`) endpoint.

```python
from flask import Flask, jsonify
import json
import os

app = Flask(__name__)

@app.route('/')
def serve_data():
    file_path = 'scraped_data.json'
    if os.path.exists(file_path):
        with open(file_path, 'r') as f:
            data = json.load(f)
        return jsonify(data)
    return jsonify({"error": "No scraped data found"}), 404

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
```

### **3. Multi-Stage Dockerfile (`Dockerfile`)**
This Dockerfile:
- Uses **Node.js (Puppeteer)** to scrape data.
- Uses **Python (Flask)** to serve the data.
- Optimizes build using **multi-stage Docker builds**.

```dockerfile
# First stage: Scraper
FROM node:18-slim AS scraper

# Install dependencies for Puppeteer
RUN apt-get update && apt-get install -y \
    chromium \
    && rm -rf /var/lib/apt/lists/*

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true

# Set working directory
WORKDIR /app

# Copy and install Node.js dependencies
COPY package.json ./
RUN npm install

# Copy scraper script
COPY scrape.js ./

# Define environment variable for the URL
ARG SCRAPE_URL
ENV SCRAPE_URL=$SCRAPE_URL

# Run the scraper
RUN node scrape.js

# Second stage: Web server
FROM python:3.10-slim

# Set working directory
WORKDIR /app

# Copy scraped data from previous stage
COPY --from=scraper /app/scraped_data.json .

# Copy and install Python dependencies
COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

# Copy Flask server script
COPY server.py ./

# Expose port for Flask
EXPOSE 5000

# Run Flask server
CMD ["python", "server.py"]
```

### **4. Package Files**
#### **Node.js Dependencies (`package.json`)**
```json
{
  "name": "scraper",
  "version": "1.0.0",
  "description": "A Puppeteer scraper for extracting webpage data.",
  "main": "scrape.js",
  "dependencies": {
    "puppeteer": "^21.3.8"
  },
  "scripts": {
    "start": "node scrape.js"
  }
}
```

#### **Python Dependencies (`requirements.txt`)**
```
flask
```

## Example Output
```json
{
  "title": "Example Domain",
  "heading": "Example Domain"
}
```

## Key Features
- Uses **Puppeteer** to scrape data dynamically.
- Deploys a **Flask** web server to serve the scraped content.
- Uses a **multi-stage Docker build** for efficiency.
- Provides an easy-to-use **Docker container**.

---

## Conclusion
This implementation meets all assignment requirements by:
✅ Scraping a webpage using **Node.js & Puppeteer**  
✅ Serving scraped data with **Python & Flask**  
✅ Using a **multi-stage Dockerfile** for efficiency  
✅ Providing clear **build & run instructions**  



