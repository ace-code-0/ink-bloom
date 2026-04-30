import { texts } from './textData.js';
import { generateHeartPoints } from './heartPath.js';
import { animateText } from './textAnimator.js';

const container = document.getElementById('app');
const points = generateHeartPoints(100, 12);
animateText(container, points, texts);
