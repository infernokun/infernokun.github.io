---
title: "Telltale Modding Studio: Opening Up Telltale's Games"
description: A desktop app that reads an installed Telltale game and shows you everything inside it. Characters you can dress and animate, scenes you can walk around, every line of dialogue with its voice and lip sync, the decompiled Lua scripts, and every file in the archives.
slug: telltale-modding-studio
date: 2026-10-29
featureimage: characters.webp
categories:
    - Game Modding
    - Tools
tags:
    - Telltale
    - C#
    - Avalonia
    - .NET
    - Reverse Engineering
---

Working on the [rewind mod](/projects/twd-season-2-rewind/) and the [mod launcher](/projects/telltale-mod-launcher-0-7/) meant a lot of extracting archives and squinting at hex. I wanted one place to look at a Telltale game the way it actually is: its characters, scenes, dialogue and scripts, not a folder of `.d3dmesh` files.

Telltale Modding Studio is that place. Point it at an installed game and it indexes everything in a few seconds. It works with The Walking Dead: The Telltale Definitive Series, Season Two, Michonne, Tales from the Borderlands, The Wolf Among Us and Game of Thrones.

[Source and release on GitHub](https://github.com/infernokun/TelltaleModdingStudio/releases/tag/v1.0.0)

## Characters

{{< feature img="characters.webp" alt="Clementine from the Definitive Series" side="right" >}}
Every character the game defines, dressed the way the game dresses them. The default outfit comes from the character's own property file, and every other part (hats, damaged heads, alternate jackets) can be switched on in the Outfit tab.

- Pick any clip in the Animations tab and it plays on the model. Skinning runs on the GPU, so even 60,000-triangle characters play smoothly.
- The Face tab poses the face over the playing clip: a mood's expression, mouth shapes, gestures and single facial bones.
- A skeleton toggle draws the bones inside the model.
- Export saves the dressed, textured character with its skeleton and the playing clip as a `.glb` for Blender.
{{< /feature >}}

{{< feature img="face.webp" alt="The Face tab posing an angry expression" side="left" >}}
### Looking like the game

Each game has its own look, so I read the games' compiled shaders and rebuilt them: Tales from the Borderlands' black outlines and hand-drawn line art, The Wolf Among Us' banded toon lighting, the Definitive Series' ink textures and graphic black. A switch at the top picks Studio lighting for inspecting textures, the game's own look, or Graphic black, which adds the Definitive Series' solid black shadows to any game.
{{< /feature >}}

## Dialogue

{{< feature img="dialogue.webp" alt="Rhys lip-syncing a line from Tales from the Borderlands" side="right" >}}
Every subtitle line in the game, matched to its voice recording. Click a line and you hear it while the character says it in 3D beside the list. Every voice line has a phoneme track, and the app drives the character's mouth shapes from it, in the mood the line's direction tags name.

The voice files are FMOD sound banks. The Vorbis ones leave out the codec setup the decoder needs, so the app reads it out of the FMOD library each game installs.
{{< /feature >}}

{{< feature img="conversation.webp" alt="A conversation tree from Tales from the Borderlands" side="left" >}}
### Conversations

Talks shows a scene's conversations as the game's own dialogue tree: lines, choice menus and their options, branches and jumps. You can play a conversation through and pick the choices as buttons. The Music tab lists each game's soundtrack.
{{< /feature >}}

## Scenes and scripts

{{< feature img="scenes.webp" alt="The bell tower from The Walking Dead" side="right" >}}
Scenes are rebuilt from their `.scene` files: every object placed and textured, lit by the scene's own lights. Orbit around, or click the view and fly with WASD.
{{< /feature >}}

{{< feature img="scripts.webp" alt="A decompiled Lua script from Game of Thrones" side="left" >}}
The game logic is Lua, shipped as compiled bytecode. The app decompiles it back to readable source, with a function outline and search. It handles Lua 5.2 and the older games' Lua 5.1, including the shuffled opcode numbers some of them use.
{{< /feature >}}

## Getting it right

Showing a character takes a lot of guessing about which mesh, texture and material go together, so I checked every character and outfit in all six games and fixed what came up. A few of the more interesting ones:

<div class="ik-cards ik-cards--2">
  <div class="ik-card">
    <h3>Nods that don't nod</h3>
    <p>Bigby's head nods were frozen. They weren't misread: The Wolf Among Us' later episodes and patches carry re-exports of many episode 1 clips with all but the first frame cut. The app plays the original when the winning copy doesn't move, which brought 110 clips back.</p>
  </div>
  <div class="ik-card">
    <h3>Materials that stopped early</h3>
    <p>A material is a list of typed properties with no sizes, so one unknown type meant everything after it was lost. The reader now knows the layouts it meets and steps over the ones it doesn't. All 114,637 materials in the Definitive Series read completely.</p>
  </div>
  <div class="ik-card">
    <h3>Inherited textures</h3>
    <p>Some zombies' hands and feet name no texture of their own; they inherit it from a parent material. Without reading the parent they came out solid black.</p>
  </div>
  <div class="ik-card">
    <h3>Heads picked by script</h3>
    <p>Some Game of Thrones soldiers turn every head off in their data and let a script pick one at spawn, which left their eyes floating. They now get a default head and hair.</p>
  </div>
</div>

## Files and mods

{{< feature img="assets.webp" alt="The asset browser previewing Bigby's texture" side="right" >}}
Assets searches every file in the game, previews textures, models and sounds, and exports them as everyday formats: PNG, WAV, MP3 or Ogg, decompiled Lua, subtitle transcripts. Mod lets you swap any file for your own and builds a small patch archive the game loads over its originals, the same way Telltale shipped its own patches.

The `.ttarch2` archives are read natively: a port of the archives' Blowfish variant, zlib, and the Oodle library each game ships.
{{< /feature >}}

## Getting it

The [1.0.0 release](https://github.com/infernokun/TelltaleModdingStudio/releases/tag/v1.0.0) is a self-contained Windows zip: unzip it and run `TelltaleModding.App.exe`. It's .NET 8 and Avalonia. Everything in it belongs to Telltale Games and the games' licensors; the app only reads the games you have installed.
