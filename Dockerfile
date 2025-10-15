# Use official Playwright image with all browsers; version should match CI
FROM mcr.microsoft.com/playwright:v1.55.0-noble

# Install system packages needed for development (if any)
# RUN apt-get update && apt-get install -y <your-packages>

# Set working directory
WORKDIR /workspace

# Node will run as root; set HOME for consistency
ENV HOME=/root

# Copy dependency files first for caching
COPY package.json package-lock.json .nvmrc ./

# Install npm dependencies; use --legacy-peer-deps if needed for monorepos, etc.
RUN npm ci

# Install Playwright browsers and dependencies (again, for local/CI parity)
RUN npx playwright install --with-deps

# Copy the rest of the project files
COPY . .

# Expose default Storybook port
EXPOSE 3000

# Expose port for reports if there are test failures
EXPOSE 9323

# Default entrypoint; override in docker-compose or docker run
CMD [ "bash" ]
