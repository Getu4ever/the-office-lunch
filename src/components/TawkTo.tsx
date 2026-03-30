'use client';

import { useEffect } from 'react';

declare global {
  interface Window {
    Tawk_API: any;
    Tawk_LoadStart: any;
  }
}

export default function TawkTo() {
  useEffect(() => {
    window.Tawk_API = window.Tawk_API || {};
    window.Tawk_LoadStart = new Date();

    (function(){
      var s1 = document.createElement("script"),
          s0 = document.getElementsByTagName("script")[0];
      s1.async = true;
      s1.src = 'https://embed.tawk.to/69ca625d2ef1cb1c3862a864/1jkv90gi9';
      s1.charset = 'UTF-8';
      s1.setAttribute('crossorigin', '*');
      if (s0 && s0.parentNode) {
        s0.parentNode.insertBefore(s1, s0);
      }
    })();

    window.Tawk_API.onLoad = function() {
      // Ensures it stays as a small, quiet bar on the far bottom left
      window.Tawk_API.collapse();
      window.Tawk_API.hideGreeting();
    };
  }, []);

  return null;
}