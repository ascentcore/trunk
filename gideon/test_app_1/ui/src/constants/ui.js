export const NOTIFICATION_VARIANTS = {
    INFO: 'info',
    SUCCESS: 'success',
    ERROR: 'error',
    WARNING: 'warning',
};
export const NOTIFICATION_DATA = {
    [NOTIFICATION_VARIANTS.INFO]: {
        key: NOTIFICATION_VARIANTS.INFO,
        icon: 'info-circle',
    },
    [NOTIFICATION_VARIANTS.SUCCESS]: {
        key: NOTIFICATION_VARIANTS.SUCCESS,
        icon: 'check-circle',
    },
    [NOTIFICATION_VARIANTS.ERROR]: {
        key: NOTIFICATION_VARIANTS.ERROR,
        icon: 'times-circle',
    },
    [NOTIFICATION_VARIANTS.WARNING]: {
        key: NOTIFICATION_VARIANTS.WARNING,
        icon: 'exclamation-circle',
    },
};
