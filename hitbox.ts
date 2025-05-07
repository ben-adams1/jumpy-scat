////////////////////////////////////////////////////////////////////////////////
// MAIN GAME LOOP
////////////////////////////////////////////////////////////////////////////////
When Green Flag clicked  
{
  initialize()
  forever  
  {
    // Step-Check-Revert
    readAndProcessPlayerInput()
    savePreviousPosition()
    moveVerticallyOneStep()
    evaluateFloorAndCeilingCollisions()
    resolveFloorAndCeilingCollisions()
    applyGravityToVerticalSpeed()
    updateJumpAndFallFlags()
    moveHorizontallyOneStep()
    evaluateAndResolveWallCollisions()
    renderCharacter()
    wait (0) seconds
  }
}

////////////////////////////////////////////////////////////////////////////////
// PROCEDURE: initialize
// declare variables and set to a default non-null value
////////////////////////////////////////////////////////////////////////////////
define initialize()
{
  set spawnX to -127                                               // Hitbox will initially appear with the left edge this 
                                                                   // many pixels from the left edge of the screen
  set spawnY to -65                                                // Hitbox will initially appear with the bottom edge
                                                                   // this many pixels from the bottom edge of the screen,
                                                                   // which is above the ground, so it will start falling
  set hitboxWidth to 75                                            // Hitbox width
  set hitboxHeight to 66                                           // Hitbox height  
  set initialHorizontalMovePixels to 5                             // Move the hitbox this many pixels horizontally when 
                                                                   // left or right key is pressed
                                                                   // this value can be modified later in the code to speed 
                                                                   // it up or slow it down
                                                                   // but this is the base amount, also known as moveSpeed
  set initialVerticalJumpPixels to 10                              // Move the hitbox this many pixels vertically when up 
                                                                   // key is pressed
                                                                   // this value can be modified later in the code to speed 
                                                                   // it up or slow it down
                                                                   // but this is the base amount, also known as jumpSpeed
  set pixelsToFallEachFrame to 1                                   // Move the hitbox this many pixels vertically when 
                                                                   // falling
                                                                   // slow rises this many pixels, causing the hitbox to 
                                                                   // slow down when jumping
                                                                   // this value can be modified later in the code to 
                                                                   // speed it up or slow it down
                                                                   // but this is the base amount, also known as gravity
  set isStandingOnTheGround to false                               // Tracks hitbox state of being on the ground or not
  set hasBumpedIntoTheCeiling to false                             // Tracks hitbox state of having bumped into the ceiling 
                                                                   // during a jump
                                                                   // or if the sprite was crouched and tried to stand up 
                                                                   // in a short cave/tunnel
  set isRising to false                                            // Tracks hitbox state of jumping
  set isFalling to false                                           // Tracks hitbox state of falling
  set isAtPeakOfJump to true                                       // Tracks hitbox state of being at top of jump, about to 
                                                                   // start falling
  set horizontalPixelsToMoveThisFrame to 0                         // Initialize this as 0 since it just started
  set verticalPixelsToMoveThisFrame to 0                           // Initialize this as 0 since it just started  
  set maxPixelsToFallPerFrame to 10                                // Keeps gravity from accelerating the hitbox so fast 
                                                                   // that it goes through the ground before we can catch it
  set hasTouchedGreen to false                                     // Used for detecting ground
  set hasTouchedGrey to false                                      // Used for detecting ceilings
  set previousFrameYPosition to y position of Hitbox               // Basically starting this out at the origin
  broadcast ghostProbe                                             // Hide the Probe that we use for 
                                                                   // detecting wall collisions since it's not part of 
                                                                   // our artwork
  set Hitbox [ghost] to (100)                                      // Also hide the hitbox
  go to Hitbox x spawnX y spawnY                                   // Make the hitbox appear at the spawn origin
}

////////////////////////////////////////////////////////////////////////////////
// PROCEDURE: readAndProcessPlayerInput
////////////////////////////////////////////////////////////////////////////////
define readAndProcessPlayerInput()
{
  // Start by evaluating keypresses for horizontal movement
  if (key [left arrow] pressed and key [right arrow] pressed)      // Treat them as canceling each other out
  {
    set horizontalPixelsToMoveThisFrame to 0                       // Don't move left or right
  }
  else
  {
    if (key [left arrow] pressed)
    {
      set horizontalPixelsToMoveThisFrame to ((0) - initialHorizontalMovePixels) // Set a negative amount to go left
    }
    else
    {
      if (key [right arrow] pressed)
      {
        set horizontalPixelsToMoveThisFrame to initialHorizontalMovePixels // Set a positive amount to go right
      }
      else                                                         // No left or right key was pressed
      {
        set horizontalPixelsToMoveThisFrame to 0                   // Don't move left or right
      }
    }
  }
  
  // Now, evaluate keypresses for vertical movement
  if (isStandingOnTheGround = true and key [up arrow] pressed)     // Hitbox was standing on ground and up key was pressed
  {                                                                // This is a legitimate jump request
    set verticalPixelsToMoveThisFrame to initialVerticalJumpPixels // Set a positive amount to go up
  }
  else if (isRising=true and not(key [up arrow] pressed))          // Hitbox is rising, but jump not up key not pressed
    set verticalPixelsToMoveThisFrame to 0  

}

////////////////////////////////////////////////////////////////////////////////
// PROCEDURE: savePreviousPosition
////////////////////////////////////////////////////////////////////////////////
define savePreviousPosition()  
{  
  set savedX to (x position of Hitbox)                             // Save a backup of where the hitbox was before on the  
                                                                   // x axis
  set savedY to (y position of Hitbox)                             // Save a backup of where the hitbox was before on the 
                                                                   // y axis
} 

////////////////////////////////////////////////////////////////////////////////
// PROCEDURE: moveVerticallyOneStep
////////////////////////////////////////////////////////////////////////////////
define moveVerticallyOneStep()  
{  
  change (y position of Hitbox) by verticalPixelsToMoveThisFrame   // Move the hitbox up or down
}  

////////////////////////////////////////////////////////////////////////////////
// PROCEDURE: evaluateFloorAndCeilingCollisions
////////////////////////////////////////////////////////////////////////////////
define evaluateFloorAndCeilingCollisions()
{
  // Determine where to put the probe on the X axis (in case we need it)
  set hasTouchedGrey to false                                      // Reset this from the previous frame
  set hasTouchedGreen to false                                     // Reset this from the previous frame
  
  // CEILING
  // Determine where to put the Probe on top of the hitbox and save the results in variables that we will use in a bit
  set probeY to ((y position of Hitbox) + round(hitboxHeight ÷ 2) + 1) // This puts the probe sprite just above the top
                                                                   // edge of the hitbox
                                                                   // (Half the distance from the center of the hitbox)
    
  set probeX to ((x position of Hitbox) - (round(hitboxWidth ÷ 2))) // Left side
  
  // Top-left
  // Now that we know where to put the probe, execute the probe movement
  broadcast (moveProbe) and wait                                   // Move the probe to where we want it
  broadcast (probeCeiling) and wait                                // Probe for a ceiling
  
  if (hasTouchedGrey = false) // Hitbox hasn't hit the ceiling yet, so check the other corner
  {
    // Top right
    change probeX by hitboxWidth
    broadcast moveProbe and wait                                   // Move the probe to where we want it
    broadcast probeCeiling and wait                                // Probe for a ceiling
  }
  
  // FLOOR or GROUND
  // Determine where to put the probe below the hitbox and save the results in variables that we will use in a bit
  change probeY by - hitboxHeight                                  // This puts the probe sprite just below the bottom
                                                                   // edge of the hitbox
                                                                   // (Half the distance from the center of the hitbox)
   
  // Bottom-right
  broadcast moveProbe and wait                                     // Move the probe to where we want it
  broadcast probeFloor and wait                                    // Probe for a floor
  
  if (hasTouchedGreen = false)                                     // Hitbox hasn't hit the floor yet, so check the other corner
  {
    // Bottom-left
    change probeX by - hitboxWidth
    broadcast moveProbe and wait                                   // Move the probe to where we want it
    broadcast probeFloor and wait                                  // Probe for a floor
  }
}

////////////////////////////////////////////////////////////////////////////////
// PROCEDURE: resolveFloorAndCeilingCollisions
////////////////////////////////////////////////////////////////////////////////
define resolveFloorAndCeilingCollisions()
{
  // If the probe touched the ground or ceiling, undo the vertical movement
  if (hasTouchedGrey = true or hasTouchedGreen = true)             // Probe touched the ground or ceiling
  {
    set (y position of Hitbox) to savedY                           // Revert the hitbox to its previous vertical position
    if (verticalPixelsToMoveThisFrame < 0 and hasTouchedGreen = true) // Hitbox landed
    {
      set isStandingOnTheGround to true
      set hasBumpedIntoTheCeiling to false
      set hasTouchedGreen to false                                 // Reset the variable for reuse in the next frame
    }
    if (verticalPixelsToMoveThisFrame > 0 and hasTouchedGrey = true) // Hitbox hit its head
    {
      set hasBumpedIntoTheCeiling to true
      set isStandingOnTheGround to false
      set hasTouchedGrey to false                                  // Reset the variable for reuse in the next frame
    }
    set verticalPixelsToMoveThisFrame to 0                         // Reset this before reusing for the next frame
  }
  else                                                             // Hitbox has not landed nor bumped its head
  {
    set isStandingOnTheGround to false
    set hasBumpedIntoTheCeiling to false
  }
}

////////////////////////////////////////////////////////////////////////////////
// PROCEDURE: applyGravityToVerticalSpeed
////////////////////////////////////////////////////////////////////////////////
define applyGravityToVerticalSpeed()  
{  
  change verticalPixelsToMoveThisFrame by ((0) - pixelsToFallEachFrame) // In preparation for the next frame,
                                                                   // update the distance to move the hitbox vertically 
                                                                   // next time, either slowing a jump, or increasing
                                                                   // fall speed
  if (verticalPixelsToMoveThisFrame > maxPixelsToFallPerFrame)     // Hitbox is falling too fast
  {
    set verticalPixelsToMoveThisFrame to maxPixelsToFallPerFrame   // Cap the fall speed
  }
}  

////////////////////////////////////////////////////////////////////////////////
// PROCEDURE: updateJumpAndFallFlags
////////////////////////////////////////////////////////////////////////////////
define updateJumpAndFallFlags()
{
  // Determine whether hitbox is rising
  if ((y position of Hitbox) > previousFrameYPosition)             // Hitbox is higher than before
  {
    set isRising to true
    set isFalling to false
    set isAtPeakOfJump to false
  }
  else                                                             // Hitbox is not higher than before
  {
    // Determine whether hitbox is falling or stationary
    if ((y position of Hitbox) < previousFrameYPosition)           // Hitbox is lower than before
    {
      set isRising to false
      set isFalling to true
      set isAtPeakOfJump to false
    }
    else                                                           // Hitbox is at the same height as before
    {                                                              // If hitbox is airborne, this is the apex
      set isRising to false
      set isFalling to false
      if (isStandingOnTheGround = false)                           // Hitbox is airborne and thus at the apex
      {
        set isAtPeakOfJump to true
      }
      else                                                         // Hitbox is on the ground
      {
        set isAtPeakOfJump to false
      }
    }
  }
  set previousFrameYPosition to (y position of Hitbox)             // For use in the next frame
}

////////////////////////////////////////////////////////////////////////////////
// PROCEDURE: moveHorizontallyOneStep
////////////////////////////////////////////////////////////////////////////////
define moveHorizontallyOneStep()  
{  
  change (x position of Hitbox) by horizontalPixelsToMoveThisFrame // Move the hitbox left or right
}  

////////////////////////////////////////////////////////////////////////////////
// PROCEDURE: evaluateAndResolveWallCollisions
////////////////////////////////////////////////////////////////////////////////
define evaluateAndResolveWallCollisions()  
{
  // First, determine whether the hitbox is trying to move horizontally
  if (not(horizontalPixelsToMoveThisFrame = 0))                    // Hitbox is trying to move horizontally 
  {
    // Determine where to put the probe on the X axis and save the results in variables that we will execute on in a bit
    set probeX to ((x position of Hitbox) - round(hitboxWidth ÷ 2) - 1) // This puts the probe sprite just outside the left edge
                                                                   // of the hitbox
                                                                   // (Half the distance from the center of the hitbox)
                                                                   // This works if the hitbox is trying to go to
                                                                   // the left, but we need to confirm direction
    if (horizontalPixelsToMoveThisFrame > 0)                       // Hitbox is trying to go to the right
    {
      change probeX by round(hitboxWidth + 2)                      // Move probe to just outside the right edge of hitbox
    }

    // Determine where to put the probe on the bottom of the hitbox
    set probeY to ((y position of Hitbox) - round(hitboxHeight ÷ 2)) // This will put the probe at the bottom of the hitbox

    // Now that we know where to put the probe, execute the probe movement
    broadcast moveProbe and wait                                   // Move the probe sprite to where we want it
    
	// Determine whether the probe is touching a wall and if so, revert the action
	if (hasTouchedBrown = true)                                      // The probe is in a wall
    {
      set x of Hitbox to savedX                                    // Revert the hitbox to its previous horizontal position
      set horizontalPixelsToMoveThisFrame to 0                     // Reset this variable to 0 for use in the next frame
    }
	
    // Determine where to put the probe on the top of the hitbox
    change probeY by hitboxHeight                                  // This will put the probe at the top of the hitbox

    // Now that we know where to put the probe, execute the probe movement
    broadcast moveProbe and wait                                   // Move the probe sprite to where we want it
    
	// Determine whether the probe is touching a wall and if so, revert the action
	if (hasTouchedBrown = true)                                      // The probe is in a wall
    {
      set x of Hitbox to savedX                                    // Revert the hitbox to its previous horizontal position
      set horizontalPixelsToMoveThisFrame to 0                     // Reset this variable to 0 for use in the next frame
    }	
  }
}

////////////////////////////////////////////////////////////////////////////////
// PROCEDURE: renderCharacter
////////////////////////////////////////////////////////////////////////////////
define renderCharacter()   
{  
  
  set Probe [ghost] to (100)
	
  // Sync position to the hitbox  
  set x position to (x position of Hitbox)
  set y position to (y position of Hitbox)

  // Flip sprite to face movement direction and apply walking animation
  if (horizontalPixelsToMoveThisFrame > 0)
  {
    point in direction (90)                                        // Face right
    next costume
  }
  else if (horizontalPixelsToMoveThisFrame < 0)  
  {
    point in direction (-90)                                       // Face left
    next costume
  }
  else
  {
    switch costume to [idle]
  }

// FUTURE
  // Animate jumping
  if (isRising = true)
  {
	switch costume to [jumping]
  }
  if (isFalling = true)
  {
    switch costume to [falling]
  }
  if (isAtPeakOfJump = true)
  {
    switch costume to [apex]
  }  
}
