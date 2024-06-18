import pygame
import random
import os
import neat
import numpy as np
import pickle

ASPECT = 100
WIDTH, HEIGHT = 8 * ASPECT, 6 * ASPECT
BALL_R = 0.1 * ASPECT
PADDLE_WIDTH = 0.1 * ASPECT
PADDLE_HEIGHT = 0.5 * ASPECT
VEL = 0.1 * ASPECT
MAX_Y_VEL = 2 * ASPECT
Y_DIFF_FACTOR = 15
BALL_START_VEL = 0.04 * ASPECT
MAX_BALLS_NUMBER = 3

FPS = 300


class Ball():
    def __init__(self):
        self.x = WIDTH
        self.y = 0
        self.x_vel = -BALL_START_VEL
        self.y_vel = 3
        self.dead = False
    
    def move(self):
        self.x += self.x_vel
        self.y += self.y_vel

        if self.y < BALL_R:
            self.y = self.y * -1 + BALL_R
            self.y_vel *= -1
        
        elif self.y > HEIGHT - BALL_R:
            self.y = 2 * HEIGHT - self.y - BALL_R
            self.y_vel *= -1

        if self.x > WIDTH - BALL_R:
            self.x = 2 * WIDTH - self.x - BALL_R
            self.x_vel *= -1
            self.y_vel = random.randint(0, 10)
        
        elif self.x < BALL_R:
            self.dead = True

    def bounce(self, y_dif):
        self.y_vel = self.y_vel + y_dif
        if self.y_vel > MAX_Y_VEL:
            self.y_vel = MAX_Y_VEL
        if self.y_vel < -MAX_Y_VEL:
            self.y_vel = -MAX_Y_VEL
        self.x_vel *= -1


class Paddle():
    def __init__(self):
        self.x = 0 + BALL_R * 2
        self.y = 0

    def move(self, action):
        if action == "up":
            self.y -= VEL
        else:
            self.y += VEL
        
        if self.y < 0:
            self.y = 0
        if self.y > HEIGHT - PADDLE_HEIGHT:
            self.y = HEIGHT - PADDLE_HEIGHT

def handle_collision(ball: Ball, paddle: Paddle) -> bool:
    if ball.x_vel < 0 and not ball.dead and ball.x <= paddle.x + PADDLE_WIDTH and ball.y >= paddle.y and ball.y <= paddle.y + PADDLE_HEIGHT:
        y_dif = ball.y - (paddle.y + PADDLE_HEIGHT // 2)
        y_dif = (y_dif / PADDLE_HEIGHT) * Y_DIFF_FACTOR
        ball.bounce(round(y_dif))

        return True

    return False
        



def gameLoop(genome, config):
    pygame.init()
    FONT = pygame.font.SysFont("comicsans", 40)
    win = pygame.display.set_mode((WIDTH, HEIGHT))
    pygame.display.set_caption("Pong training game")
    clock = pygame.time.Clock()
    ball_timeout = 0
    max_balls = MAX_BALLS_NUMBER

    running = True
    paddle = Paddle()
    balls = [Ball()]
    max_balls -= 1
    score = 0

    net = neat.nn.FeedForwardNetwork.create(genome, config)

    while running:

        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                running = False
                quit()
        
        keys = pygame.key.get_pressed()
        if keys[pygame.K_ESCAPE]:
            running = False
            quit()
        # if keys[pygame.K_UP] or keys[pygame.K_w]:
        #     paddle.move("up")
        # if keys[pygame.K_DOWN] or keys[pygame.K_s]:
        #     paddle.move("down")

        nearest_ball_index = balls.index(min(balls, key=lambda x: x.x if x.x_vel < 0 else WIDTH))

        output = net.activate((paddle.y + PADDLE_HEIGHT // 2, balls[nearest_ball_index].y, balls[nearest_ball_index].x, balls[nearest_ball_index].y_vel))

        max_index = np.argmax(output)

        if max_index == 0:
            paddle.move("up")
        elif max_index == 1:
            paddle.move("down")

        win.fill("black")

        # Game
        for ball in balls:
            ball.move()
            is_increment = handle_collision(ball, paddle)
            pygame.draw.circle(win, "white", (ball.x, ball.y), BALL_R)
        
        pygame.draw.rect(win, "white", (paddle.x, paddle.y, PADDLE_WIDTH, PADDLE_HEIGHT))

        # Update screen

        score_text = FONT.render(f"Score: {score}", 1, "white")
        win.blit(score_text, (WIDTH - score_text.get_width() - 30, 1))
        pygame.display.flip()

        clock.tick(FPS)

        ball_timeout += 1

        if max_balls > 0 and ball_timeout == FPS:
            balls.append(Ball())
            max_balls -= 1
            ball_timeout = 0

        for ball in balls:

            if ball.dead:
                running = False
                genome.fitness -= 1
        
            if is_increment:
                score += 1
                genome.fitness += 1
                is_increment = False


    pygame.quit()

# NEAT setup

local_dir = os.path.dirname(__file__)
config_path = os.path.join(local_dir, "config-ff.txt")
config = neat.config.Config(neat.DefaultGenome, neat.DefaultReproduction, neat.DefaultSpeciesSet, neat.DefaultStagnation, config_path)

# population = neat.Checkpointer.restore_checkpoint('neat-checkpoint-1')
population = neat.Population(config)
population.add_reporter(neat.StdOutReporter(True))
stats = neat.StatisticsReporter()
population.add_reporter(stats)
# population.add_reporter(neat.Checkpointer(10))

def run_all_genomes(genomes, config):

    for (_genome_id, genome) in genomes:
        genome.fitness = 0
        gameLoop(genome, config)


winner = population.run(run_all_genomes, 1500)
pickle.dump(winner)