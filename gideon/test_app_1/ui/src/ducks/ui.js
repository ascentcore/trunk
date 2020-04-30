import produce from 'immer';
import { NOTIFICATION_VARIANTS } from 'constants/ui';

export const types = {
    PUSH_NOTIFICATION: 'PUSH_NOTIFICATION',
    NEXT_NOTIFICATION: 'NEXT_NOTIFICATION',
    OPEN_NOTIFICATION: 'OPEN_NOTIFICATION',
    CLOSE_NOTIFICATION: 'CLOSE_NOTIFICATION',
};

export const actions = {
    pushNotification: (content, priority = false, variant = NOTIFICATION_VARIANTS.INFO) => ({
        type: types.PUSH_NOTIFICATION,
        content,
        variant,
        priority,
    }),
    pushNotificationError: (content, priority = false) => ({
        type: types.PUSH_NOTIFICATION,
        content,
        variant: NOTIFICATION_VARIANTS.ERROR,
        priority,
    }),
    pushNotificationSuccess: (content, priority = false) => ({
        type: types.PUSH_NOTIFICATION,
        content,
        variant: NOTIFICATION_VARIANTS.SUCCESS,
        priority,
    }),
    pushNotificationWarning: (content, priority = false) => ({
        type: types.PUSH_NOTIFICATION,
        content,
        variant: NOTIFICATION_VARIANTS.WARNING,
        priority,
    }),
    nextNotification: () => ({
        type: types.NEXT_NOTIFICATION,
    }),
    openNotification: () => ({
        type: types.OPEN_NOTIFICATION,
    }),
    closeNotification: () => ({
        type: types.CLOSE_NOTIFICATION,
    }),
};

function pushNotification(draft, action) {
    const { content, variant, priority } = action;
    const notification = { content, variant };

    if (draft.notifications.length === 0 && draft.priorityNotifications.length === 0) {
        draft.notificationOpen = true;
    }

    if (priority) {
        if (draft.priorityNotifications.length === 0 && draft.notifications.length > 0) {
            draft.notificationOpen = false;
            draft.switchToPriority = true;
        }

        draft.priorityNotifications.push(notification);
    } else {
        draft.notifications.push(notification);
    }
}
function nextNotification(draft, action) {
    if (draft.priorityNotifications.length > 0) {
        if (draft.switchToPriority) {
            draft.switchToPriority = false;
        } else {
            draft.priorityNotifications.shift();
        }
    } else {
        draft.notifications.shift();
    }

    draft.notificationOpen = true;
}

const initialState = {
    notificationOpen: false,
    notifications: [],
    priorityNotifications: [],
    switchToPriority: false,
};

const ui = produce((draft, action) => {
    switch (action.type) {
        case types.PUSH_NOTIFICATION:
            pushNotification(draft, action);
            return;
        case types.NEXT_NOTIFICATION:
            nextNotification(draft, action);
            return;
        case types.OPEN_NOTIFICATION:
            draft.notificationOpen = true;
            return;
        case types.CLOSE_NOTIFICATION:
            draft.notificationOpen = false;
            return;

        default:
            return;
    }
}, initialState);

export const selectors = {
    getNotification: state => state.ui.priorityNotifications[0] || state.ui.notifications[0],
    isNotificationOpen: state => state.ui.notificationOpen,
};

export default ui;
