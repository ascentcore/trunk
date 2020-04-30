import React from 'react';

import { Box } from '@material-ui/core';

function ButtonLoader({ open }) {
    return open ? (
        <Box ml={1}>
            <i className="fas fa-circle-notch fa-spin fa-fw" />
        </Box>
    ) : null;
}

export default ButtonLoader;
