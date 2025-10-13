#!/bin/bash

# Exit on any error
set -e

# Function to check if command exists
check_command() {
    if ! command -v "$1" &> /dev/null; then
        echo "Error: $1 is required but not installed."
        exit 1
    fi
}

# Function to wait for SSH to become available
wait_for_ssh() {
    local host=$1
    local max_attempts=30
    local attempt=1
    
    echo "Waiting for SSH to become available..."
    while ! nc -z -w5 "$host" 22; do
        if [ $attempt -ge $max_attempts ]; then
            echo "Error: SSH did not become available within 5 minutes"
            exit 1
        fi
        echo "Attempt $attempt/$max_attempts: SSH not ready yet, waiting..."
        sleep 10
        ((attempt++))
    done
    
    # Additional wait to ensure SSH is fully ready
    sleep 5
    echo "SSH is now available!"
}

# Check required commands
check_command terraform
check_command ansible
check_command ssh-keygen
check_command openssl
check_command docker
check_command nc

# Check if SSH key exists
if [ ! -f ~/.ssh/id_rsa.pub ]; then
    echo "Error: SSH public key not found at ~/.ssh/id_rsa.pub"
    exit 1
fi

# Check if terraform.tfvars exists and contains valid token
if [ ! -f terraform.tfvars ]; then
    echo "Error: terraform.tfvars not found"
    exit 1
fi

if grep -q "your-hetzner-api-token" terraform.tfvars; then
    echo "Error: Please replace the placeholder Hetzner API token in terraform.tfvars"
    exit 1
fi

echo "Initializing Terraform..."
terraform init

echo "Applying Terraform configuration..."
terraform apply -auto-approve

echo "Getting server IP..."
terraform output -raw server_ip > ip.txt

if [ ! -s ip.txt ]; then
    echo "Error: Failed to get server IP"
    exit 1
fi

SERVER_IP=$(cat ip.txt)

# Remove old SSH known hosts entry if exists
ssh-keygen -R "$SERVER_IP" 2>/dev/null || true

echo "Creating Ansible inventory..."
echo "[vps]" > inventory.ini
echo "$SERVER_IP ansible_user=root" >> inventory.ini

echo "Generating registry password..."
REGISTRY_PASSWORD=$(openssl rand -base64 32)
echo "$REGISTRY_PASSWORD" > registry_password.txt
echo "Registry password saved to registry_password.txt"

# Wait for SSH to become available
wait_for_ssh "$SERVER_IP"

echo "Running Ansible playbook..."
ansible-playbook -i inventory.ini site.yml \
    -e "registry_password=$REGISTRY_PASSWORD"

echo "Setup completed successfully!"
echo "Registry credentials:"
echo "Username: deploy"
echo "Password: $REGISTRY_PASSWORD"
echo "Registry URL: $SERVER_IP:5000"
