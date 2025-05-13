when I receive (moveCat)
{
  go to x:catX, y:catY
}

When I receive (updateCostume)
{  
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
