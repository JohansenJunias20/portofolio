#!/bin/bash
# please run in with sudo command
echo "generating ssh if expired. please make sure port 80 is open and not used by any server.."

export $(cat .env | xargs)
echo "generating ssl for websocket server..."
sudo docker run -it --rm --name certbot -p 80:80 -v "/$(pwd)/ssl/main:/etc/letsencrypt" -v "/$(pwd)/ssl/lib:/var/lib/letsencrypt" \
certbot/certbot \
certonly --standalone --email johansen.gumbal@gmail.com --agree-tos --no-eff-email -d $TURN_DOMAIN --keep-until-expiring

echo "generating ssl for websocket production server..."
sudo docker run -it --rm --name certbot -p 80:80 -v "/$(pwd)/ssl/main:/etc/letsencrypt" -v "/$(pwd)/ssl/lib:/var/lib/letsencrypt" \
certbot/certbot \
certonly --standalone --email johansen.gumbal@gmail.com --agree-tos --no-eff-email -d $PROD_WS_DOMAIN --keep-until-expiring
