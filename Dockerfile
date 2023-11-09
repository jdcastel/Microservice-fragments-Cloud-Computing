# Stage 0: Build Stage
# Use node version 16.14-alpine3.14 as the base version
FROM node:16.14-alpine3.14@sha256:a93230d096610a42310869b16777623fbcacfd593e1b9956324470f760048758 AS base

# Metadata information
LABEL maintainer="Juan Castelblanco <jdrodriguez-castelbl@myseneca.ca>" \
      description="Fragments microservice Dockerfile"

# Reduce npm spam when installing within Docker
# Disable colour when run inside Docker
ENV NODE_ENV=production \
    NPM_CONFIG_LOGLEVEL=warn \
    NPM_CONFIG_COLOR=false

# Create the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json /app/

# Install Node.js
RUN npm install --no-package-lock

################################################

# Stage 1: Production Stage
# Use the same base image as the production stage
FROM node:16.14-alpine3.14@sha256:a93230d096610a42310869b16777623fbcacfd593e1b9956324470f760048758 AS production

# Create the working directory
WORKDIR /app

# Copy files from the 'base' stage to the working directory
COPY --from=base /app /app
COPY . .

# Install dumb-init
RUN apk add --no-cache dumb-init=1.2.5-r1

# Command to start the container using dumb-init
CMD ["dumb-init","node","/app/src/server.js"]

EXPOSE 8080

# Healthcheck command
HEALTHCHECK --interval=15s --timeout=30s --start-period=10s --retries=3 \
 CMD wget --no-verbose --tries=1 --spider localhost:8080 || exit 1
