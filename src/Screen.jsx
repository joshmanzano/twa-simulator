import React, { Component, Fragment } from 'react';
import {
  Container, Typography, Box, Grid, TextField, IconButton, Button,
  FormGroup, FormControlLabel, Switch
} from '@material-ui/core';

import StateTable from './StateTable'
import AddIcon from '@material-ui/icons/Add';
import axios from 'axios';
import Toast from 'light-toast';


class Screen extends Component {

  constructor(props){
      super(props);
      this.state = {
        rows: [],
        state: 1,
        action: '',
        input: '',
        nextState: '',
        string: '',
        result: 'None',
        line: '',
        logs: [],
        toggle: true,
      };
  }
  
  handleChange = (event) => {
    const name = event.target.name
    const value = event.target.value
    const state = {}
    state[name] = value
    this.setState(state)
  }

  processValue = (value, rows) => {
    const regState = /^[0-9]+/
    const regAction = /accept|reject|left|right/ 
    const regTransition = /\([\w|#]+ *, *\d+\)/g

    if(value.match(regState) != null && value.match(regAction) != null){
      const state = value.match(regState)[0]
      const action = value.match(regAction)[0]
      console.log(action)
      if(action == 'accept'){
        rows.push([state,action,'',''])
      }else if(action == 'reject'){
        rows.push([state,action,'',''])
      }else{
        const transitions = [...value.matchAll(regTransition)]
        transitions.forEach(t => {
          const transition = t[0].replace('(','').replace(')','').replace(' ','').split(',')
          rows.push([state,action,transition[0], transition[1]])
        })
      }
    }
    return rows
  }

  handleLine = (event) => {
    const value = event.target.value.toLowerCase()
    const rows = []
    this.setState({line: value})
    const regLine = /(\d+\)) *(accept|reject|left|right) *(\([\w|#]+ *, *\d+\))*/g
    const lines = [...value.matchAll(regLine)]
    lines.forEach(l => {
      this.processValue(l[0], rows)
    })
    this.setState({rows})
  }

  e2 = () => {
    const event = {}
    event['target'] = {}
    event['target']['value'] =
    '1) right(b, 1)(a, 2)(#, 3)' + '\n' +
    '2) right(a, 1)(b, 2)(#, 7)' + '\n' +
    '3) left(a, 3)(b, 3)(#, 4)' + '\n' +
    '4) right(a, 4)(b, 5)(#, 6)' + '\n' +
    '5) right(a, 5)(b, 4)(#, 7)' + '\n' +
    '6) ACCEPT' + '\n' +
    '7) REJECT' 
    this.handleLine(event)
  }
  e1 = () => {
    const event = {}
    event['target'] = {}
    event['target']['value'] =
    '1) right(b,1)(a,2)(#,3)' + '\n' +
    '2) right(b,2)(a,1)(#,4)' + '\n' +
    '3) ACCEPT' + '\n' +
    '4) REJECT' 
    this.handleLine(event) 
  }
  e3 = () => {

  }

  handleToggle = () => {
    this.setState({toggle: !this.state.toggle})
  }

  addState = () => {
    const row = []
    const rows = this.state.rows
    row.push(this.state.state)
    row.push(this.state.action)
    row.push(this.state.input)
    row.push(this.state.nextState)
    rows.push(row)
    this.setState({input: '', nextState: ''}, () => {
      this.setState({rows})
    })
  }

  submit = () => {
    const data = {}
    const stateData = {}
    data['states'] = []
    this.state.rows.forEach(row => {
      if(row[0] in stateData){
        stateData[row[0]]['transitions'].push(
            {
              'character': row[2],
              'stateNumber': row[3]
            }
          )
      }else{
        stateData[row[0]] = {
          'stateNumber': row[0],
          'action': row[1],
          'transitions': [
            {
              'character': row[2],
              'stateNumber': row[3]
            }
          ]
        }

      }

    })
    Object.entries(stateData).forEach(([key, val]) => {
      data['states'].push(val)
    });
    data['string'] = this.state.string
    Toast.loading('Simulating...')
    axios.post('https://akadsph.pythonanywhere.com/twasimulator', data)
    .then(res => {
      console.log(res)
      if(res['data']['results']['result']){
        this.setState({logs:res['data']['results']['log'], result: 'ACCEPT'}, () => {
          Toast.success('Simulated!',1000)
        })
      }else{
        this.setState({logs:res['data']['results']['log'], result: 'REJECT'}, () => {
          Toast.success('Simulated!',1000)
        })
      }
    }).catch(err => {
      console.log(err)
      Toast.fail('Error in input!',1000)
    })
  }

  render(){
    return (
    <Container maxWidth={'md'} alignItems='center'>
      <Box my={4}>
        <Typography variant="h2" align="center">
          TWA Simulator
        </Typography>
      </Box>
      <StateTable rows={this.state.rows}/>
      <Box my={2}>
        <FormControlLabel
          control={
            <Switch
              checked={this.state.toggle}
              onChange={this.handleToggle}
              name="checkedB"
              color="Primary"
            />
          }
          label="Multiline input"
        />
      </Box>
      <Box my={2}>
        <Grid container alignItems="center" spacing={1}>
          {this.state.toggle ? 
          <Grid item xs={12}>
            <TextField placeholder="1) right(b,1)(a,2)(#,3)" multiline fullWidth onChange={this.handleLine} value={this.state.line} variant="outlined" name='nextState' label="Multiline input"></TextField>
          </Grid>
          :
          <Fragment>
            <Grid item xs={6} md={2}>
              <TextField onChange={this.handleChange} value={this.state.state} variant="outlined" name='state' label="State"></TextField>
            </Grid>
            <Grid item xs={6} md={3}>
              <TextField onChange={this.handleChange} value={this.state.action} variant="outlined" name='action' label="Action"></TextField>
            </Grid>
            <Grid item xs={6} md={3}>
              <TextField onChange={this.handleChange} value={this.state.input} variant="outlined" name='input' label="Input"></TextField>
            </Grid>
            <Grid item xs={6} md={3}>
              <TextField onChange={this.handleChange} value={this.state.nextState} variant="outlined" name='nextState' label="Next State"></TextField>
            </Grid>
            <Grid item xs={12} md={1}>
              <Button fullWidth size="large" variant="contained" onClick={this.submit}>
                <AddIcon/>
              </Button>
            </Grid>
          </Fragment>
          }
        </Grid>
      </Box>
      <Box my={4}>
        <Grid container alignItems="center" spacing={1}>
          <Grid item xs={3}>
            <Typography variant="h6" align="center">
              Examples:
            </Typography>
          </Grid>
          <Grid item xs={3}>
            <Button onClick={this.e1} variant="contained" color="primary">
              Program 1
            </Button>
          </Grid>
          <Grid item xs={3}>
            <Button onClick={this.e2} variant="contained" color="primary">
              Program 2
            </Button>
          </Grid>
          <Grid item xs={3}>
            <Button onClick={this.e3} variant="contained" color="primary">
              Program 3
            </Button>
          </Grid>
        </Grid>

      </Box>
      <Box my={4}>
        <Grid alignItems="center" container spacing={2}>
          <Grid item xs={12} md={10}>
            <TextField fullWidth onChange={this.handleChange} value={this.state.string} variant="outlined" name='string' label="Input string"></TextField>
          </Grid>
          <Grid item xs={12} md={2}>
            <Button onClick={this.submit} variant="contained" color="primary">
              Run TWA
            </Button>
          </Grid>
        </Grid>
      </Box>
      <Box my={4}>
        {this.state.logs.map(log => (
          <Typography variant="h6" align="center">
            {log}
          </Typography>
        ))}
      </Box>
      <Box my={4}>
        <Typography variant="h4" align="center">
          Result: {this.state.result}
        </Typography>
      </Box>
    </Container>
    );
  }
}

export default Screen;