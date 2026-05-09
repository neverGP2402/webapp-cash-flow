#!/bin/bash
# Đường dẫn đến thư mục chứa mã nguồn và các file shell script
path="$HOME/src"
shFilestop="./stopcore.sh"
run="$HOME/src/main.py"
# Lấy số lượng lõi CPU
corenumber=$(nproc)
# Kiểm tra xem ứng dụng có đang chạy không
checkProcess=$(ps aux | grep python | grep "$run" | grep -v grep)
echo "$checkProcess"

# Nếu ứng dụng đang chạy, dừng nó
if [[ -n "$checkProcess" ]]; then
   echo "Stopping the running application..."
   sh "$shFilestop"
fi
# ==================================================
# Khởi động lại ứng dụng trên mỗi lõi CPU
echo "Starting the application on $corenumber CPU cores"
for (( c=1; c<=$corenumber; c++ ))
do 
   cd "$path" && python3 "$run" > /dev/null &
   echo "Chưa xong. Em chờ một xíu!"
   sleep 0.5
done
echo "Application started on $corenumber CPU cores."
echo "Xong rồi đó Em"
# ==================================================