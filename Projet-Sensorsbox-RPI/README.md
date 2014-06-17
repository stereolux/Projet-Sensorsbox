# Sensorsbox-rpi

[![Build Status](https://travis-ci.org/stereolux/sensorsbox-rpi.svg)](https://travis-ci.org/stereolux/sensorsbox-rpi) [![Code Climate](https://codeclimate.com/github/stereolux/sensorsbox-rpi/coverage.png)](https://codeclimate.com/github/stereolux/sensorsbox-rpi)

## Installation on a raspberry pi and running it

Open a terminal

```
cd ~
wget http://node-arm.herokuapp.com/node_latest_armhf.deb
sudo dpkg -i node_latest_armhf.deb
git clone https://github.com/stereolux/sensorsbox-rpi.git
cd sensorsbox-rpi
npm install
```

## Running it

```
cd ~/sensorsbox-rpi
node src/app.js
```

## Run the program when the raspberry pi boots

See http://www.raspberrypi.org/documentation/linux/usage/rc-local.md

Just add this line in `rc.local`, before `exit 0`.

```
/usr/local/bin/node /home/pi/repos/sensorsbox-rpi/src/app.js&
```
