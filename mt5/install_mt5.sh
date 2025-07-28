#!/bin/bash

# Set up Wine environment
export WINEPREFIX=/home/$CUSTOM_USER/.wine
export WINEARCH=win64

# Initialize Wine
wineboot --init

# Install MT5 silently
wine /tmp/mt5.exe /auto

# Wait for installation to complete
sleep 30

# Create desktop shortcut
mkdir -p /home/$CUSTOM_USER/Desktop
cat > /home/$CUSTOM_USER/Desktop/MetaTrader5.desktop << EOF
[Desktop Entry]
Version=1.0
Type=Application
Name=MetaTrader 5
Comment=MetaTrader 5 Trading Platform
Exec=wine /home/$CUSTOM_USER/.wine/drive_c/Program\ Files/MetaTrader\ 5/terminal64.exe
Icon=wine
Terminal=false
Categories=Office;
EOF

chmod +x /home/$CUSTOM_USER/Desktop/MetaTrader5.desktop
chown -R $CUSTOM_USER:$CUSTOM_USER /home/$CUSTOM_USER 