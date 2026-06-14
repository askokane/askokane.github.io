---
title: portsmith
excerpt: cli tool for ports
date: 2026-06-06
---

was extremely bored yesterday and today after the co/build session, so i built a small cli tool called [portsmith](https://pypi.org/project/portsmith) for developers, specifically website designers. it uses psutil, typer and rich as its dependencies. so when someone is using multiple ports on a project, they can keep track of which ports are up and which ports are killed. here is what it looks like.

```
portman list --mine
                            Active Listening Ports
+-------------------------------------------------------------------+
|  Port | Proto |   PID | Process                   | Status | Type |
|-------+-------+-------+---------------------------+--------+------|
|  3000 | TCP   | 35976 | python.exe                | LISTEN | user |
|  3001 | TCP   | 35976 | python.exe                | LISTEN | user |
|  3002 | TCP   | 35976 | python.exe                | LISTEN | user |
+-------+-------+-------+---------------------------+--------+------+
```

building it took maybe four or five hours spread across yesterday and today. most of that time wasn't writing code, it was making the output look good and making it usable on every operating system.

is portman going to change your life? no. are there fifty existing tools that do something similar? probably. but it's mine, it's fast, it installs with `pip install portsmith`, and the next time port 3000 ghosts me, i'll be ready.

ask.
