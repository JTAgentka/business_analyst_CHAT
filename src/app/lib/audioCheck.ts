// Check if audio/getUserMedia is available
export function isAudioSupported(): boolean {
  if (typeof window === 'undefined') return false;
  
  // Check if we're on HTTPS or localhost
  const isSecureContext = window.isSecureContext || 
                          window.location.protocol === 'https:' || 
                          window.location.hostname === 'localhost' ||
                          window.location.hostname === '127.0.0.1';
  
  // Check if getUserMedia is available
  const hasGetUserMedia = !!(navigator?.mediaDevices?.getUserMedia || 
                            // @ts-expect-error - getUserMedia is a legacy API
                            navigator?.getUserMedia ||
                            // @ts-expect-error - webkitGetUserMedia is a vendor-prefixed API
                            navigator?.webkitGetUserMedia ||
                            // @ts-expect-error - mozGetUserMedia is a vendor-prefixed API
                            navigator?.mozGetUserMedia);
  
  return isSecureContext && hasGetUserMedia;
}

export function getAudioErrorMessage(): string {
  if (typeof window === 'undefined') return 'Server-side rendering';
  
  const isHTTP = window.location.protocol === 'http:' && 
                 window.location.hostname !== 'localhost' && 
                 window.location.hostname !== '127.0.0.1';
  
  if (isHTTP) {
    return 'Microphone access requires HTTPS. Please use the HTTPS version of this site or run locally.';
  }
  
  if (!navigator?.mediaDevices?.getUserMedia) {
    return 'Your browser does not support microphone access. Please use a modern browser like Chrome, Firefox, or Edge.';
  }
  
  return 'Unable to access microphone. Please check your browser permissions.';
}