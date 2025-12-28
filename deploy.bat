@echo off
setlocal

REM Path ke pscp dan plink
set PSCP_PATH=C:\tools\pscp.exe
set PLINK_PATH=C:\tools\plink.exe

REM Konfigurasi server
set SERVER_USER=administrator
set SERVER_PASS=choa4o4
set SERVER_IP=192.168.1.28
set SERVER_PATH=/home/administrator/Program/reportv3-frontend

REM Step 1: Build project
echo Building project...
call npm run build

REM Step 2: Kirim script penghapus ke server
echo Uploading remove_dist.sh to server...
echo y | %PSCP_PATH% -pw %SERVER_PASS% -scp -r remove_dist.sh %SERVER_USER%@%SERVER_IP%:/home/administrator/

REM Step 3: Jalankan script hapus dist di server
echo Removing old dist folder on server...
%PLINK_PATH% -batch -pw %SERVER_PASS% %SERVER_USER%@%SERVER_IP% "bash /home/administrator/remove_dist.sh"

REM Step 4: Upload dist baru
echo Uploading dist folder...
%PSCP_PATH% -pw %SERVER_PASS% -r dist\* %SERVER_USER%@%SERVER_IP%:%SERVER_PATH%/dist/

echo Done!
pause
