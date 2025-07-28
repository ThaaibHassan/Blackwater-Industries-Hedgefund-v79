#!/bin/bash

# Set up Wine environment
export WINEPREFIX=/home/$CUSTOM_USER/.wine
export WINEARCH=win64
export DISPLAY=:1

# Start Xvfb
Xvfb :1 -screen 0 1920x1080x24 &
sleep 2

# Start window manager
openbox &
sleep 2

# Start VNC server
x11vnc -display :1 -nopw -listen localhost -xkb -ncache 10 -ncache_cr -forever &
sleep 2

# Start noVNC
/usr/share/novnc/utils/launch.sh --vnc localhost:5900 --listen 6080 &
sleep 2

# Start MT5 if not already running
if ! pgrep -f "terminal64.exe" > /dev/null; then
    su - $CUSTOM_USER -c "wine /home/$CUSTOM_USER/.wine/drive_c/Program\ Files/MetaTrader\ 5/terminal64.exe" &
fi

# Keep container running
tail -f /dev/null 