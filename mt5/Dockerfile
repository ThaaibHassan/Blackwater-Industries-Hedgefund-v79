FROM ubuntu:20.04

ENV DEBIAN_FRONTEND=noninteractive
ENV CUSTOM_USER=admin
ENV PASSWORD=password
ENV VNC_DOMAIN=localhost

# Install dependencies
RUN apt-get update && apt-get install -y \
    wine \
    wine32 \
    wine64 \
    xvfb \
    x11vnc \
    novnc \
    net-tools \
    wget \
    curl \
    unzip \
    && rm -rf /var/lib/apt/lists/*

# Create user
RUN useradd -m -s /bin/bash $CUSTOM_USER && \
    echo "$CUSTOM_USER:$PASSWORD" | chpasswd

# Download and install MetaTrader 5
RUN wget -O /tmp/mt5.exe "https://download.mql5.com/cdn/web/metaquotes.software.corp/mt5/mt5setup.exe" && \
    chmod +x /tmp/mt5.exe

# Install Wine dependencies
RUN winecfg /v win7 && \
    winetricks -q vcrun2019

# Copy MT5 installation script
COPY install_mt5.sh /tmp/
RUN chmod +x /tmp/install_mt5.sh

# Copy startup script
COPY start.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/start.sh

# Expose VNC port
EXPOSE 6080

# Set working directory
WORKDIR /home/$CUSTOM_USER

# Start script
CMD ["/usr/local/bin/start.sh"] 