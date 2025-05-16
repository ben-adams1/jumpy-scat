when (Green_Flag == clicked)
{
  initialize()
  forever  
  {
    // Step-Check-Revert
    readAndProcessPlayerInput()
    applyGravityToVerticalSpeed()
    moveAndEvaluateFloorAndCeilingCollisions()
    updateJumpAndFallFlags()
    moveAndEvaluateAndWallCollisions()
    wait (0) seconds
  }
}

define initialize()
{
  set (spawnX) to -127                                             // Hitbox will initially appear with the left edge this 
                                                                   // many pixels from the left edge of the screen
  set (spawnY) to -65                                              // Hitbox will initially appear with the bottom edge
                                                                   // this many pixels from the bottom edge of the screen,
                                                                   // which is above the ground, so it will start falling
  set (hitboxWidth) to 75                                          // Hitbox width
  set (hitboxHeight) to 66                                         // Hitbox height  
  set (initialHorizontalMovePixels) to  (round((hitBoxHeight) / 4)) // Move the hitbox this many pixels horizontally when 
                                                                   // left or right key is pressed
                                                                   // this value can be modified later in the code to speed 
                                                                   // it up or slow it down
                                                                   // but this is the base amount, also known as moveSpeed
  set (initialVerticalJumpPixels) to ((hitBoxHeight) * 3)          // Move the hitbox this many pixels vertically when up 
                                                                   // key is pressed.
                                                                   // This value can be modified later in the code to speed 
                                                                   // it up or slow it down.
                                                                   // but this is the base amount, also known as jumpSpeed
  set (pixelsToFallEachFrame) to  (round((hitBoxHeight) / 4))      // Move the hitbox this many pixels vertically when 
                                                                   // falling. 
                                                                   // Also slow down rises by this many pixels when jumping.
                                                                   // This value can be modified later in the code to 
                                                                   // speed it up or slow it down.
                                                                   // but this is the base amount, also known as gravity
  set (isStandingOnTheGround) to false                             // Tracks hitbox state of being on the ground or not
  set (hasBumpedIntoTheCeiling) to false                           // Tracks hitbox state of having bumped into the ceiling 
                                                                   // during a jump
                                                                   // or if the sprite was crouched and tried to stand up 
                                                                   // in a short cave/tunnel
  set (isRising) to false                                          // Tracks hitbox state of jumping
  set (isFalling) to true                                          // Tracks hitbox state of falling
  set (isAtPeakOfJump) to false                                    // Tracks hitbox state of being at top of jump, about to 
                                                                   // start falling
  set (horizontalPixelsToMoveThisFrame) to 0                       // Initialize this as 0 since it just started
  set (verticalPixelsToMoveThisFrame) to 0                         // Initialize this as 0 since it just started  
  set (maxPixelsToFallPerFrame) to 10                              // Keeps gravity from accelerating the hitbox so fast 
                                                                   // that it goes through the ground before we can catch it
  set (hasTouchedGround) to false                                  // Used for detecting ground
  set (hasTouchedCeiling) to false                                 // Used for detecting ceilings
  set (hasTouchedWall) to false                                    // Used for detecting walls
  set (hasTouchedDanger) to false                                  // Used for detecting spikes, lava, etc.
  set (previousFrameXPosition) to (spawnX)                         // Basically starting this out at the origin
  set (previousFrameYPosition) to (spawnY)                         // Basically starting this out at the origin
  broadcast (ghostProbe)                                           // Hide the probe that we use for detecting wall collisions 
                                                                   // since it's not part of our artwork
  set (ghost) effect to (100)                                      // Hide the hitbox
  go to (x: (spawnX), y: (spawnY))                                 // Make the hitbox appear at the spawn origin
}

define readAndProcessPlayerInput()
{
  // Start by evaluating keypresses for horizontal movement
  if (((key (left arrow) pressed) or (key (a) pressed)) and ((key (right arrow) pressed) or (key (d) pressed))) // Treat them as canceling each other out
  {
    set (horizontalPixelsToMoveThisFrame) to 0                     // Don't move left or right
  }
  else
  {
    if ((key (left arrow) pressed) or (key (a) pressed))
    {
      set (horizontalPixelsToMoveThisFrame) to ((0) - (initialHorizontalMovePixels)) // Set a negative amount to go left
    }
    else
    {
      if ((key (right arrow) pressed) or (key (d) pressed))
      {
        set (horizontalPixelsToMoveThisFrame) to (initialHorizontalMovePixels) // Set a positive amount to go right
      }
      else                                                         // No left or right key was pressed
      {
        set (horizontalPixelsToMoveThisFrame) to 0                 // Don't move left or right
      }
    }
  }
  
  // Now, evaluate keypresses for vertical movement
  if (((isStandingOnTheGround) = true) and ((key (up arrow) pressed) or (key (w) pressed))) // Hitbox was standing on ground and up key was pressed
  {                                                                // This is a legitimate jump request
    set (verticalPixelsToMoveThisFrame) to (initialVerticalJumpPixels) // Set a positive amount to go up
  }
  else
  {
    if ((isRising == true) and not((key (up arrow) pressed) or (key (w) pressed))) // Hitbox is rising, but jump not up key not pressed
    {
      set (verticalPixelsToMoveThisFrame) to 0
    }
  }
}

define applyGravityToVerticalSpeed()  
{
  if ((isStandingOnTheGround) == false)
  {
    change (verticalPixelsToMoveThisFrame) by (0 - (pixelsToFallEachFrame)) // In preparation for the next frame,
                                                                   // update the distance to move the hitbox vertically 
                                                                   // next time, either slowing a jump, or increasing
                                                                   // fall speed
    if ((verticalPixelsToMoveThisFrame) < (0 - (maxPixelsToFallPerFrame))) // Hitbox is falling too fast
    {
      set (verticalPixelsToMoveThisFrame) to (0 - (maxPixelsToFallPerFrame)) // Cap the fall speed
    }
  }
  else
  {
    set (verticalPixelsToMoveThisFrame) to 0                       // Already on the ground
  }
}  

define moveAndEvaluateFloorAndCeilingCollisions()
{
  // Determine where to put the probe on the X axis (in case we need it)
  // Set our steps to be positive (jumping) or negative (falling)
  if ((verticalPixelsToMoveThisFrame) > 0)                         // We're jumping
  {
    set (oneStep) to 1                                             // This will let us move upward one pixel at a time
  }
  else                                                             // We're not jumping
  {
    if ((verticalPixelsToMoveThisFrame) < 0)                       // We're falling 
    {
      set (oneStep) to -1                                          // This will let us move downward one pixel at a time  
    }
    else                                                           // We're not jumping or falling
    {
      set (oneStep) to 0                                           // This will ensure we don't move vertically this frame
    }
  }
  
  // Start a sequence where we run our 4-corner probe one pixel up or down at a time
  if(not(oneStep == 0))                                            // We're either jumping or falling
  {
    // Figure out how many pixels to probe for this frame
    set (stepsRemaining) to abs(verticalPixelsToMoveThisFrame)     // Gets us a positive number in the event we're falling
    set (hasTouchedCeiling) to false                               // Reset this from the previous frame
    set (hasTouchedGround) to false                                // Reset this from the previous frame
    repeat until (((stepsRemaining) == 0) or ((hasTouchedCeiling) == true) or ((hasTouchedGround) == true))
    // Loop through the following code the specified number of times until we hit the ceiling or ground
    {
      //savePreviousPosition()                                     // Call the procedure that backs up our existing position in case we need to revert
      change (y) by (oneStep)                                      // Move one pixel up or down
      
      // TOP LEFT
      set (probeY) to ((y position) + round(hitboxHeight / 2) + 1) // Determines the location 1 pixel outside the top edge of the hitbox
      set (probeX) to ((x position) - round(hitboxWidth / 2) - 1)  // Determines the location 1 pixel outside the left side of the hitbox 
      broadcast (moveProbe) and wait                               // Move the probe to where we want it
      broadcast (probeUp) and wait                                 // Probe for a ceiling
      
      // TOP RIGHT
      change (probeX) by (hitboxWidth + 2)                         // Determines the location 1 pixel outside the right edge of the hitbox
      broadcast (moveProbe) and wait                               // Move the probe to where we want it
      broadcast (probeUp) and wait                                 // Probe for a ceiling
      
      // BOTTOM RIGHT
      change (probeY) by (-2 - hitboxHeight)                       // Determines the location 1 pixel outside the bottom edge of the hitbox
      broadcast (moveProbe) and wait                               // Move the probe to where we want it
      broadcast (probeDown) and wait                               // Probe for ground
      
      // BOTTOM LEFT
      change (probeX) by (-2 - hitboxWidth)                        // Determines the location 1 pixel outside the left edge of the hitbox
      broadcast (moveProbe) and wait                               // Move the probe to where we want it
      broadcast (probeDown) and wait                               // Probe for a floor  
      
      change (stepsRemaining) by -1                                // Decrement the step counter so it eventually reaches 0
      // As long as stepsRemaining is still >0 and we haven't hit the ground or ceiling, this code will repeat
      resolveFloorAndCeilingCollisions()
	  renderCharacter()
    }
  }
}

define resolveFloorAndCeilingCollisions()
{
  // Start by figuring out if there was a vertical collision
  if (((hasTouchedCeiling) == true) or ((hasTouchedGround) == true)) // Probe touched the ground or ceiling
  {
    if (((verticalPixelsToMoveThisFrame) < 0) and ((hasTouchedGround) == true)) // Hitbox landed
    {
      set (isStandingOnTheGround) to true                       
      set (hasBumpedIntoTheCeiling) to false                       // Reset the variable for reuse in the next frame
      set (hasTouchedGround) to false                              // Reset the variable for reuse in the next frame
      change (y) by 1                                              // Move up 1 pixel so we're not in the ground
    }
    if (verticalPixelsToMoveThisFrame > 0 and (hasTouchedCeiling) == true) // Hitbox hit its head
    {
      set (hasBumpedIntoTheCeiling) to true
      set (hasTouchedCeiling) to false                             // Reset the variable for reuse in the next frame
      change (y) by -1                                             // Move down 1 pixel so we're not in the ceiling
    }
    set (verticalPixelsToMoveThisFrame) to 0                       // Reset this before reusing for the next frame
    set (stepsRemaining) to 0
  }
  else                                                             // Hitbox has not landed nor bumped its head
  {
    set (isStandingOnTheGround) to false
    set (hasBumpedIntoTheCeiling) to false
  }
}

define updateJumpAndFallFlags()
{
  // Determine whether hitbox is rising
  if ((y position) > (previousFrameYPosition))                     // Hitbox is higher than before
  {
    set (isRising) to true
    set (isFalling) to false
    set (isAtPeakOfJump) to false
  }
  else                                                             // Hitbox is not higher than before
  {
    // Determine whether hitbox is falling or stationary
    if ((y position) < (previousFrameYPosition))                   // Hitbox is lower than before
    {
      set (isRising) to false
      set (isFalling) to true
      set (isAtPeakOfJump) to false
    }
    else                                                           // Hitbox is at the same height as before
    {                                                              // If hitbox is airborne, this is the apex
      set (isRising) to false
      set (isFalling) to false
      if ((isStandingOnTheGround) = false)                         // Hitbox is airborne and thus at the apex
      {
        set (isAtPeakOfJump) to true
      }
      else                                                         // Hitbox is on the ground
      {
        set (isAtPeakOfJump) to false
      }
    }
  }
  set (previousFrameYPosition) to (y position)                     // For use in the next frame
}

define moveAndEvaluateAndWallCollisions()  
{
  if ((horizontalPixelsToMoveThisFrame) > 0))                      // Hitbox is trying to move to the right
  {
    // Determine where to put the probe on the X axis and save the results in variables that we will execute on in a bit
    set (oneStep) to 1    	
  }
  else
  {
    if ((horizontalPixelsToMoveThisFrame) < 0)                     // Hitbox is trying to move to the left
    {
      set (oneStep) to -1 
    }
    else
    {
      set (oneStep) to 0
    }
  }
  if (not((oneStep) == 0))
  {
    set (stepsRemaining) to abs(horizontalPixelsToMoveThisFrame)
    set (hasTouchedWall) to false                                  // Reset for use in this instance
    repeat until (((stepsRemaining) == 0) or ((hasTouchedWall) == 0))
    {
      change (x) by (oneStep)
      // TOP LEFT
      set (probeY) to ((y position) + round(hitboxHeight / 2) + 1) // Determines the location 1 pixel outside the top edge of the hitbox
      set (probeX) to ((x position) - round(hitboxWidth / 2) - 1)  // Determines the location 1 pixel outside the left side of the hitbox 
      broadcast (moveProbe) and wait                               // Move the probe to where we want it
      broadcast (probeSideways) and wait                           // Probe for a ceiling
      
      // TOP RIGHT
      change (probeX) by (hitboxWidth + 2)                         // Determines the location 1 pixel outside the right edge of the hitbox
      broadcast (moveProbe) and wait                               // Move the probe to where we want it
      broadcast (probeSideways) and wait                           // Probe for a ceiling
      
      // BOTTOM RIGHT
      change (probeY) by (-2 - hitboxHeight)                       // Determines the location 1 pixel outside the bottom edge of the hitbox
      broadcast (moveProbe) and wait                               // Move the probe to where we want it
      broadcast (probeSideways) and wait                           // Probe for ground
      
      // BOTTOM LEFT
      change (probeX) by (-2 - hitboxWidth)                        // Determines the location 1 pixel outside the left edge of the hitbox
      broadcast (moveProbe) and wait                               // Move the probe to where we want it
      broadcast (probeSideways) and wait                           // Probe for a floor  
      
      change (stepsRemaining) by -1                                // Decrement the step counter so it eventually reaches 0
      // As long as stepsRemaining is still >0 and we haven't hit the ground or ceiling, this code will repeat
      resolveWallCollisions()
	  renderCharacter()
    }
  }
}

define resolveWallCollisions()
{
  if((hasTouchedWall) == true)
  {
    if((horizontalPixelsToMoveThisFrame) > 0)
    {
      change (x) by -1
    }
    else
    {
      if((horizontalPixelsToMoveThisFrame) < 0)
      {
        change (x) by -1
      }
    }
    set (horiztonalPixelsToMoveThisFrame) to 0
    set (stepsRemaining) to 0
  }
}

define renderCharacter()   
{  
  
  broadcast (ghostProbe)                                           // Make sure the the probe is still hidden
	
  // Sync cat sprite position to the hitbox  
  broadcast (moveCat)                                              // Call the cat sprite code to actually move the cat to these coordinates


  // Flip sprite to face movement direction and apply walking animation
  broadcast (updateCostume)
}
