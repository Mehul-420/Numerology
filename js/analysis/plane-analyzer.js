import { planeDefinitions } from '../utils/constants.js';

export function analyzePlanes(counts) {
  const activePlanes = [];
  const partiallyActivePlanes = [];
  const inactivePlanes = [];
  const strongPlanes = [];
  const weakPlanes = [];

  planeDefinitions.forEach(plane => {
    const present = plane.nums.filter(n => counts[String(n)]);
    const isFull = present.length === plane.nums.length;
    
    if (isFull) {
      activePlanes.push(plane.name);
      // Check for repeating numbers in the plane to define "Strong"
      const isStrong = plane.nums.some(n => counts[String(n)].length >= 2);
      if (isStrong) strongPlanes.push(plane.name);
    } else if (present.length > 0) {
      partiallyActivePlanes.push(plane.name);
    } else {
      inactivePlanes.push(plane.name);
      weakPlanes.push(plane.name);
    }
  });

  return { activePlanes, partiallyActivePlanes, inactivePlanes, strongPlanes, weakPlanes };
}
