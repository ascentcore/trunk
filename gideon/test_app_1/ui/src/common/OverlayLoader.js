// TODO: test/refactor

import React from 'react';
import { makeStyles, CircularProgress, Fade } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
    overlay: {
        position: 'fixed',
        zIndex: 9999,
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        // background: '#fffc',
        background: '#fff',
    },
}));

function OverlayLoader({ open }) {
    const classes = useStyles();

    return (
        <Fade in={open} timeout={500}>
            <div className={classes.overlay}>
                <CircularProgress />
            </div>
        </Fade>
    );
}

export default OverlayLoader;
