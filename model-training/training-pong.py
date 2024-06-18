import pygame

ASPECT = 100
WIDTH, HEIGHT = 8 * ASPECT, 6 * ASPECT
BALL_R = 0.1 * ASPECT
PADDLE_WIDTH = 0.1 * ASPECT
PADDLE_HEIGHT = 0.3 * ASPECT
VEL = 0.1 * ASPECT

FPS = 60

class Ball():
    def __init__(self):
        self.x = WIDTH // 2
        self.y = HEIGHT // 3

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



pygame.init()
win = pygame.display.set_mode((WIDTH, HEIGHT))
pygame.display.set_caption("Pong training game")
clock = pygame.time.Clock()

def gameLoop():

    running = True
    paddle = Paddle()

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


        pygame.draw.rect(win, "white", (paddle.x, paddle.y, PADDLE_WIDTH, PADDLE_HEIGHT))


        # Update screen

        pygame.display.flip()

        clock.tick(FPS)

    pygame.quit()

gameLoop()