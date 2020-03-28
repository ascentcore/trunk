import { combineReducers } from 'redux';

import _template from './_template';

export default combineReducers({
    _template,
});

export {
    types as _templateTypes,
    actions as _templateActions,
    selectors as _templateSelectors,
} from './_template';