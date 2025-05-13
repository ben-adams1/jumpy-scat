when I receive (moveCat)
{
  go to x:catX, y:catY
}

When I receive (updateCostume)
{  
  if (horizontalPixelsToMoveThisFrame > 0)
  {
    point in direction (90)                                        // Face right
    run()
  }
  else if (horizontalPixelsToMoveThisFrame < 0)  
  {
    point in direction (-90)                                       // Face left
    run()
  }
  else
  {
    switch costume to [idle]
  }

define run()
	{ 
    if (costume (number) = 1)
    { 
      switch costume to (costume2)
    }
    else
    { 
      switch costume to (costume1)
    }
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
