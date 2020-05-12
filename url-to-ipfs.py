#!/usr/bin/env python

import subprocess
import json

urls = [
"https://www.apple.com/v/home/f/images/heroes/iphone-se/hero__dvsxv8smkkgi_large.jpg",
"https://www.apple.com/v/home/h/images/heroes/iphone-11-spring/hero__dvsxv8smkkgi_large.jpg",
"https://www.apple.com/v/home/h/images/heroes/iphone-11-pro-spring/hero__dvsxv8smkkgi_large.jpg",
"https://www.apple.com/v/home/h/images/promos/wwdc-2020/tile__cauwwcyyn9hy_large.jpg",
"https://www.apple.com/v/home/h/images/promos/watch-series-5/tile_aws5__fwphji1d8yeu_large.jpg",
"https://www.apple.com/v/home/h/images/promos/tv-plus-trying/tile__cauwwcyyn9hy_large.jpg",
"https://www.apple.com/v/home/h/images/promos/mothers-day/tile__cauwwcyyn9hy_large.jpg",
"https://www.apple.com/v/home/h/images/promos/taa-refresh/tile__cauwwcyyn9hy_large.jpg",
"https://www.apple.com/v/home/h/images/logos/covid-19-app/logo__dcojfwkzna2q_large.png",
]

d = dict()
for u in urls:
  o = subprocess.check_output('curl -s "'+u+"\" --output f && ipfs add -Q f | ipfs pin add | awk '{print $2}'", shell=True).strip()
  print('http://ipfs.io/ipfs/' + o)
  d[u] = o

with open('out.json', 'w') as f:
  json.dump(d, f, indent=2)
