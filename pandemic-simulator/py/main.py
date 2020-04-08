import time

import pygame

from tkinter import *
from simulation import Settings, Simulation
from tqdm import tqdm

settings = Settings()
# settings.allow_schools = False
# settings.allow_work = False
# settings.allow_visits = True
# settings.allow_social = False

settings.population_size = 1000
settings.start_manifest = 1
canvas_width = 800
sim = Simulation(settings, canvas_width)
sim.infect(sim.individuals[0])


pygame.init()

colors = {
    0: (147, 255, 104),
    1: (104, 189, 255),
    2: (255, 66, 66),
    3: (195, 52, 235),
    4: (255, 207, 66)
}

# Set up the drawing window
screen = pygame.display.set_mode([canvas_width, canvas_width])
font = pygame.font.Font('freesansbold.ttf', 32) 
# Run until the user asks to quit
running = True
while running:

    sim.tick()

    # Did the user click the window close button?
    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            running = False

    # Fill the background with white
    screen.fill((255, 255, 255))

    for lot in sim.lots:
        pygame.draw.rect(screen, colors[lot.location_type],
                         (lot.x * sim.resolution - sim.resolution / 2,
                          lot.y * sim.resolution - sim.resolution / 2,
                          sim.resolution,
                          sim.resolution))

    for ind in sim.individuals:
        if ind.dead == False:
            pygame.draw.circle(screen,  (255, 0, 0) if ind.infected else (
                0, 0, 255), (ind.x, ind.y), sim.resolution / 6)

    pygame.draw.rect(screen, (0, 0, 255),
                     (0, 0, (sim.minute * canvas_width) / (20 * 60), 5))

    # Flip the display
    pygame.display.flip()

# Done! Time to quit.
pygame.quit()

# for i in tqdm(range(0,10 * 60 * 24)):
#     sim.tick()

'''
class runtime(object):
    def __init__(self):
        self.root = Tk()
        self.canvas = Canvas(
            self.root, width=canvas_width, height=canvas_width)
        self.canvas.pack()
        sim.on_infect = lambda x: self.canvas.itemconfig(x.graphic, fill='red')
        colors = {
            0: "#93ff68",
            1: "#68bdff",
            2: "#ff4242",
            4: '#ffcf42',
        }

        colors = {
            0: (147, 255, 104),
            1: (104, 189, 255),
            2: (255,66,66),
            4: (255, 207, 66)
        }

        for lot in sim.lots:
            lot.graphic = self.canvas.create_rectangle(lot.x * sim.resolution - sim.resolution / 2, lot.y * sim.resolution - sim.resolution / 2, lot.x *
                                                       sim.resolution + sim.resolution / 2, lot.y * sim.resolution + sim.resolution / 2, fill=colors[lot.location_type])

        for ind in sim.individuals:
            ind.graphic = self.canvas.create_oval(
                ind.x, ind.y, ind.x + sim.resolution / 4, ind.y + sim.resolution / 4, fill='#000')

        self.timer = self.canvas.create_rectangle(0, 0, 0, 0, fill='blue')

        sim.infect(sim.individuals[0])

        self.canvas.pack()
        self.root.after(0, self.animation)
        self.root.mainloop()

    def animation(self):
        while True:
            sim.tick()
            # self.canvas.itemconfig(self.timer, 0,0, sim.minute * canvas_width / 20 * 60, 5)
            self.canvas.coords(self.timer, 0, 0, (sim.minute *
                            canvas_width) / (20 * 60), 5)
            for ind in sim.individuals:
                self.canvas.move(ind.graphic, ind.x_diff, ind.y_diff)
            self.canvas.update()


runtime()
'''
