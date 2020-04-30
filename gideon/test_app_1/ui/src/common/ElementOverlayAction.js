// TODO: refactor/remove

import React from 'react';
import { makeStyles, Box, Link as SimpleLink } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
    wrapper: {
        '&:hover $overlay': {
            opacity: 1,
        },
    },
    overlay: {
        opacity: 0,
        backgroundColor: '#0008',
        color: '#fff',
        transition: 'opacity 0.25s',
    },
}));

function ElementOverlayAction({ label, href, children, onClick = () => {} }) {
    const classes = useStyles();

    const hrefProps = href
        ? {
              component: SimpleLink,
              target: '_blank',
              href,
          }
        : {};

    return (
        <Box
            position="relative"
            borderRadius="50%"
            overflow="hidden"
            display="block"
            onClick={onClick}
            {...hrefProps}
            className={classes.wrapper}
        >
            <Box
                position="absolute"
                zIndex={2}
                width="100%"
                height="100%"
                display="flex"
                justifyContent="center"
                alignItems="center"
                fontWeight="fontWeightMedium"
                className={classes.overlay}
            >
                {label}
            </Box>
            {children}
        </Box>
    );
}

export default ElementOverlayAction;
