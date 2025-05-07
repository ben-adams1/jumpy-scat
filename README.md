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
