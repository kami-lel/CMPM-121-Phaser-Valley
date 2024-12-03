# CMPM-121-Phaser-Valley

# Devlog Entry F.1 - 12/3/2024

## Requirements

- Character Moves on 2d Grid  
- - Same as last week  
- Time Advances Manually  
- - Same as last week  
- Proximity-Based Reaping and Sowing  
- - Same as last week  
- Grid Cells Have Sun And Water Levels  
- - Same as last week  
- Each Plant Has Both a Type and a Growth Level  
- - Same as last week  
- Plant Growth is Governed by Simple Spatial Rules  
- - Same as last week  
- Scenario is Completed When Some Condition is Satisfied  
- - Same as last week  
- Cell Information is Stored as an Array of Structs or a Struct of Arrays  
- -  Our grid cell information is stored as an array of structs using ArrayBuffers, following the format depicted below.  

packet-beta
title Game State Buffer
0: "Player Position"
1-2: "Money"
3-4: "Days"
5-54: "Grid cells, each cell is 2 bytes"

- Infinite Undos and Redos  
- - Undos and Redos are implemented as a pair of stacks.  Sowing and reaping plants and advancing time add a snapshot of the game state to the undo stack in the form of an ArrayBuffer as depicted above.  Pressing the undo button moves the top of the undo stack to the redo stack and loads the game state from the new top of the undo stack.  Pressing the redo button moves the top of the redo stack to the undo stack, then loads from the new top of the undo stack as before.  Adding a new snapshot to the undo stack by any means other than the redo button clears the redo stack.  
- Multiple Save Files and Autosaving  
- - The game maintains three save files and one autosave in local storage.  The save files are manually saved to using the save button, while the autosave updates whenever the time is advanced.

## Reflection

Add Info Here  


# Devlog Entry F.0 - 12/3/2024

## Requirements

### Controlled Character Moves Across a 2d Grid

The player can traverse a 5x5 grid using the arrow keys.  

### Time Advances Manually

There is a button onscreen that advances time for all the cells, updating them based on rules explained below.  Time does not pass while the player is walking around.  

### Proximity-Based Reaping and Sowing

The player can only sow a new plant or reap a fully grown plant if they are in the same cell as it.  

### Grid Cells Have Sun And Water Levels

Each cell has both a sun level and a water level, displayed as an integer value.  Sun levels are randomized between 0 and 5 every turn.  Each cell gains anywhere between 0 and 3 water level per turn, and loses 2 water level if it has both at least 1 sun and a plant of growth stage 0 (just planted) or 1 (partially grown).  

### Each Plant Has Both a Type and a Growth Level

There are three kinds of plants - mushrooms, grass, and pumpkins.  Each plant has three stages of growth, and a different value when reaped, which can only be done when the plant is fully grown.  

### Plant Growth is Governed by Simple Spatial Rules

When a cell has a plant that is not fully grown, and the cell has at least 1 sun and 2 water, then the plant's growth stage increases by 1 and the water level of the cell decreases by 2.  

### Scenario is Completed When Some Condition is Satisfied

The scenario is completed once the player has obtained $100 by reaping fully grown plants.  This can be achieved in as little as two turns by planting two pumpkins and getting lucky with the sun levels.  

## Reflection

We determined that Tiled was not necessary to our project, so we have decided to cut it from the project.  In addition, Haorong has been promoted to Design Lead, as Erik has been MIA for the past few weeks.  


# Devlog Entry - 11/13/2024
## Introducing the Team

Erik Lu / kami-lel: Design Lead

Haorong Rong / hrong1: Design Backup Lead

Ian Wallace / 14N-W4774c3: Engine Lead

Jc Zaragoza / Jzara3115: Tools Lead

## Tools and Materials

We intend to use the Phaser3 framework, as we're all familiar with it and it provides some simple options for changing engines partway through the assignment.  

We will start out working in JavaScript. We all took CMPM 120, so this is nothing new. This allows us to focus on making the game within the remaining time in the course.  

We expect to be using Tiled for some graphical assets and Visual Studio for coding. Again, these are things we're all familiar with, so we can focus on swapping over and making the game instead of getting distracted learning new tools. We may also make use of some open source assets, to minimize the time spent on non-coding tasks.  

We will be swapping to Phaser3 / TypeScript. Some members of the group expressed a dislike of Javascript, so we decided to swap away from it rather than swapping to it.  

## Outlook

For the most part, we're looking to focus on learning how to handle transitioning from one engine to another, with minimal focus on the added difficulty of learning new tools, frameworks, or languages. We're not taking any particular additional risks or challenges - those are good ways to miss deadlines, and we're in the holiday season.
