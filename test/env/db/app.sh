#! /bin/bash

set -e

app='env-db'

usage="$(basename "$0") [-h] [-s <start/stop/restart/ps/status/init>]
This program will run.
Arguments:
    -h  show this help 
    -s  script ex: start/stop/restart/ps/status/init
            start start program
            stop stop program
            restart restart program
            ps/status show program status
            init init env"
options=':hs:'
while getopts $options option; do
    case "$option" in
    h)
        echo "$usage"
        exit
        ;;
    s) script=$OPTARG ;;
    :)
        printf "missing  for -%s\n" "$OPTARG" >&2
        echo "$usage" >&2
        exit 1
        ;;
    \?)
        printf "error  option: -%s\n" "$OPTARG" >&2
        echo "$usage" >&2
        exit 1
        ;;
    esac
done

if [ -z $script ]; then
    echo "$usage"
    exit
fi

gendir() {
    mkdir -p /data/postgres/_data
    mkdir -p /data/mssql/_data
    mkdir -p /data/mysql/_data
}

create_network() {
    echo "==== Create Network ===="

    filterName=$(docker network ls | grep newbility-db | awk '{ print $2 }')

    if [ "${filterName}" != "newbility-db" ]; then
        docker network create --driver bridge --subnet=158.41.0.0/16 --gateway=158.41.0.1 newbility-db
    fi

    echo "==== Network Created ===="
}

start() {
    # gendir         # 检查并判断存储文件夹是否完整
    create_network # 启动前进行网络创建
    docker compose -p $app up -d
}

stop() {
    docker compose -p $app down
}

ps() {
    docker compose -p $app ps
}

main() {
    if [ $1 == "start" ]; then
        start
    elif [ $1 == "stop" ]; then
        stop
    elif [ $1 == "restart" ]; then
        stop
        start
    elif [ $1 == "ps" ] || [ $1 == "status" ]; then
        ps
    else
        echo 'Instruction does not exist'
    fi
}

if [ ! -z $script ]; then
    main $script
else
    echo "$usage"
fi
