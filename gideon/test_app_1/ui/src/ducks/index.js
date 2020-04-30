import { combineReducers } from 'redux';

import ui from './ui';
import user from './user';

export default combineReducers({
    ui,
    user,
});

export {
    types as uiTypes,
    actions as uiActions,
    selectors as uiSelectors,
} from './ui';

export {
    types as userTypes,
    actions as userActions,
    selectors as userSelectors,
} from './user';