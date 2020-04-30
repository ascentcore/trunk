// TODO: refactor

import React, { Component } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';

import {
    withStyles,
    Dialog,
    DialogTitle,
    DialogActions,
    DialogContent,
    Button,
    DialogContentText,
} from '@material-ui/core';

import { uiActions, uiSelectors } from 'ducks';

const styles = theme => ({});

class ConfirmationDialog extends Component {
    handleConfirm = e => {
        const { dialog } = this.props;
        dialog.onConfirm();
        this.props.hideConfirmationDialog();
    };
    handleCancel = e => {
        const { dialog } = this.props;
        dialog.onCancel();
        this.props.hideConfirmationDialog();
    };
    render() {
        const { dialog } = this.props;

        return (
            <Dialog open={!!dialog.open} onClose={this.handleCancel}>
                <DialogTitle>{dialog.title || 'Confirmation dialog'}</DialogTitle>
                {!!dialog.content && (
                    <DialogContent>
                        <DialogContentText>{dialog.content}</DialogContentText>
                    </DialogContent>
                )}
                <DialogActions>
                    <Button onClick={this.handleCancel}>{dialog.cancelLabel || 'Cancel'}</Button>
                    <Button onClick={this.handleConfirm} variant="outlined" autoFocus>
                        {dialog.confirmLabel || 'Confirm'}
                    </Button>
                </DialogActions>
            </Dialog>
        );
    }
}

export default compose(
    withStyles(styles),
    connect(
        state => ({
            dialog: uiSelectors.getConfirmationDialog(state),
        }),
        dispatch => ({
            hideConfirmationDialog() {
                dispatch(uiActions.hideConfirmationDialog());
            },
        }),
    ),
)(ConfirmationDialog);
