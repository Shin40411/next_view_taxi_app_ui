import { useRef, useEffect } from 'react';

import { useAuthContext } from 'src/auth/hooks';

const ZaloChatWidget = () => {
    const { user } = useAuthContext();
    const wrapperRef = useRef<HTMLDivElement>(null);

    const shouldHide = !['PARTNER', 'CUSTOMER', 'INTRODUCER'].includes(user?.role as string);

    useEffect(() => {
        if (shouldHide || !wrapperRef.current) return;

        const widget = document.createElement('div');
        widget.className = 'zalo-chat-widget';

        widget.dataset.oaid = '570941760704464547';

        widget.dataset.welcomeMessage = 'Rất vui khi được hỗ trợ bạn!';
        widget.dataset.autopopup = '0';
        widget.dataset.width = '350';
        widget.dataset.height = '420';

        wrapperRef.current.appendChild(widget);

        const scriptId = 'zalo-chat-script';
        if (!document.getElementById(scriptId)) {
            const script = document.createElement('script');
            script.id = scriptId;
            script.src = 'https://sp.zalo.me/plugins/sdk.js';
            script.async = true;
            document.body.appendChild(script);
        }

        return () => {
            if (wrapperRef.current) {
                wrapperRef.current.innerHTML = '';
            }
        };
    }, [shouldHide]);

    if (shouldHide) {
        return null;
    }

    return (
        <div ref={wrapperRef}>
            <style>
                {`
                    .zalo-chat-widget {
                        right: 5px !important;
                        bottom: 50px !important;
                        left: auto !important;
                        z-index: 999999 !important;
                    }
                `}
            </style>
        </div>
    );
};

export default ZaloChatWidget;