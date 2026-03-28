'use client';

import { useEffect } from 'react';

declare global {
  interface Window {
    LiveChatWidget: any;
    __lc: any;
  }
}

export default function LiveChat() {
  useEffect(() => {
    // 1. SET CORRECT LICENSE ID (19592373)
    window.__lc = window.__lc || {};
    window.__lc.license = 19592373;
    window.__lc.integration_name = "manual_onboarding";
    window.__lc.product_name = "livechat";

    // 2. Initialize Widget Queue logic from your snippet
    window.LiveChatWidget = window.LiveChatWidget || (function(n, t, c) {
      function i(n: any) { return e._h ? e._h.apply(null, n) : e._q.push(n); }
      var e: any = {
        _q: [], _h: null, _v: "2.0",
        on: function() { i(["on", [].slice.call(arguments)]); },
        once: function() { i(["once", [].slice.call(arguments)]); },
        off: function() { i(["off", [].slice.call(arguments)]); },
        get: function() { if (!e._h) throw new Error("[LiveChatWidget] Getters unavailable before load."); return i(["get", [].slice.call(arguments)]); },
        call: function() { i(["call", [].slice.call(arguments)]); },
        init: function() {
          if (t.getElementById('livechat-widget-script')) return;
          var n = t.createElement("script");
          n.id = 'livechat-widget-script';
          n.async = true; n.type = "text/javascript";
          n.src = "https://cdn.livechatinc.com/tracking.js";
          t.head.appendChild(n);
        }
      };
      if (!n.__lc.asyncInit) e.init();
      return e;
    })(window, document, [].slice);

    // 3. APPLY CUSTOM SETTINGS
    window.LiveChatWidget.call('on', 'ready', () => {
      try {
        // Force show if previously hidden
        window.LiveChatWidget.call('show_widget');
        
        // Non-disruptive minimized bubble
        window.LiveChatWidget.call('hide_greeting');
        window.LiveChatWidget.call('set_visual_state', 'minimized');
        
        // Brand Red Theme
        window.LiveChatWidget.call('update_settings', {
          theme: { primary_color: '#b32d3a' }
        });
      } catch (err) {
        console.warn("LiveChat config error:", err);
      }
    });
  }, []);

  return null;
}