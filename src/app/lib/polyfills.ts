// Browser polyfills for OpenAI Agents SDK compatibility

// Polyfill for crypto.randomUUID if it's not available
if (typeof window !== 'undefined') {
  // Ensure crypto object exists
  if (!window.crypto) {
    // @ts-expect-error - polyfilling crypto object when it doesn't exist
    window.crypto = {};
  }
  
  // Add randomUUID if it doesn't exist or is undefined
  if (!window.crypto.randomUUID) {
    window.crypto.randomUUID = function() {
      // Fallback UUID v4 generation
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
      }) as `${string}-${string}-${string}-${string}-${string}`;
    };
  }
  
  // Ensure bind is available for crypto.randomUUID
  if (window.crypto.randomUUID && !window.crypto.randomUUID.bind) {
    const originalRandomUUID = window.crypto.randomUUID;
    window.crypto.randomUUID = function() {
      return originalRandomUUID() as `${string}-${string}-${string}-${string}-${string}`;
    };
  }
  
  // Polyfill for getUserMedia (with vendor prefixes)
  // @ts-expect-error - getUserMedia is a legacy API
  if (navigator && !navigator.getUserMedia) {
    // @ts-expect-error - getUserMedia is a legacy API
    navigator.getUserMedia = navigator.getUserMedia ||
                           // @ts-expect-error - webkitGetUserMedia is a vendor-prefixed API
                           navigator.webkitGetUserMedia ||
                           // @ts-expect-error - mozGetUserMedia is a vendor-prefixed API
                           navigator.mozGetUserMedia ||
                           // @ts-expect-error - msGetUserMedia is a vendor-prefixed API
                           navigator.msGetUserMedia;
  }
  
  // Modern getUserMedia API polyfill
  if (navigator && navigator.mediaDevices && !navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices.getUserMedia = function(constraints) {
      // @ts-expect-error - getUserMedia is a legacy API
      const getUserMedia = navigator.getUserMedia ||
                         // @ts-expect-error - webkitGetUserMedia is a vendor-prefixed API
                         navigator.webkitGetUserMedia ||
                         // @ts-expect-error - mozGetUserMedia is a vendor-prefixed API
                         navigator.mozGetUserMedia ||
                         // @ts-expect-error - msGetUserMedia is a vendor-prefixed API
                         navigator.msGetUserMedia;
      
      if (!getUserMedia) {
        return Promise.reject(new Error('getUserMedia is not implemented in this browser'));
      }
      
      return new Promise(function(resolve, reject) {
        getUserMedia.call(navigator, constraints, resolve, reject);
      });
    };
  }
}

// Export to ensure the module is loaded
export {};