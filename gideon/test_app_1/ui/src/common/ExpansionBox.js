import React from 'react';
import {
    Box,
    Typography,
    ExpansionPanel,
    ExpansionPanelSummary,
    ExpansionPanelDetails,
} from '@material-ui/core';

function ExpansionBox({ title, children, claim, expanded, onChange, disabled, warning, ...props }) {
    return (
        <Box mb={claim ? undefined : 4} {...props} style={disabled ? { opacity: 0.5 } : undefined}>
            <ExpansionPanel defaultExpanded expanded={expanded} onChange={onChange}>
                {claim ? (
                    <ExpansionPanelSummary>
                        {title}
                        {warning}
                    </ExpansionPanelSummary>
                ) : (
                    <ExpansionPanelSummary
                        expandIcon={<i className="fas fa-angle-down fa-fw fa-sm" />}
                    >
                        <Box display="flex" alignContent="center">
                            <Typography variant="h6">{title}</Typography>
                            {warning && (
                                <Box ml={1} mt={-0.25}>
                                    {warning}
                                </Box>
                            )}
                        </Box>
                    </ExpansionPanelSummary>
                )}
                <ExpansionPanelDetails>
                    <Box width="100%">{children}</Box>
                </ExpansionPanelDetails>
            </ExpansionPanel>
        </Box>
    );
}

export default ExpansionBox;
