terraform {
  required_providers {
    hcloud = {
      source  = "hetznercloud/hcloud"
      version = "~> 1.45"
    }
  }
}

provider "hcloud" {
  token = var.hcloud_token
}

resource "hcloud_ssh_key" "default" {
  name       = "main"
  public_key = file("~/.ssh/id_rsa.pub")
}

resource "hcloud_server" "docker_vps" {
  name        = "NarzedziaDlaTworcow"
  image       = "ubuntu-22.04"
  server_type = "cax21"
  location    = "fsn1"
  ssh_keys    = [hcloud_ssh_key.default.id]
}

output "server_ip" {
  value = hcloud_server.docker_vps.ipv4_address
}
