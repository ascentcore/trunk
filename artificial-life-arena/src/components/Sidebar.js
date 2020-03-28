import React, { Fragment, useState } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import {
    Grid,
    Paper,
    // makeStyles,
    Box,
    TextField,
    Typography,
    Button,
    ButtonGroup,
    List,
    ListItem,
    ListItemText,
    Collapse,
    Divider,
    InputLabel,
    MenuItem,
    FormControlLabel,
    Checkbox,
    Select,
} from '@material-ui/core';
import { selectors } from 'ducks/_template';
import ActivationGraph, { ACTIVATIONS } from './ActivationGraph';


function Population(props) {
    // const classes = useStyles();
    const [itemVisible, setItemVisible] = useState(true);
    const toggleItem = () => {
        setItemVisible(prev => !prev);
    };


    let common = withEnergy => (<Fragment>
        <Grid item xs={withEnergy ? 4 : 6} >
            <TextField label="Character" variant="outlined" value={props.character} fullWidth margin="normal" />
        </Grid>
        <Grid item xs={withEnergy ? 4 : 6}>
            <TextField label="Initial Population" variant="outlined" value={props.initialPopulation} fullWidth margin="normal" />
        </Grid>
        {withEnergy && (<Grid item xs={4}>
            <TextField label="Energy Loss" variant="outlined" value={props.energyLoss} fullWidth margin="normal" />
        </Grid>)}
    </Fragment>)

    let content;

    if (props.type === 2) {
        content = (
            <Fragment>
                <Grid item xs={12}>
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={props.randomPoints}
                                onChange={() => { }}
                                value="checkedB"
                                color="primary"
                            />
                        }
                        label="Random Position"
                    />
                </Grid>
                {common(true)}
                <Grid item xs={12}>
                    <Typography>Genetics</Typography>
                </Grid>
                <Grid item xs={6}>
                    <TextField label="Mutation Rate" variant="outlined" value={props.mutationRate} fullWidth margin="normal" />
                </Grid>
                <Grid item xs={6}>
                    <TextField label="Mutation Scale" variant="outlined" value={props.mutationScale} fullWidth margin="normal" />
                </Grid>
                <Grid item xs={12}>
                    <Typography>Net Architecture</Typography>
                </Grid>
                {props.net.map((layer, index) => (
                    <Fragment key={index}>
                        <Grid item xs={6}>
                            <TextField disabled={index === props.net.length-1} label="Outputs" variant="outlined" value={layer[0]} fullWidth margin="normal" />
                        </Grid>
                        <Grid item xs={6}>
                            <InputLabel>Function</InputLabel>
                            <Select fullWidth value={layer[1]}>
                                {ACTIVATIONS.map(fn => (<MenuItem key={fn} value={fn}><ActivationGraph activation={fn} /></MenuItem>))}
                            </Select>
                        </Grid>
                    </Fragment>
                ))}

            </Fragment>)
    } else {
        content = (common(false))
    }

    return (
        <Fragment>
            <Divider />
            <ListItem button onClick={toggleItem}>
                <ListItemText primary={<span>{props.type === 2 ? 'Creature' : 'Food'} ({props.character} | {props.initialPopulation})</span>} />
                <i className={`fas fa-${itemVisible ? 'chevron-up' : 'chevron-down'}`} />
            </ListItem>
            <Collapse in={itemVisible} timeout="auto" unmountOnExit>
                <Box m={2}>
                    <Grid container spacing={2}>
                        {content}
                    </Grid>
                </Box>
            </Collapse>
        </Fragment>
    )
}

function Sidebar(props) {

    return (
        <Paper>
            <Box p={2}>
                <TextField label="Seed" variant="outlined" value={props.seed} fullWidth margin="normal" />
                <Box my={2} />

                <Typography variant="h6">Entities ({props.populations.length})</Typography>

                <Box mt={1} display="flex" justifyContent="space-between" alignItems="center">
                    <ButtonGroup size="small">
                        <Button>
                            <Box component="span" mr={1}>
                                <i className="fas fa-compress fa-sm" />
                            </Box>
                            Collapse all
                        </Button>
                        <Button>
                            <Box component="span" mr={1}>
                                <i className="fas fa-expand fa-sm" />
                            </Box>
                            Expand all
                        </Button>
                    </ButtonGroup>                   
                </Box>

                <Box mx={-2} mt={2}>
                    <List disablePadding>
                        {props.populations.map((pop, index) => (
                            <Population {...pop} key={index} />
                        ))}
                    </List>
                </Box>
            </Box>
        </Paper>
    );
}


export default compose(
    connect(
        state => ({
            seed: selectors.getSeed(state),
            populations: selectors.getPopulations(state)
        }),
        dispatch => ({}),
    ),
)(Sidebar);