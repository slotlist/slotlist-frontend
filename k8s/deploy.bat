@echo off

if "%1"=="" (
    echo "Provide image tag as parameter"
    exit 1
)

kubectl --namespace slotlist set image deploy/slotlist-frontend slotlist-frontend=eu.gcr.io/slotlist-info/slotlist/frontend:%1
