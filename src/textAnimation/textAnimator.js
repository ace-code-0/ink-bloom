export function animateText(container, points, texts) {
  const textElements = [];
  const centerX = container.clientWidth / 2;
  const centerY = container.clientHeight / 2;

  // 创建 DOM 元素
  points.forEach((p, i) => {
    const span = document.createElement('span');
    span.textContent = texts[i % texts.length];
    span.style.position = 'absolute';
    span.style.left = `${centerX}px`;
    span.style.top = `${centerY}px`;
    span.style.opacity = 0;
    span.style.zIndex = 1;
    span.style.transition = 'all 2s ease-out, opacity 1.5s ease-in';
    span.style.userSelect = 'none';
    container.appendChild(span);
    textElements.push({
      el: span,
      targetX: centerX + p.x + randomOffset(10),
      targetY: centerY + p.y + randomOffset(10),
    });
  });

  // 延迟触发动画
  requestAnimationFrame(() => {
    textElements.forEach((t, idx) => {
      setTimeout(() => {
        t.el.style.left = t.targetX + 'px';
        t.el.style.top = t.targetY + 'px';
        t.el.style.opacity = 1;
      }, idx * 20); // 每个文字延迟
    });
  });
}

function randomOffset(max = 10) {
  return Math.random() * 2 * max - max;
}
