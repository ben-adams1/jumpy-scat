when I receive (ghostProbe)
  {
    set (ghost) effect to (100)                                       // Hide the probe
  }

when I receive (moveProbe)
{
  go to (x: (probeX), y: (probeY))
}

when I receive (probeUp)
set (hasTouchedCeiling) to false
set (hasTouchedDanger) to false
{
  if (touching (level1Ceiling))
  {
    set (hasTouchedCeiling) to true
  }
   if (touching (danger))
  {
    set (hasTouchedDanger) to true
  }
}

when I receive (probeDown)
set (hasTouchedGround) to false
set (hasTouchedDanger) to false
{
  if (touching (level1ground)) 
  {
    set (hasTouchedGround) to true
  }
   if (touching (danger))
  {
    set (hasTouchedDanger) to true
  }
}  

when I receive (probeSideways)
set (hasTouchedWall) to false
set (hasTouchedDanger) to false
{
  if (touching (level1wall)) 
  {
    set (hasTouchedWall) to true
  }
  
  if (touching (danger))
  {
    set (hasTouchedDanger) to true
  }
}
