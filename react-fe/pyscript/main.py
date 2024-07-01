import pickle
import neat
from pyscript import window
import numpy
from pyweb import pydom
import time

winner = None

with open("winner.pickle", "rb") as f:
    winner = pickle.load(f)

config = neat.Config(
    neat.DefaultGenome,
    neat.DefaultReproduction,
    neat.DefaultSpeciesSet,
    neat.DefaultStagnation,
    "config-ff.txt",
)

net = neat.nn.FeedForwardNetwork.create(genome=winner, config=config)


def activate_network(_event):

    # ( center of paddle Y, nearest ball Y, nearest ball X, nearest ball Y vel)
    output = net.activate(
        (
            window.paddleMiddle,
            window.nearstBallY,
            window.nearstBallX,
            window.nearstBallYVel,
        )
    )

    max_index = numpy.argmax(output)
    action = 0

    if max_index == 0:
        action = "up"
    elif max_index == 1:
        action = "down"
    pydom["div#genome-output"].html = str(action)


pydom["div#python-ready"].html = "ready"
