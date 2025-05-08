# Read Me

## 1. Purpose
This is pseudocode, used to describe a Scratch animation. 

## 2. Philosophical Approach
Most Scratch animations make use of at least a few repeat loops. These can bog down the animation if the code execution gets stuck in the loop. The `repeat until not(Touching Level)` is particularly troublesome. 
While `for` loops are an important and useful feature, they are a more advanced programming concept than where I want to start for this project. As a result, this Scratch animation is designed to avoid all repeat loops except for the main `forever` loop.

## 3. Pragmatics
The `hitbox` sprite has the main code.
A `probe` sprite is used for collision detection.
Ground, ceiling, and walls are designed to be separate sprites. Collision detection is by sprite color. This can be easily modified later.

## 4. Sprites
Hitbox           ← collision area (can be hidden)  
Ceiling          ← grey
FloorLeft        ← green, goes from the bottom of the screen, up a bit and about 2/3 to the right
Wall             ← brown, starts where FloorLeft ends, but goes higher, extends to right edge of screen
FloorRight       ← green, thin rectangle sitting on top of the Wall
Probe            ← approximately 1×1px sprite (hidden) for wall‐vs‐floor tests
Cat              ← the sprite that actually moves around in the game

## 5. Global Variables
catX            (number)
catY            (number)
probeX          (number)
probeY          (number)
hasTouchedGrey  (boolean)
hasTouchedGreen (boolean)
hasTouchedBrown (boolean)

## 6. Broadcasts in the Events Palette
moveCat
moveProbe
ghostProbe
probeCeiling
probeFloor
probeWall
