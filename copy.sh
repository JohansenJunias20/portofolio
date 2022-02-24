# github action akan trigger copy.sh untuk mengcopy beberapa section pada readme file portofolio
# ke readme johansenjunias20.github.io
COPY=FALSE
ENDCOPY=FALSE
txt=""

# first, remove section from readme johansenjunias.github.io
while read p; do
    # underscore="_"
    if [[ "$p" == *"<!-- COPY -->"* ]]; then
        COPY=TRUE
    fi
    if [[ "$p" == *"<!-- ENDCOPY -->"* ]]; then
        COPY=FALSE
        continue
    fi

    if [ "$COPY" == "TRUE" ]; then
        continue
    fi
    echo $p
done <../JohansenJunias20.github.io/readme.md >o # put in o file
ls;
pwd;
o="$(cat o)"
rm -f o # remove o file

# reset variable
COPY=FALSE
ENDCOPY=FALSE
while read p; do
    if [[ "$p" == *"<!-- COPY -->"* ]]; then
        COPY=TRUE
    fi
    if [[ "$p" == *"<!-- ENDCOPY -->"* ]]; then
        ENDCOPY=TRUE
        COPY=FALSE
    fi

    if [ "$COPY" == "TRUE" ]; then
        txt="$txt\n"
        txt="$txt$p"
    fi

    if [ "$ENDCOPY" == "TRUE" ]; then
        break
    fi
done \
    <readme.md

echo -e "$o\n$txt" >../JohansenJunias20.github.io/readme.md;
