 README.md (Documentation with build and run instructions)
markdown
Copy
Edit
# Web Scraper & API

## Overview
This project consists of a Node.js web scraper using Puppeteer and a Python Flask server to host the scraped data. The application runs as a Docker container using a multi-stage build to keep the image lean.

## How to Build the Docker Image
To build the Docker image, run the following command in the project directory:
```sh
docker build -t web-scraper .
How to Run the Container
To run the container, use the following command:

sh
Copy
Edit
docker run -p 5000:5000 -e SCRAPE_URL=https://example.com web-scraper
Replace https://example.com with the actual URL you want to scrape.

How to Pass the URL to Be Scraped
The URL to be scraped can be supplied via an environment variable when running the container:

sh
Copy
Edit
docker run -p 5000:5000 -e SCRAPE_URL=https://example.com web-scraper
Alternatively, if modifying scrape.js, you can pass the URL as a command-line argument and modify the script accordingly.

How to Access the Hosted Scraped Data
Once the container is running, open a web browser and visit:

arduino
Copy
Edit
http://localhost:5000
This will return the extracted page title and first heading in JSON format.

Project Files and Step-by-Step Setup
1. scrape.js - Node.js Script to Scrape a Webpage
Handles web scraping using Puppeteer and saves the data as JSON.

2. server.py - Python Flask Application to Serve Scraped Data
Hosts the scraped data on a simple API.

3. Dockerfile - Multi-Stage Build for Scraper and Server
Creates a lightweight container with both scraping and serving functionality.

4. package.json - Node.js Dependencies
Contains the required dependencies for the scraper.

5. requirements.txt - Python Dependencies
Lists required dependencies for the Python server.
