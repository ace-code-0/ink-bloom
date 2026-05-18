import { texts } from './textAnimation/textData.js';
import { generateHeartPoints } from './textAnimation/heartPath.js';
import { animateText } from './textAnimation/textAnimator.js';
import {
  Application,
  Assets,
  Graphics,
  Point,
  RenderTexture,
  Sprite,
} from 'pixi.js';
import bgGrass from './assets/images/bg_grass.jpg';
import bgRotate from './assets/images/bg_rotate.jpg';

// textAnimation
const container = document.getElementById('app');
const points = generateHeartPoints(100, 12);
animateText(container, points, texts);

// PIXI (毛笔遮罩)
(async () => {
  const app = new Application();
  await app.init({ resizeTo: window });
  document.body.appendChild(app.canvas);
  Object.assign(app.canvas.style, {
    position: 'absolute',
    top: '0',
    left: '0',
    width: '100%',
    height: '100%',
    zIndex: '0',
  });

  await Assets.load([bgGrass, bgRotate]);
  const { width, height } = app.screen;

  const background = Object.assign(Sprite.from(bgGrass), { width, height });
  const imageToReveal = Object.assign(Sprite.from(bgRotate), { width, height });

  const renderTexture = RenderTexture.create({ width, height });
  const renderTextureSprite = new Sprite(renderTexture);

  imageToReveal.mask = renderTextureSprite;
  app.stage.addChild(background, imageToReveal, renderTextureSprite);

  app.stage.eventMode = 'static';
  app.stage.hitArea = app.screen;

  // 毛笔线条
  const line = new Graphics();
  const brushLines = Array.from({ length: 25 }, () => ({
    offsetX: Math.random() * 20 - 10,
    offsetY: Math.random() * 20 - 10,
  }));

  let dragging = false;
  let lastDrawnPoint = null;

  function pointerMove({ global: { x, y } }) {
    if (!dragging) return;

    if (lastDrawnPoint) {
      for (const point of brushLines) {
        line
          .moveTo(
            lastDrawnPoint.x + point.offsetX,
            lastDrawnPoint.y + point.offsetY,
          )
          .lineTo(x + point.offsetX, y + point.offsetY)
          .stroke({ width: 2, color: 0xffffff });
      }
      // 渲染到 renderTexture
      app.renderer.render(line, { renderTexture, clear: false });
    }

    if (!lastDrawnPoint) lastDrawnPoint = new Point();
    lastDrawnPoint.set(x, y);
  }

  function pointerDown(event) {
    dragging = true;
    lastDrawnPoint = new Point(event.global.x, event.global.y);
  }

  function pointerUp() {
    dragging = false;
    lastDrawnPoint = null;
    setTimeout(() => line.clear(), 5000);
  }

  app.stage
    .on('pointerdown', pointerDown)
    .on('pointerup', pointerUp)
    .on('pointerupoutside', pointerUp)
    .on('pointermove', pointerMove);
})();
