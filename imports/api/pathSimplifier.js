/*
  Adapted from:
  (c) 2013, Vladimir Agafonkin
  Simplify.js, a high-performance JS polyline simplification library
  mourner.github.io/simplify-js
*/

export default PathSimplifier = (points, tolerance, highestQuality) => {
  const sqTolerance = tolerance !== undefined ? tolerance * tolerance : 1;
  // both algorithms combined for awesome performance
  points = highestQuality ? points : simplifyRadialDist(points, sqTolerance);
  points = simplifyDouglasPeucker(points, sqTolerance);
  return points;
}

// square distance between 2 points
const getSqDist = (p1, p2) => {
  const dx = p1.x - p2.x;
  const dy = p1.y - p2.y;
  return dx * dx + dy * dy;
}

// square distance from a point to a segment
const getSqSegDist = (p, p1, p2) => {
  let x = p1.x;
  let y = p1.y;
  let dx = p2.x - x;
  let dy = p2.y - y;
  if (dx !== 0 || dy !== 0) {
    const t = ((p.x - x) * dx + (p.y - y) * dy) / (dx * dx + dy * dy);
    if (t > 1) {
      x = p2.x;
      y = p2.y;
    } else if (t > 0) {
      x += dx * t;
      y += dy * t;
    }
  }
  dx = p.x - x;
  dy = p.y - y;
  return dx * dx + dy * dy;
}
// rest of the code doesn't care about point format

// basic distance-based simplification
const simplifyRadialDist = (points, sqTolerance) => {
  let prevPoint = points[0];
  let newPoints = [prevPoint];
  let point;
  for (let i = 1, len = points.length; i < len; i++) {
    point = points[i];
    if (getSqDist(point, prevPoint) > sqTolerance) {
      newPoints.push(point);
      prevPoint = point;
    }
  }
  if (prevPoint !== point) {
    newPoints.push(point);
  }
  return newPoints;
}

// simplification using optimized Douglas-Peucker algorithm with recursion elimination
const simplifyDouglasPeucker = (points, sqTolerance) => {
  let len = points.length;
  let MarkerArray = typeof Uint8Array !== 'undefined' ? Uint8Array : Array;
  let markers = new MarkerArray(len);
  let first = 0;
  let last = len - 1;
  let stack = [];
  let newPoints = [];
  let i;
  let maxSqDist;
  let sqDist;
  let index;
  markers[first] = markers[last] = 1;
  while (last) {
    maxSqDist = 0;
    for (i = first + 1; i < last; i++) {
      sqDist = getSqSegDist(points[i], points[first], points[last]);
      if (sqDist > maxSqDist) {
        index = i;
        maxSqDist = sqDist;
      }
    }
    if (maxSqDist > sqTolerance) {
      markers[index] = 1;
      stack.push(first, index, index, last);
    }
    last = stack.pop();
    first = stack.pop();
  }

  for (i = 0; i < len; i++) {
    if (markers[i]) {
      newPoints.push(points[i]);
    }
  }
  return newPoints;
}