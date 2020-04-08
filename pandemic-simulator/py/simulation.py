import math
import random
from tqdm import tqdm


def sign(x): return math.copysign(1, x)


def pickRandom(arr):
    return arr[math.floor(random.random() * len(arr))]


class Settings:
    name = 'Default'

    # General Settings
    population_size = 10000
    worker_percent = 0.6
    students_percent = 0.2
    commercial_areas = 20
    school_areas = 5
    social_areas = 30
    visit_probability = 0.0002
    social_probability = 0.0004

    # Virus Settings
    start_manifest = 2
    manifest_up_to = 6
    spread_probability = 0.0015
    recovery_time = 4
    mortality_rate = 0.09
    reinfect_probability = 0.0001

    allow_work = True
    allow_visits = True
    allow_social = True
    allow_schools = True


class Individual:

    x = 0
    x_diff = 0
    y = 0
    y_diff = 0
    time_until_manifestation = 0

    social_probability = 0
    visit_probability = 0

    doomed = False
    dead = False
    hospitalized = False
    infected = False
    was_infected = False
    recover_time = None

    current_target = None

    assigned_home = None
    assigned_work = None

    in_school = False
    work_start = None
    return_time = None
    work_return_time = None

    graphic = None

    def move(self, location, resolution):
        self.x = location.x * resolution
        self.y = location.y * resolution

    def tick(self, minute, resolution, social_areas, house_areas, hospital, hospitalize, settings):

        if self.infected and self.time_until_manifestation > 0:
            self.time_until_manifestation = self.time_until_manifestation - 1
            if self.time_until_manifestation == 0:
                hospitalize(self)

        if self.current_target != hospital:
            if minute == self.return_time:
                self.current_target = self.assigned_home

            if self.current_target != self.assigned_home and minute == 2 * 60:
                self.current_target = self.assigned_home

            if self.current_target == self.assigned_home:
                if (((settings.allow_work == True and self.in_school == False) or
                        (settings.allow_schools == True and self.in_school == True)) and
                        minute == self.work_start):
                    self.current_target = self.assigned_work
                    self.return_time = self.work_return_time

                if minute > 6 * 60 and (self.assigned_work == None or settings.allow_work == False or minute > 0 if self.return_time == None else self.return_time):
                    if settings.allow_social == True and random.random() < self.social_probability:
                        self.current_target = pickRandom(social_areas)
                        self.return_time = math.floor(
                            minute + random.random() * 6 * 60)
                    elif settings.allow_visits == True and random.random() < self.visit_probability:
                        self.current_target = pickRandom(house_areas)
                        self.return_time = math.floor(
                            minute + random.random() * 3 * 60)          

                if self.return_time != None and self.return_time > 24*60:
                    self.return_time = math.floor(self.return_time - 24*60)   
        
        else:
        
            self.recover_time = self.recover_time - 1
            if self.recover_time == 0:
                self.current_target = self.assigned_home
                hospitalize(self, True)

       

        x_diff = (self.current_target.x * resolution) - self.x
        x_modifier = min(resolution, abs(x_diff))
        y_diff = (self.current_target.y * resolution) - self.y
        y_modifier = min(resolution, abs(y_diff))

        self.x_diff = 0 if random.random() < 0.1 else sign(x_diff) * x_modifier / 2
        self.y_diff = 0 if random.random() < 0.1 else sign(y_diff) * y_modifier / 2

        self.x = self.x + self.x_diff
        self.y = self.y + self.y_diff


class Location:
    x = 0
    y = 0
    location_type = 0

    def __init__(self, loc_type, x, y):
        self.location_type = loc_type
        self.x = x
        self.y = y

    def __str__(self):
        return f'Type: {self.loc_Type} Location: {self.x},{self.y}'


class Stats:

    def __init__(self):
        self.deaths = 0
        self.infected = 0
        self.hospitalized = 0

        self.deaths_hist = []
        self.infected_hist = []
        self.hospitalized_hist = []

    def store(self):
        self.infected_hist.append(self.infected)
        self.deaths_hist.append(self.deaths)
        self.hospitalized_hist.append(self.hospitalized)

    def __str__(self):
        return f'Infected: {self.infected}. Deaths: {self.deaths}. Hospitalized: {self.hospitalized}'


class Simulation:

    quadrants = {}
    minute = 0
    resolution = 6
    isolation = False
    on_infect = None

    def __init__(self, settings, canvas_width=None):
        self.stats = Stats()
        self.map = {}
        self.settings = settings

        lat = max(math.floor(math.sqrt(settings.population_size / 2 +
                                       settings.commercial_areas + settings.social_areas + settings.school_areas)), 30)
        self.mapSize = [lat, lat]

        if canvas_width != None:
            self.resolution = canvas_width / lat

        self.hospital = self.find_free_spot(2)
        self.commercial = []
        self.housing = []
        self.social = []
        self.schools = []
        self.individuals = []

        for i in range(0, settings.commercial_areas):
            self.commercial.append(self.find_free_spot(1))

        for i in range(0, settings.social_areas):
            self.social.append(self.find_free_spot(4))

        for i in range(0, settings.school_areas):
            self.schools.append(self.find_free_spot(3))

        freeHomes = []

        for i in tqdm(range(0, settings.population_size)):
            assigned_home = False

            if len(freeHomes) > 0:
                assigned_home = freeHomes[math.floor(
                    random.random() * len(freeHomes))]
            else:
                assigned_home = self.find_free_spot(0)
                assigned_home.occupation = 0
                self.housing.append(assigned_home)
                freeHomes.append(assigned_home)

            assigned_home.occupation = assigned_home.occupation + 1

            if assigned_home.occupation > 3 or random.random() < 0.3:
                freeHomes.remove(assigned_home)

            individual = Individual()
            individual.social_probability = settings.social_probability
            individual.visit_probability = settings.visit_probability
            individual.move(assigned_home, self.resolution)
            individual.assigned_home = assigned_home
            individual.current_target = assigned_home
            self.individuals.append(individual)

        work_pop = int(settings.population_size * settings.worker_percent)
        school_pop = int(settings.population_size * settings.students_percent)

        for i in tqdm(range(0, work_pop)):
            self.individuals[i].assigned_work = pickRandom(self.commercial)
            self.individuals[i].work_start = (math.floor(
                random.random() * 4) + 6) * 60 + math.floor(random.random() * 30)
            self.individuals[i].work_return_time = self.individuals[i].work_start + 8 * 60

        for i in tqdm(range(work_pop, work_pop+school_pop)):
            self.individuals[i].assigned_work = pickRandom(self.schools)
            self.individuals[i].work_start = 8 * \
                60 + math.floor(random.random() * 30)
            self.individuals[i].work_return_time = self.individuals[i].work_start + 6 * 60
            self.individuals[i].in_school = True

        self.lots = [self.hospital] + self.housing + \
            self.schools + self.commercial + self.social

        self.calculate_quadrants()

    def calculate_quadrants(self):
        self.quadrants = {}

        for ind in self.individuals:
            fx = math.floor(ind.x)
            fy = math.floor(ind.y)
            key = f'{fx}-{fy}'
            if key not in self.quadrants:
                self.quadrants[key] = []

            self.quadrants[key].append(ind)

    def find_free_spot(self, location_type):

        spot = None
        while spot == None:
            x = math.floor(
                1 + math.floor(random.random() * (self.mapSize[0] - 1)))
            y = math.floor(
                1 + math.floor(random.random() * (self.mapSize[1] - 1)))
            key = f'{x}-{y}'

            if key not in self.map:
                spot = Location(location_type, x, y)
                self.map[key] = spot

        return spot

    def infect(self, individual):
        if individual.infected == False and (individual.was_infected == False or random.random() < self.settings.reinfect_probability):
            if self.on_infect != None:
                self.on_infect(individual)
            self.stats.infected = self.stats.infected + 1
            individual.infected = True
            individual.time_until_manifestation = (self.settings.start_manifest +
                                                   math.floor(random.random() * (self.settings.manifest_up_to))) * 24 * 60
            individual.doomed = random.random() < self.settings.mortality_rate
            individual.recover_time = (self.settings.recovery_time + math.floor(
                self.settings.recovery_time * random.random() * 0.3)) * 24 * 60

    def is_neighbor(self, ind, neigh):
        xd = (ind.x - neigh.x) * (ind.x - neigh.x)
        yd = (ind.y - neigh.y) * (ind.y - neigh.y)
        res = math.sqrt(xd + yd)
        return res < self.resolution / 2

    def hospitalize(self, ind, dehospitalize=False):

        if dehospitalize == False:
            if ind.doomed == True:
                ind.dead = True
                self.stats.infected = self.stats.infected - 1
                self.stats.deaths = self.stats.deaths + 1
            else:
                ind.current_target = self.hospital
                self.stats.hospitalized = self.stats.hospitalized + 1
        else:
            ind.infected = False
            ind.was_infected = True
            self.stats.hospitalized = self.stats.hospitalized - 1
            self.stats.infected = self.stats.infected - 1

    def tick(self):
        self.minute = self.minute + 1
        self.calculate_quadrants()
        if self.minute > 60*24:
            # print(self.stats)
            self.minute = 0

        if self.minute % 60:
            self.stats.store()

        for i in range(0, len(self.individuals)):
            ind = self.individuals[i]
            ind.tick(self.minute, self.resolution, self.social,
                     self.housing, self.hospital, self.hospitalize, self.settings)

            if ind.infected == True:
                if random.random() < self.settings.spread_probability:
                    fx = math.floor(ind.x)
                    fy = math.floor(ind.y)
                    key = f'{fx}-{fy}'
                    if key in self.quadrants:
                        for neigh in self.quadrants[key]:
                            if neigh != ind:
                                self.infect(neigh)
