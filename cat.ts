when I receive (moveCat)
{
  go to (Hitbox)
}

when I receive (updateCostume)
{  
  if ((horizontalPixelsToMoveThisFrame) > 0)
  {
    point in direction (90)                                        // Face right
    animateRunning()
  }
  else 
  {
    if ((horizontalPixelsToMoveThisFrame) < 0)  
    {
      point in direction (-90)                                       // Face left
      animateRunning()
    }
    else
    {
      switch costume to (costume3)
    }
  }
}

define animateRunning()
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

define animateJumping() // Future
{
  if (isRising = true)
  {
    switch costume to (costume4)
  }
  if (isAtPeakOfJump = true)
  {
    switch costume to (costume5)
  }  
  if (isFalling = true)
  {
    switch costume to (costume6)
  }
}
