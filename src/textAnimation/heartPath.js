// 生成心形路径采样点
export function generateHeartPoints(numPoints = 200, scale = 10) {
  const points = [];
  for (let i = 0; i < numPoints; i++) {
    const t = (i / numPoints) * 2 * Math.PI;
    const x = scale * 16 * Math.pow(Math.sin(t), 3);
    const y =
      -scale *
      (13 * Math.cos(t) -
        5 * Math.cos(2 * t) -
        2 * Math.cos(3 * t) -
        Math.cos(4 * t));
    points.push({ x, y });
  }
  return points;
}
