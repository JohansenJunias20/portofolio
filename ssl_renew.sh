#!/bin/bash
# please run in with sudo command

# removing any servers
docker-compose -f docker-compose.dev.yml down
docker-compose -f docker-compose.prod.yml down
echo y | docker container prune
echo "generating ssh if expired. please make sure port 80 is open and not used by any server.."
export $(cat .env | xargs)
stopped_id=null
for id in $(docker ps -q); do
    if [[ $(docker port "${id}") == *"80"* ]]; then
        echo "stopping container ${id}"
        docker stop "${id}"
        stopped_id=$id
        break
    fi
done


domains=($TURN_DOMAIN $PROD_WS_DOMAIN)
for i in "${domains[@]}"; do
    echo "check $i is exist in ssl directory?"
    if [ -d "./ssl/main/archive/$i" ]; then
        # check if exist in directoriy live too
        if [ ! -d "./ssl/main/live/$i" ]; then
            echo "not exist in live directory, removing from archive"
            rm -r -f ./ssl/main/archive/$i
            rm -r -f ./ssl/main/live/$i
        fi
        echo "exist in archive directory, skipping request certificate..";
    fi
    # check if directory archive exist
    if [ ! -d "./ssl/main/archive/$i" ]; then
        echo "requesting certificate for $i";
        # request a certificate
        docker run -it -v "/$(pwd)/ssl/main:/etc/letsencrypt" -p 80:80 certbot/certbot certonly --standalone --email johansen.gumbal@gmail.com --agree-tos --no-eff-email -d $i --keep-until-expiring
    fi
    sleep 3;
done

sleep 5;
echo "renew all ssl certificates...";
docker run -it -v "/$(pwd)/ssl/main:/etc/letsencrypt" -p 80:80 \
    certbot/certbot renew --dry-run --standalone --email johansen.gumbal@gmail.com --agree-tos --no-eff-email


# check if stopped_id not null
if [[ $stopped_id != null ]]; then
    echo "removing container ${stopped_id}"
    docker start "${stopped_id}" # resuming the processes that use port 80
fi
