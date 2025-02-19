# Dockerfile - Multi-stage build for scraper and server

# Stage 1: Scraper
FROM node:18-slim AS scraper
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
COPY scrape.js ./
RUN apt-get update && apt-get install -y chromium
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
ENV SCRAPE_URL=https://example.com
CMD ["node", "scrape.js"]

# Stage 2: Server
FROM python:3.10-slim AS server
WORKDIR /app
COPY --from=scraper /app/scraped_data.json ./
COPY server.py ./
RUN pip install flask
EXPOSE 5000
CMD ["python", "server.py"]
