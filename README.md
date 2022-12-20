![](https://img.shields.io/badge/Foundry-v10.0.0-informational)![Last Release Download Count](https://img.shields.io/github/downloads/xlilcasper/mat-action-library/0.0.1/module.zip)![Latest Release Download Count](https://img.shields.io/github/downloads/xlilcasper/mat-action-library/latest/module.zip)
<!--- Downloads @ Latest Badge -->
<!--- replace <user>/<repo> with your username/repository -->
<!--- ![Latest Release Download Count](https://img.shields.io/github/downloads/xlilcasper/mat-action-library/latest/module.zip) -->

<!--- Forge Bazaar Install % Badge -->
<!--- replace <your-module-name> with the `name` in your manifest -->
<!--- ![Forge Installs](https://img.shields.io/badge/dynamic/json?label=Forge%20Installs&query=package.installs&suffix=%25&url=https%3A%2F%2Fforge-vtt.com%2Fapi%2Fbazaar%2Fpackage%2Fmat-action-library&colorB=4aa94a) -->

# Under Development
**this module is in the early stages of development and may have bugs. Actions may change between one version and the next and are not currently considered stable**

## What is MAT Action Library?
This module adds several more actions to Monk's Active Tiles action list. This library is a way for me to add in actions that I thought were missing or haven't been officially implemented yet.

## Additional Actions
- Core - Base functionality
  - Console Log - Mostly used for debugging. Dumps to the console
  - Filter Tile Center Distance - Filter by distance for tiles. Note: This only works right now based upon the center of the tiles, not the edges.
  - Reset Tile - Adds an extra automatic landing _reset. When the reset tile action is called it will trigger the tiles and jump to the _reset landing
  
- Tagger
  - Find by tags - Returns all entities on the current scene that match a tag.
  - Has Tag - Filters entities by a given tag. Works without knowing the index of the tag
  
## Download
`https://github.com/xlilcasper/mat-action-library/releases/latest/download/module.json`

## Special Thanks
Thanks Iron Monk! Your module is fantastic and exactly what I needed to ditch 15 other modules.
- Some code in this module is shamefully copy & paste from his while I learn the code base and work out what everything does.
