
export function loadTweenJs() {
    const loadTweenScript = () => {
        return new Promise((resolve, reject) => {
            // Check if window.tweenJs is already defined

            const queryScript = 'https://code.createjs.com/1.0.0/tweenjs.min.js'
            if (window.tweenJs) {
                resolve(window.tweenJs);
            } else {
                // Check if script tag for lottie-web already exists
                // const existingScript = document.querySelector('script[src="https://code.createjs.com/1.0.0/createjs.min.js"]');
                const existingScript = document.querySelector(`script[src="${queryScript}"]`);

                if (existingScript) {
                    existingScript.addEventListener('load', () => {
                        resolve(window.tweenJs);
                    });
                } else {
                    // If script tag does not exist, create new one and append to document head
                    const script = document.createElement('script');
                    script.type = 'text/javascript';
                    script.async = true;
                    script.src = queryScript;

                    script.onload = () => {
                        resolve(window.tweenJs);
                    };

                    script.onerror = () => {
                        reject(new Error('Failed to load lottie-web script'));
                    };

                    document.head.appendChild(script);
                }
            }
        });
    };


    return {
        loadTweenScript
    };

}