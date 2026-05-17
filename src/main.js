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
  Object.assign(app.view.style, {
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
  await Assets.load([
    'https://pixijs.com/assets/bg_grass.jpg',
    'https://pixijs.com/assets/bg_rotate.jpg',
  ]);

  const { width, height } = app.screen;
  const stageSize = { width, height };

  const background = Object.assign(
    Sprite.from('https://pixijs.com/assets/bg_grass.jpg'),
    stageSize,
  );
  const imageToReveal = Object.assign(
    Sprite.from('https://pixijs.com/assets/bg_rotate.jpg'),
    stageSize,
  );
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
    if (dragging) {
      brush.position.set(x, y);
      app.renderer.render({
        container: brush,
        target: renderTexture,
        clear: false,
        skipUpdateTransform: false,
      });
      // Smooth out the drawing a little bit to make it look nicer
      // this connects the previous drawn point to the current one
      // using a line
      if (lastDrawnPoint) {
        line
          .clear()
          .moveTo(lastDrawnPoint.x, lastDrawnPoint.y)
          .lineTo(x, y)
          .stroke({ width: 100, color: 0xffffff });
        app.renderer.render({
          container: line,
          target: renderTexture,
          clear: false,
          skipUpdateTransform: false,
        });
      }
      lastDrawnPoint = lastDrawnPoint || new Point();
      lastDrawnPoint.set(x, y);
    }
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
