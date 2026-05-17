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

// PIXI
(async () => {
  // Create a new application
  const app = new Application();

  // Initialize the application
  await app.init({ resizeTo: window });

  // Append the application canvas to the document body
  document.body.appendChild(app.canvas);
  Object.assign(app.canvas.style, {
    position: 'absolute',
    top: '0',
    left: '0',
    width: '100%',
    height: '100%',
    zIndex: '0', // 如果想放在背景层
  });

  // prepare circle texture, that will be our brush
  const brush = new Graphics().circle(0, 0, 50).fill({ color: 0xffffff });

  // Create a line that will interpolate the drawn points
  const line = new Graphics();

  // Load the textures
  await Assets.load([bgGrass, bgRotate]);

  const { width, height } = app.screen;
  const stageSize = { width, height };

  const background = Object.assign(Sprite.from(bgGrass), stageSize);
  const imageToReveal = Object.assign(Sprite.from(bgRotate), stageSize);
  const renderTexture = RenderTexture.create(stageSize);
  const renderTextureSprite = new Sprite(renderTexture);

  imageToReveal.mask = renderTextureSprite;

  app.stage.addChild(background, imageToReveal, renderTextureSprite);

  app.stage.eventMode = 'static';
  app.stage.hitArea = app.screen;
  app.stage
    .on('pointerdown', pointerDown)
    .on('pointerup', pointerUp)
    .on('pointerupoutside', pointerUp)
    .on('pointermove', pointerMove);

  let dragging = false;
  let lastDrawnPoint = null;

  function pointerMove({ global: { x, y } }) {
    if (!dragging) return;

    const lineCount = 5; // 平行线条数量
    const maxRadius = 50; // 起始宽度
    const minRadius = 10; // 末端细度

    if (lastDrawnPoint) {
      const dx = x - lastDrawnPoint.x;
      const dy = y - lastDrawnPoint.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      for (let i = 0; i < lineCount; i++) {
        const offsetX = (Math.random() - 0.5) * 20; // 横向偏移
        const offsetY = (Math.random() - 0.5) * 20; // 纵向偏移
        const width = maxRadius - (distance / 50) * (maxRadius - minRadius);

        line
          .stroke({ width, color: 0xffffff })
          .moveTo(lastDrawnPoint.x + offsetX, lastDrawnPoint.y + offsetY)
          .lineTo(x + offsetX, y + offsetY);

        app.renderer.render({
          container: line,
          target: renderTexture,
          clear: false,
          skipUpdateTransform: false,
        });
      }
    }

    lastDrawnPoint = lastDrawnPoint || new Point();
    lastDrawnPoint.set(x, y);
  }

  function pointerDown(event) {
    dragging = true;
    pointerMove(event);
  }

  function pointerUp() {
    dragging = false;
    lastDrawnPoint = null;
  }
})();
