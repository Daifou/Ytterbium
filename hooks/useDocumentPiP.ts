import { useState, useCallback, useEffect } from 'react';

interface PiPOptions {
    width?: number;
    height?: number;
}

export const useDocumentPiP = () => {
    const [pipWindow, setPipWindow] = useState<Window | null>(null);

    const closePip = useCallback(() => {
        if (pipWindow) {
            pipWindow.close();
            setPipWindow(null);
        }
    }, [pipWindow]);

    const openPip = useCallback(async ({ width = 300, height = 150 }: PiPOptions = {}) => {
        // Check for API support
        if (!('documentPictureInPicture' in window)) {
            console.warn("Document Picture-in-Picture API is not supported in this browser.");
            return;
        }

        // Close existing if open
        if (pipWindow) {
            closePip();
            return;
        }

        try {
            // @ts-ignore - API is new
            const win = await window.documentPictureInPicture.requestWindow({
                width,
                height,
            });

            // KEY: Copy all styles to the new window to ensure faithful rendering
            // This includes Tailwind styles, framer-motion styles (if any), and CSS modules
            [...document.styleSheets].forEach((styleSheet) => {
                try {
                    const cssRules = [...styleSheet.cssRules]
                        .map((rule) => rule.cssText)
                        .join('');
                    const style = document.createElement('style');
                    style.textContent = cssRules;
                    win.document.head.appendChild(style);
                } catch (e) {
                    const link = document.createElement('link');
                    // @ts-ignore
                    link.rel = 'stylesheet';
                    link.type = styleSheet.type;
                    // @ts-ignore
                    link.media = styleSheet.media;
                    // @ts-ignore
                    link.href = styleSheet.href;
                    win.document.head.appendChild(link);
                }
            });

            // Also copy any standalone <style> tags (like some styled-components or emotion)
            // and <link> tags
            document.querySelectorAll('style, link[rel="stylesheet"]').forEach((node) => {
                win.document.head.appendChild(node.cloneNode(true));
            });

            // React to the window closing (e.g., user hits X)
            win.addEventListener('pagehide', () => {
                setPipWindow(null);
            });

            // Set darker background immediately
            win.document.body.style.backgroundColor = '#000';
            win.document.body.style.margin = '0';
            win.document.body.style.overflow = 'hidden';

            setPipWindow(win);
        } catch (err) {
            console.error("Failed to open PiP window:", err);
        }
    }, [pipWindow, closePip]);

    // Clean up on toggle/unmount handled by pagehide event mostly, 
    // but good to have a safety net if the main app unmounts
    useEffect(() => {
        return () => {
            // If the main window closes/refreshes, close the PiP window
            if (pipWindow) {
                // @ts-ignore
                pipWindow.close();
            }
        }
    }, []); // eslint-disable-line

    return {
        pipWindow,
        openPip,
        closePip,
        isOpen: !!pipWindow
    };
};
