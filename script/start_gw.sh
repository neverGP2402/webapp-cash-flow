#!/bin/bash

# Ngày hiện tại và file log
DATE=$(date +%Y%m%d)
LOGFILE="$HOME/log/apigw_${DATE}.log"

# Di chuyển đến thư mục ứng dụng
cd $HOME/src || exit

# Chạy ứng dụng Node.js và ghi log (chạy nền)
nohup node $HOME/src/index.js >> "$LOGFILE" 2>&1 &