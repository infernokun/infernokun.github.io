---
title: Bringing Chapter Rewind Back to Season 2
description: The Definitive Series quietly turned off rewind in The Walking Dead Season 2. I found the switch in the menu script and turned it back on.
slug: twd-season-2-rewind
date: 2026-10-19
featureimage: cover.png
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

The Telltale Definitive Series bundles all four seasons plus Michonne into one game. Seasons 1, 3, 4 and Michonne still have a rewind menu. Season 2 doesn't. Open an episode and all you get is Restart Episode.

So I went looking for the difference between the two releases.

[Source and release on GitHub](https://github.com/infernokun/TWD-Definitive-Season2-Rewind)

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

- `WDC_pc_Mod_S2Rewind_data.ttarch2`, holding only the patched `Menu_chapters.lua`
- `_resdesc_50_Mod_S2Rewind.lua`, which registers it at priority 700 under the Season 2 menu

```lua
local set = {}
set.name = "Mod_S2Rewind"
set.logicalDestination = "<MenuSeason2>"
set.priority = 700
set.gameDataArchives = { _currentDirectory .. "WDC_pc_Mod_S2Rewind_data.ttarch2" }
RegisterSetDescription(set)
```

The descriptor has to be encrypted the same way the game's own are, with an `ESC LEo` marker in front. To check that, I decrypted Telltale's own patch descriptor, encrypted it again, and compared: the header matched the game's file and decrypting it gave back the original text.

Nothing in the game is modified. Delete the two files and it's stock again, and Steam's file check leaves them alone because they're additions, not replacements.

## Testing it

Rewinding deletes the saves after the chapter you pick, same as the original game. Before trying it I copied my Season 2 save slot into an empty slot and tested on the copy. The chapter panels came back, Rewind showed up, and it worked.

The build script doesn't ship any of Telltale's files. It pulls the stock script out of your own install, patches it, packs it, then extracts and decrypts the result again to check both round trips.

{{< feature img="launcher.png" alt="Season 2 Rewind installed through the launcher" side="left" >}}
### With the mod launcher

The mod also works with the [Telltale Mod Launcher](/projects/telltale-mod-launcher-0-7/), which is how it's installed here.

Version 1.0.1 only renamed its info file to `modinfo_season2_rewind.json` so it's obvious in the Archives folder which mod it belongs to.
{{< /feature >}}
