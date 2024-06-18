import pygame
import random

ASPECT = 100
WIDTH, HEIGHT = 8 * ASPECT, 6 * ASPECT
BALL_R = 0.1 * ASPECT
PADDLE_WIDTH = 0.1 * ASPECT
PADDLE_HEIGHT = 3 * ASPECT
VEL = 0.1 * ASPECT
MAX_Y_VEL = 2 * ASPECT
BALL_START_VEL = 0.04 * ASPECT

FPS = 60


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
        y_dif = paddle.y + PADDLE_HEIGHT // 2 - ball.y
        y_dif = HEIGHT // 2 // -y_dif 
        ball.bounce(y_dif)

        return True

    return False
        


pygame.init()
FONT = pygame.font.SysFont("comicsans", 40)
win = pygame.display.set_mode((WIDTH, HEIGHT))
pygame.display.set_caption("Pong training game")
clock = pygame.time.Clock()

def gameLoop():

    running = True
    paddle = Paddle()
    ball = Ball()
    score = 0

    while running:

        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                running = False
        
        keys = pygame.key.get_pressed()
        if keys[pygame.K_ESCAPE]:
            running = False
        if keys[pygame.K_UP] or keys[pygame.K_w]:
            paddle.move("up")
        if keys[pygame.K_DOWN] or keys[pygame.K_s]:
            paddle.move("down")

        win.fill("black")

        # Game

        ball.move()
        is_increment = handle_collision(ball, paddle)

        pygame.draw.circle(win, "white", (ball.x, ball.y), BALL_R)
        pygame.draw.rect(win, "white", (paddle.x, paddle.y, PADDLE_WIDTH, PADDLE_HEIGHT))

        # Update screen

        score_text = FONT.render(f"Score: {score}", 1, "white")
        win.blit(score_text, (WIDTH - score_text.get_width() - 30, 1))
        pygame.display.flip()

        clock.tick(FPS)

        if ball.dead:
            running = False
        
        if is_increment:
            score += 1
            is_increment = False


    pygame.quit()

gameLoop()