#!/bin/bash

# Start varnish
echo "Starting varnish"
exec varnishd -F -f /etc/varnish/default.vcl -s malloc,${VARNISH_MEMORY} -a 0.0.0.0:80