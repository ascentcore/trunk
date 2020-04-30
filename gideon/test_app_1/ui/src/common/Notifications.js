import React, { Component } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import cn from 'classnames';

import { amber, green } from '@material-ui/core/colors';

import { withStyles, Snackbar, IconButton, SnackbarContent } from '@material-ui/core';

import { uiActions, uiSelectors } from 'ducks';
import { NOTIFICATION_DATA } from 'constants/ui';

const styles = theme => ({
    root: {
        zIndex: 2000,
    },
    default: {
        color: theme.palette.primary.contrastText,
    },
    success: {
        backgroundColor: green[600],
    },
    error: {
        backgroundColor: theme.palette.error.dark,
    },
    info: {
        backgroundColor: theme.palette.primary.main,
    },
    warning: {
        backgroundColor: amber[700],
    },
});

class Notifications extends Component {
    handleClose = (e, reason) => {
        if (reason !== 'clickaway') this.props.closeNotification();
    };
    handleExited = () => {
        this.props.nextNotification();
    };
    render() {
        const { classes, notification, notificationOpen } = this.props;
        const { content, variant } = notification || {};
        const icon = notification ? NOTIFICATION_DATA[variant].icon : '';

        return (
            <Snackbar
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                }}
                open={notificationOpen && !!notification}
                autoHideDuration={6000}
                onClose={this.handleClose}
                onExited={this.handleExited}
                className={classes.root}
            >
                <SnackbarContent
                    className={cn(classes.default, classes[variant])}
                    message={
                        <span>
                            <i className={`fas fa-${icon} fa-fw`} />
                            &nbsp;&nbsp;
                            {content}
                        </span>
                    }
                    action={[
                        <IconButton key="close" color="inherit" onClick={this.handleClose}>
                            <i className="fas fa-times fa-xs fa-fw" />
                        </IconButton>,
                    ]}
                />
            </Snackbar>
        );
    }
}

export default compose(
    withStyles(styles),
    connect(
        state => ({
            notification: uiSelectors.getNotification(state),
            notificationOpen: uiSelectors.isNotificationOpen(state),
        }),
        dispatch => ({
            nextNotification() {
                dispatch(uiActions.nextNotification());
            },
            closeNotification() {
                dispatch(uiActions.closeNotification());
            },
        }),
    ),
)(Notifications);
