import 'intro.js/introjs.css';
import introJs from 'intro.js';
import { useState, useEffect } from 'react';

import { paths } from 'src/routes/paths';
import { useRouter, usePathname } from 'src/routes/hooks';

import { useAdmin } from 'src/hooks/api/use-admin';

import { useAuthContext } from 'src/auth/hooks';

// ----------------------------------------------------------------------

export default function PartnerOnboarding() {
    const { user: authUser } = useAuthContext();
    const { useGetUser } = useAdmin();
    const router = useRouter();
    const pathname = usePathname();

    const { user, userLoading } = useGetUser(authUser?.id);

    const [stepsEnabled, setStepsEnabled] = useState(false);

    useEffect(() => {
        if (!userLoading && user && (user.role === 'PARTNER' || user.role === 'INTRODUCER')) {
            const isMissingInfo = !user.bankAccount ||
                !user.email ||
                !user.phone_number ||
                !user.partnerProfile?.id_card_front ||
                !user.partnerProfile?.id_card_back ||
                (user.role === 'PARTNER' && (
                    !user.partnerProfile?.vehicle_plate ||
                    !user.partnerProfile?.driver_license_front ||
                    !user.partnerProfile?.driver_license_back
                ));

            const profilePath = paths.dashboard.driver.profile.startsWith('/')
                ? paths.dashboard.driver.profile
                : `/${paths.dashboard.driver.profile}`;

            const isProfilePage = pathname === profilePath;

            if (isMissingInfo && !isProfilePage) {
                setStepsEnabled(true);
            }
        }
    }, [user, userLoading, pathname]);

    useEffect(() => {
        if (stepsEnabled) {
            const instance = introJs();

            instance.setOptions({
                steps: [
                    {
                        title: '👉 Cập nhật hồ sơ',
                        element: document.querySelector('#sidebar-profile-link') ? '#sidebar-profile-link' : '#mobile-wallet-popover-btn',
                        intro: 'Vui lòng cập nhật đầy đủ thông tin hồ sơ của bạn (Ngân hàng, Giấy tờ xe...) để đảm bảo quyền lợi và bắt đầu hoạt động.',
                        position: document.querySelector('#sidebar-profile-link') ? 'right' : 'bottom',
                    },
                ],
                showButtons: true,
                doneLabel: 'Đi đến',
                showStepNumbers: false,
                showBullets: false,
                exitOnOverlayClick: false,
                exitOnEsc: false,
                overlayOpacity: 0.7,
            });

            instance.start();

            instance.oncomplete(() => {
                router.push(paths.dashboard.driver.profile);
                setStepsEnabled(false);
            });

            instance.onexit(() => {
                setStepsEnabled(false);
            });

            return () => {
                instance.exit(true);
            };
        }
    }, [stepsEnabled, router]);

    return (
        <style>
            {`
            .introjs-skipbutton {
                display: none !important;
            }
            .introjs-tooltip {
                min-width: 300px;
            }
            `}
        </style>
    );
}
