
class Program:
    def __init__(self, states):
        self.states = states
        self.tape = '##'
        self.tapePointer = 0

    def addLog(self, string):
        self.log.append(string) 

    def process(self, string, startState):
        self.log = []
        self.tape = '#' + string + '#'
        self.currentState = self.states[startState]
        self.addLog('Starting at State ' + str(startState))
        self.addLog('===')
        while(True):
            action = self.currentState.action
            if(action == 'right'):
                self.addLog('Moving tape to the right')
                self.tapePointer += 1
                logTape = self.tape[:self.tapePointer] + '[' + self.tape[self.tapePointer] + ']' + self.tape[self.tapePointer+1:] 
                self.addLog(logTape)
            elif(action == 'left'):
                self.addLog('Moving tape to the left')
                if(self.tapePointer > 0):
                    self.tapePointer -= 1
                logTape = self.tape[:self.tapePointer] + '[' + self.tape[self.tapePointer] + ']' + self.tape[self.tapePointer+1:] 
                self.addLog(logTape)
            elif(action == 'accept'):
                return {'result': True, 'log': self.log}
            elif(action == 'reject'):
                return {'result': False, 'log': self.log}
            toState = self.currentState.transition(self.tape[self.tapePointer])
            self.addLog('Moving from State ' + str(self.currentState.stateNumber) + ' to State ' + str(toState))
            self.currentState = self.states[toState]
            self.addLog('===')
        
class State:
    def __init__(self, action, stateNumber):
        self.action = action 
        self.stateNumber = stateNumber
        self.transitions = {}

    def addTransition(self, character, stateNumber):
        self.transitions[character] = stateNumber

    def transition(self, character):
        return self.transitions[character]

import json

def simulate(data):
    states = {}
    print(data)
    for stateData in data['states']:
        state = State(stateData['action'], int(stateData['stateNumber']))
        for transition in stateData['transitions']:
            try:
                state.addTransition(transition['character'], int(transition['stateNumber']))
            except:
                state.addTransition(transition['character'], transition['stateNumber'])
        states[int(stateData['stateNumber'])] = state
    program = Program(states)
    return program.process(data['string'],1)

    
