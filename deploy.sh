#!/bin/bash

# Configuration
REMOTE_HOST="deploy@app.narzedziadlatworcow.pl"
REGISTRY="app.narzedziadlatworcow.pl:5000"

# Parse arguments for specific services and --no-cache flag
SERVICES=("server" "caddy")
NO_CACHE=""
BUILD_SERVICES=()
for arg in "$@"; do
    if [ "$arg" == "--no-cache" ]; then
        NO_CACHE="--no-cache"
    else
        BUILD_SERVICES+=("$arg")
    fi
done

if [ ${#BUILD_SERVICES[@]} -eq 0 ]; then
    BUILD_SERVICES=("server" "caddy")
fi

# Validate services
for svc in "${BUILD_SERVICES[@]}"; do
    if [[ ! " ${SERVICES[@]} " =~ " ${svc} " ]]; then
        echo "❌ Unknown service: $svc"
        echo "Usage: $0 [--no-cache] [web] [server] [caddy]"
        exit 1
    fi
done

# Build images
BUILD_ARGS=""
for svc in "${BUILD_SERVICES[@]}"; do
    BUILD_ARGS+=" $svc"
done

echo "🏗️  Building images: ${BUILD_ARGS} ${NO_CACHE}" 
docker compose --project-directory ../.. -f docker-compose.production.yml build ${NO_CACHE}${BUILD_ARGS}

# Login to registry
echo "uWQKdeddZXbmQg2L3VGe46c4Szl4pFZuWXRhnJId49I=" | docker login ${REGISTRY} --username deploy --password-stdin

# Push images
for svc in "${BUILD_SERVICES[@]}"; do
    echo "📤 Pushing ${svc} to registry..."
    docker push ${REGISTRY}/${svc}:latest
    echo "✅ ${svc} pushed"
done

echo "🚀 Deploying containers on server..."
scp docker-compose.production.yml ${REMOTE_HOST}:~/

# Check if local server/.env file exists and copy it to server
if [ -f "./server/.env" ]; then
    echo "📄 Found ./server/.env file, copying to server..."
    scp ./server/.env ${REMOTE_HOST}:~/.env
    echo "✅ Environment file copied to server"
else
    echo "⚠️  No ./server/.env file found - make sure OPENAI_API_KEY is set on server"
fi

# Pull new images and deploy
ssh ${REMOTE_HOST} "echo "uWQKdeddZXbmQg2L3VGe46c4Szl4pFZuWXRhnJId49I=" | docker login app.narzedziadlatworcow.pl:5000 --username deploy --password-stdin"
ssh ${REMOTE_HOST} "docker compose -f docker-compose.production.yml pull && docker compose -f docker-compose.production.yml up -d"

echo "✅ Deployment completed!"
