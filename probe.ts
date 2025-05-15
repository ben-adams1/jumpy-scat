when I receive (ghostProbe)
  {
    set ghost effect to (100)                                       // Hide the probe
  }

when I receive (moveProbe)
{
  go to (x: (probeX), y: (probeY))
}

when I receive (probeUp)
{
  if (touching [level1Ceiling] == true)
  {
    set (hasTouchedCeiling) to true
  }
   if (touching [danger] == true)
  {
    set (hasTouchedDanger) to true
  }
}

when I receive (probeDown)
{
  if (touching [level1ground] == true) 
  {
    set (hasTouchedGround) to true
  }
   if (touching [danger] == true)
  {
    set (hasTouchedDanger) to true
  }
}  

when I receive (probeSideways)
{
  if (touching [level1wall] ==  true) 
  {
    set (hasTouchedWall) to true
  }
  
  if (touching [danger] == true)
  {
    set (hasTouchedDanger) to true
  }
}
