export interface Landmark {
  x: number;
  y: number;
  z?: number;
  visibility?: number;
}

// Calculate angle (degrees) at vertex B formed by points A-B-C
export function calculateAngle(pointA: Landmark, pointB: Landmark, pointC: Landmark): number {
  const radians =
    Math.atan2(pointC.y - pointB.y, pointC.x - pointB.x) -
    Math.atan2(pointA.y - pointB.y, pointA.x - pointB.x);
  let angle = Math.abs((radians * 180.0) / Math.PI);
  if (angle > 180.0) {
    angle = 360 - angle;
  }
  return angle;
}

export interface PostureEvaluation {
  accuracy: number;
  isSlouching: boolean;
}

// MediaPipe Pose landmark indices: left ear = 7, left shoulder = 11, left hip = 23
const LEFT_EAR = 7;
const LEFT_SHOULDER = 11;
const LEFT_HIP = 23;

export function evaluatePosture(landmarks: Landmark[] | undefined | null): PostureEvaluation {
  if (!landmarks || landmarks.length < 33) {
    return { accuracy: 100, isSlouching: false };
  }

  const ear = landmarks[LEFT_EAR];
  const shoulder = landmarks[LEFT_SHOULDER];
  const hip = landmarks[LEFT_HIP];

  if (!ear || !shoulder || !hip) {
    return { accuracy: 100, isSlouching: false };
  }

  // Forward head/spine inclination angle at the shoulder
  const inclination = calculateAngle(ear, shoulder, hip);

  // Ideal upright inclination is around 170-180 degrees. Lower indicates slouching.
  const slouchThreshold = 155;
  const isSlouching = inclination < slouchThreshold;

  const accuracy = Math.min(Math.max(((inclination - 120) / (180 - 120)) * 100, 0), 100);

  return { accuracy: Math.round(accuracy), isSlouching };
}
