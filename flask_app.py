
# A very simple Flask Hello World app for you to get started with...

from flask import Flask, request, jsonify
from flask_cors import CORS, cross_origin
from collections import deque
import twasimulator

app = Flask(__name__)

@app.route('/', methods=['GET'])
@cross_origin()
def hello_world():
    return 'Hello world!'

@app.route('/twasimulator', methods=['POST'])
@cross_origin()
def twa():
    result = twasimulator.simulate(request.get_json())
    return {'results':result}

if __name__ == "__main__":
    app.run()