---
title: "Project TTG: A Resident Evil Style Prototype in Unreal"
description: A third-person Unreal Engine project inspired by the Resident Evil remakes, built around a Clementine model from The Walking Dead.
slug: project-ttg
date: 2023-11-14
image: game5.png
categories:
    - Game Dev
tags:
    - Unreal Engine
    - Blueprints
    - Control Rig
    - Animation
---

Project TTG is a third-person game prototype in Unreal Engine, inspired by the Resident Evil remakes. The character is Clementine from Telltale's The Walking Dead.

It's a learning project. Everything here is about getting the systems right in a grey-box test level, not about content.

<video src="clementine.mp4" poster="clementine-poster.jpg" muted playsinline loop autoplay controls></video>

## Third-person gameplay

The goal is the feel of the Resident Evil remakes: a camera over the shoulder, a flashlight that matters, and careful movement. In a full game that also means limited resources and puzzles built into the environment.

![Aiming with a flashlight in the test room](game5.png)

## Blueprints

The gameplay logic is built in Blueprints, Unreal's visual scripting. Events, functions and interactions with the world are all wired up there, which makes it quick to try an idea without writing C++ first.

![Gameplay Blueprint](game2.png)

## Control Rig

The character animation goes through Control Rig, Unreal's node-based tool for building skeletal controls and animating them procedurally. It lets the character react to the world instead of only playing back canned animations.

![Control Rig](game3.png)

Control Rig setups can be packaged as Control Rig Blueprints, so the same setup can be reused and configured across characters.

![Control Rig Blueprint](game4.png)

## The Clementine model

Getting Clementine into Unreal meant setting up the model, rigging it, and getting it animating. With Control Rig driving her, I could clone existing animations and adjust them instead of animating everything from scratch.

![Clementine in the engine](game6.png)
