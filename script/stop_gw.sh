#!/bin/bash
run=$HOME/src/index.js
# Tìm PID của quá trình chạy ứng dụng từ đường dẫn index.js
PID=$(ps aux | grep $run | grep -v grep | awk '{print $2}')
# Kiểm tra nếu PID không rỗng thì gửi tín hiệu SIGTERM
if [ -n "$PID" ]; then
   echo "Stopping application with PID $PID"
   kill -15 $PID
else
   echo "No running application found."
fi