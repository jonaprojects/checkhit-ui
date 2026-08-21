export type LtiSession = {
  ltik?: string;
  userId?: string;
  courseId?: string;
  resourceId?: string;
};

const STORAGE_KEY = 'checkhit.ltiSession';
const SESSION_PARAMS: Array<keyof LtiSession> = [
  'ltik',
  'userId',
  'courseId',
  'resourceId',
];

function readStoredSession(): LtiSession {
  if (typeof window === 'undefined') return {};

  try {
    return JSON.parse(window.sessionStorage.getItem(STORAGE_KEY) || '{}') as LtiSession;
  } catch {
    return {};
  }
}

export function captureLtiSession(): LtiSession {
  if (typeof window === 'undefined') return {};

  const session = readStoredSession();
  const searchParams = new URLSearchParams(window.location.search);
  let hasLaunchParams = false;

  for (const key of SESSION_PARAMS) {
    const value = searchParams.get(key);
    if (value) {
      session[key] = value;
      hasLaunchParams = true;
    }
  }

  if (hasLaunchParams) {
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  }

  return session;
}

export function getLtiSession(): LtiSession {
  return captureLtiSession();
}

export function getLtiUserId(fallback: string): string;
export function getLtiUserId(fallback?: undefined): string | undefined;
export function getLtiUserId(fallback?: string): string | undefined {
  return getLtiSession().userId || fallback;
}
