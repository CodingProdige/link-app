// components/GTMBody.js
"use client";
import { useEffect } from 'react';

const GTMBody = ({ gtmId }) => {
  useEffect(() => {
    if (!gtmId) return;

    const noscript = document.createElement('noscript');
    noscript.innerHTML = `
      <iframe src="https://www.googletagmanager.com/ns.html?id=${gtmId}"
      height="0" width="0" style="display:none;visibility:hidden"></iframe>
    `;
    document.body.insertBefore(noscript, document.body.firstChild);

    return () => {
      document.body.removeChild(noscript);
    };
  }, [gtmId]);

  return null;
};

export default GTMBody;
