#!/bin/bash
nmap -p 3000 127.0.0.1 | grep -i "open  ppp"
if [ $? -eq 0 ];then
   echo "port is open"
else
   break
fi