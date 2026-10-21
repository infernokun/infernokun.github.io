---
title: "Project TTG: A Telltale-Style Game in Unreal"
description: A work-in-progress game in Unreal Engine built around Clementine from The Walking Dead, mixing Telltale's adventure style with the third-person feel of the Resident Evil remakes.
slug: project-ttg
date: 2023-11-14
featureimage: clementine-poster.jpg
showTableOfContents: false
categories:
    - Game Dev
tags:
    - Unreal Engine
    - Blueprints
    - Control Rig
    - Animation
    - Telltale
---

Project TTG is a work-in-progress game in Unreal Engine, built around a Clementine model from Telltale's The Walking Dead. It borrows from two places: the point and click style of Telltale's adventures, and the third-person feel of the Resident Evil remakes.

It's purely for learning, with no plans for any kind of release. Everything here lives in a grey-box test level, because the point is getting the systems right, not content.

<video src="clementine.mp4" poster="clementine-poster.jpg" muted playsinline loop autoplay controls></video>

![Clementine in the test level](telltale-style.png)

## Gameplay

{{< feature img="game5.png" alt="Aiming with the flashlight" side="left" >}}
### Third-person

From the Resident Evil remakes it takes the camera over the shoulder, a flashlight that matters, and careful movement. In a full game that style also means limited resources and puzzles built into the environment.
{{< /feature >}}

{{< feature img="game2.png" alt="Gameplay Blueprint" side="right" >}}
### Blueprints

The gameplay logic is built in Blueprints, Unreal's visual scripting. Events, functions and interactions with the world are all wired up there, which makes it quick to try an idea without writing C++ first.
{{< /feature >}}

## Animation

{{< feature img="game3.png" alt="Control Rig" side="left" >}}
### Control Rig

The character animation goes through Control Rig, Unreal's node-based tool for building skeletal controls and animating them procedurally. It lets the character react to the world instead of only playing back canned animations.
{{< /feature >}}

{{< feature img="game4.png" alt="Control Rig Blueprint" side="right" >}}
### Control Rig Blueprints

Control Rig setups can be packaged as Control Rig Blueprints, so the same setup can be reused and configured across characters.
{{< /feature >}}

{{< feature img="game6.png" alt="Clementine in the engine" side="left" >}}
### The Clementine model

Getting Clementine into Unreal meant setting up the model, rigging it, and getting it animating. With Control Rig driving her, I could clone existing animations and adjust them instead of animating everything from scratch.
{{< /feature >}}
