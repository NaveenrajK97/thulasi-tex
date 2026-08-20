# Thulasi Tex - AWS EC2 Deployment Ready Project

## Architecture
Internet -> AWS Security Group -> EC2 Nginx :80 -> Frontend container :8080 -> Backend container :3000

## Security Group
- SSH 22: My IP only
- HTTP 80: 0.0.0.0/0
- HTTPS 443: 0.0.0.0/0 (for future SSL)
- Do not expose 3000, 8080, or 27017 publicly.

## EC2 commands
```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y git docker.io docker-compose-plugin nginx
sudo systemctl enable --now docker nginx
sudo usermod -aG docker $USER
```
Log out and SSH again after adding the user to the docker group.

## Deploy
```bash
git clone <YOUR-GITHUB-REPOSITORY>
cd Thulasi_Tex_EC2_Deployment_Ready
docker compose -f docker-compose.ec2.yml up -d --build
docker compose -f docker-compose.ec2.yml ps
curl http://127.0.0.1:8080
```

## Nginx
```bash
sudo cp nginx/thulasi.conf /etc/nginx/sites-available/thulasi
sudo ln -sf /etc/nginx/sites-available/thulasi /etc/nginx/sites-enabled/thulasi
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl reload nginx
```

Open `http://<EC2-PUBLIC-IP>` in a browser.

## Logs
```bash
docker compose -f docker-compose.ec2.yml logs --tail=100
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

## Important AWS note
The `/todos` endpoints use DynamoDB. For those endpoints, attach an EC2 IAM role with the required DynamoDB permissions instead of storing AWS access keys in the source code.
