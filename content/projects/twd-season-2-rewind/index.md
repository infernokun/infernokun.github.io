---
title: Bringing Chapter Rewind Back to The Walking Dead
description: The Definitive Series quietly turned off rewind in The Walking Dead Season 2, and Seasons 3 and 4 never had it. I found the switch in Season 2's menu script and turned it back on, then built rewind for Seasons 3 and 4 out of code the games already contain.
slug: twd-season-2-rewind
date: 2026-10-19
lastmod: 2026-10-29
featureimage: cover.webp
imagePosition: "50% 50%"
categories:
    - Game Modding
tags:
    - Telltale
    - The Walking Dead
    - Lua
    - Reverse Engineering
---

In the original release of The Walking Dead Season Two you could open an episode, pick any chapter you had already played, and rewind your save to that point. That is how I replay choices.

The Telltale Definitive Series bundles all four seasons plus Michonne into one game. Season 1 and Michonne still have a rewind menu. Season 2 doesn't: open an episode and all you get is Restart Episode. Seasons 3 and 4 never had one at all.

I started with Season 2, by looking for the difference between the two releases. Version 2.0.0 of the mod then [added rewind to Seasons 3 and 4](#seasons-3-and-4).

[Source and release on GitHub](https://github.com/infernokun/TWD-Definitive-Rewind)

## Getting into the archives

Both games keep everything in `.ttarch2` archives. They're encrypted with a modified Blowfish and compressed, so grepping 46 GB of them for "rewind" goes nowhere. [ttarchext](https://aluigi.altervista.org/papers.htm#ttarchext) by Luigi Auriemma handles both games, so I extracted the menu and script archives from each install and compared them.

The Season 2 menu in the Definitive Series is almost a copy of the original. Same scripts, same text, even the per-chapter thumbnail textures are still there. The rewind strings are still in the English text database:

```
REWIND
BRANCH will allow you to replay this scene by creating a new save file,
whereas REWIND will erase your currently selected save file back to this Chapter?
To rewind this chapter, please choose a save file to copy the data.
```

So the feature wasn't removed. Something was hiding it.

## Reading compiled Lua

The menus are written in Lua, shipped as compiled bytecode. The Definitive Series uses Lua 5.2 with 4-byte floats. The original Season Two uses Lua 5.1 with Telltale's own shuffled opcode numbers, which makes it painful to read directly, but its string constants are enough to compare against.

I wrote a small disassembler in Python, pointed it at `Menu_chapters.lua` from the Definitive Series, and found this:

```
==== Menu_Chapters_RewindIsSupported  lines 1054-1056
     0 LOADBOOL  R0 := False
     1 RETURN    return R0.. (1)
```

A function that only returns `false`. It doesn't exist in the original game. The chapter list only builds a panel for each autosave when this returns `true`, so in the Definitive Series the list is never built.

Two more changes went with it:

| | Original Season Two | Definitive Series |
|---|---|---|
| Chapter list | Built for every autosave | Gated behind `RewindIsSupported()`, which returns `false` |
| Picking a chapter | "Rewind" popup, then pick a save slot to rewind | "Restart Episode" popup |
| Button label | `navhelp_rewind` | `navhelp_restart` |

Everything the feature needs further down, like the save-slot rewind code and `SaveLoad_Revert`, is still there and untouched. Only this one script needed fixing.

## Patching bytecode

I didn't want to decompile and recompile the whole script, so I wrote a Lua 5.2 bytecode reader and writer that round-trips Telltale's files byte for byte. Before changing anything I checked it against six different game scripts. Every one came back identical.

Then the patch is three small edits:

1. `RewindIsSupported` returns `true`.
2. The popup goes back to the rewind text and calls `Menu_Chapters_Replay()`, which opens the save-slot picker like the original.
3. The button label goes back to `navhelp_rewind`.

The disassembly diff is short:

```diff
-     3 LOADK     R1 := 'popup_restart_header'
-     4 LOADK     R2 := 'popup_restart_message'
-     5 LOADK     R3 := 'Menu_Chapters_NewStart()'
-     6 CALL      R0(3 args, 0 results)
+     3 LOADK     R1 := 'popup_rewind_header'
+     4 LOADK     R2 := 'popup_rewind_message'
+     5 LOADK     R3 := 'Menu_Chapters_Replay()'
+     6 LOADK     R4 := 'label_ok'
+     7 CALL      R0(4 args, 0 results)
...
-     0 LOADBOOL  R0 := False
+     0 LOADBOOL  R0 := True
...
-   406 LOADK     R4 := 'navhelp_restart'
+   406 LOADK     R4 := 'navhelp_rewind'
```

## Loading it without touching the game

I didn't want to repack Telltale's 800 KB menu archive. The engine has a cleaner way in.

At startup it runs every `_resdesc_50_*.lua` file in the Archives folder. Each one registers a set of archives with a priority. When two sets have a file with the same name, the higher priority wins. Telltale used exactly this for their own PC patches, at priority 400 over the stock 62.

So the mod is two files:

- `WDC_pc_Mod_TWDRewind_S2_data.ttarch2`, holding only the patched `Menu_chapters.lua`
- `_resdesc_50_Mod_TWDRewind_S2.lua`, which registers it at priority 700 under the Season 2 menu

```lua
local set = {}
set.name = "Mod_TWDRewind_S2"
set.logicalDestination = "<MenuSeason2>"
set.priority = 700
set.gameDataArchives = { _currentDirectory .. "WDC_pc_Mod_TWDRewind_S2_data.ttarch2" }
RegisterSetDescription(set)
```

The descriptor has to be encrypted the same way the game's own are, with an `ESC LEo` marker in front. To check that, I decrypted Telltale's own patch descriptor, encrypted it again, and compared: the header matched the game's file and decrypting it gave back the original text.

Nothing in the game is modified. Delete the mod's files and it's stock again, and Steam's file check leaves them alone because they're additions, not replacements.

## Testing it

Rewinding deletes the saves after the chapter you pick, same as the original game. Before trying it I copied my Season 2 save slot into an empty slot and tested on the copy. The chapter panels came back, Rewind showed up, and it worked.

The build script doesn't ship Telltale's script. It pulls the stock one out of your own install, patches it, packs it, then extracts and decrypts the result again to check both round trips.

{{< feature img="launcher.png" alt="The mod installed through the launcher" side="left" >}}
### With the mod launcher

The mod also works with the [Telltale Mod Launcher](/projects/telltale-mod-launcher-0-7/), which is how it's installed here. Drop the release zip onto the launcher. If you had a 1.x version installed, remove it first, since 2.0.0 renamed its files.
{{< /feature >}}

## Seasons 3 and 4

Seasons 3 and 4 are harder. They never had rewind, and they never keep the saves it needs: every checkpoint overwrites the same autosave. Version 2.0.0 adds a rewind menu to both without replacing a single stock file.

{{< feature img="season4-rewind.webp" alt="Season 4: the picture of a rewind point, with Previous, Next and Rewind here" side="right" >}}
### Rewinding to any scene you've played

Both seasons keep a choice log for the whole playthrough: every scene you start, every dialog node and every choice. The game reads your story back from it, which is how it restarts an episode without a save. Every episode also still contains Telltale's developer scene list, the one their tools used to jump into a scene, with names like "Forest Camp" and "Greenhouse".

Put together, those give the rewind list: every scene you reached in the episode, in the order you played them, even on saves from before the mod. Rewinding to one cuts the log back to the last save before that scene and starts the episode there, so every choice before it is kept.

In Season 4, Rewind opens straight onto a picture of your latest point, with Previous, Next and Rewind here. Each of the 58 rewind points has its own screenshot from the start of its scene, taken with a separate tool that drives the game through every scene. Season 3's list shows the location paintings in its More Options window instead.
{{< /feature >}}

### Getting the mod loaded

Season 2 only needed one script replaced. In Seasons 3 and 4 I didn't want to replace anything, so the mod has to be loaded by something the game already asks for:

- Every season's main menu loads `DebugLoader.lua` if it exists. Only Telltale's developer builds have one, so the mod ships one that loads the rewind menu.
- Season 4 episodes load a `GameOverrides.lua`. The mod's copy runs the stock one first, then loads the mod.
- While you play, the mod saves at the start of each scene. Michonne's episodes already save a numbered copy when a checkpoint names its chapter; Seasons 3 and 4 never pass one, so the mod passes the scene's name for the first checkpoint of each scene and the stock save code does the rest.

Season 4 is tested in game. Season 3 is new in 2.0.0 and hasn't been fully checked yet; its episodes don't load the mod, so its rewind points rely on the choice log alone.
