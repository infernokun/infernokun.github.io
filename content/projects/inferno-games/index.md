---
title: "Inferno Games: My Game Library, Backlog and Steam Stats"
description: A self-hosted tracker for the games I own and play, with my whole Steam library pulled in and playtime split between my PC and Steam Deck.
slug: inferno-games
date: 2026-10-20
featureimage: games-dashboard.webp
showTableOfContents: false
categories:
    - Web Apps
tags:
    - Games
    - Steam
    - Steam Deck
    - Angular
---

Inferno Games keeps track of the games I own, what I'm playing now, and my backlog. It pulls in my whole Steam library and splits playtime between my Windows PC and my Steam Deck.

![The dashboard](games-dashboard.webp)

## The library

{{< feature img="games-library.webp" alt="The game library" side="left" >}}
### Every game I'm tracking

Games I'm tracking each get a card with their status (backlog, playing, completed, on hold or dropped), the platform, the developer and year, and how long I've played. Some cards also carry a DLC tag.

Filters cover status, platform and genre, with favorites and a few ways to sort.
{{< /feature >}}

{{< feature img="games-detail.webp" alt="A game's page, with playtime by device" side="right" >}}
### A page per game

Each game has its own page. For Steam games, it shows the playtime split between Windows and Steam Deck, synced from Steam, next to the buttons to change its status.
{{< /feature >}}

## The Steam side

{{< feature img="games-steam-library.webp" alt="My Steam library, sorted by playtime" side="left" >}}
### Steam Library

Every game on my Steam account, enriched with data from IGDB. It can sort by playtime or by when I last played, filter played and unplayed games, and add any of them to the backlog in one click.
{{< /feature >}}

{{< feature img="games-steam-stats.webp" alt="Steam stats" side="right" >}}
### Steam Stats

The big picture: 394 games, about 11,000 hours in total, and how much of the library I've actually played.

The platform breakdown shows my top games on PC and on the Deck, and a filter can drop the outliers with thousands of hours so they don't swamp everything else.
{{< /feature >}}
