#!/bin/bash
# please run in with sudo command
echo "running internal_generate-ssl script";
echo "only called by other bash script, please do not run manually";
echo "generating ssh if expired. please make sure port 80 is open and not used by any server..";

echo "generating ssl for websocket server...";
sudo docker run -it --rm --name certbot -p 80:80 -v "/$(pwd)/ssl/main:/etc/letsencrypt" -v "/$(pwd)/ssl/lib:/var/lib/letsencrypt" \
            certbot/certbot \
            certonly --standalone --email johansen.gumbal@gmail.com --agree-tos --no-eff-email -d portofolio.orbitskomputer.com --keep-until-expiring;
