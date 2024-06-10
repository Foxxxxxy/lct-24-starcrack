import heapq
import json
from pathlib import Path
from fastapi import Request

from utils.logger import logger


class DijkstraAlgorithm:

    def __init__(self):
        logger.info("Initializing route graph...")
        self.graph = dict()

        logger.info("Uploading stations graph...")
        self.__load_graph(f"/app/algorithms/data/stations_graph.json")

        logger.info("Uploading transfers graph...")
        self.__load_graph(f"/app/algorithms/data/transfers_graph.json")

    def __load_graph(self, filename):
        with open(filename, "r") as f:
            graph = json.load(f)

            for entry in graph:
                st1 = int(entry["id_st1"])
                st2 = int(entry["id_st2"])
                time = float(entry["time"].replace(",", "."))

                if st1 not in self.graph.keys():
                    self.graph[st1] = dict()
                if st2 not in self.graph.keys():
                    self.graph[st2] = dict()

                st_dict1 = self.graph[st1]
                st_dict1[st2] = time

                st_dict2 = self.graph[st2]
                st_dict2[st1] = time

    def calculate_path(self, start, target):
        heap = []
        distances = {vertex: float('infinity') for vertex in self.graph}

        distances[start] = 0
        previous_vertices = {vertex: None for vertex in self.graph}
        heapq.heappush(heap, (0, start))

        while heap:
            current_distance, current_vertex = heapq.heappop(heap)

            if current_vertex == target:
                break

            if current_distance > distances[current_vertex]:
                continue

            for neighbor, weight in self.graph[current_vertex].items():
                if distances[neighbor] < float('infinity'):
                    continue

                distance = current_distance + weight

                if distance < distances[neighbor]:
                    distances[neighbor] = distance
                    previous_vertices[neighbor] = current_vertex
                    heapq.heappush(heap, (distance, neighbor))

        path = []
        current_vertex = target
        while current_vertex is not None:
            path.append(current_vertex)
            current_vertex = previous_vertices[current_vertex]
        path = path[::-1]

        return {"path": path if len(path) > 1 else [], "eta": distances[target]}


def get_dijkstra_algorithm(request: Request) -> DijkstraAlgorithm:
    return request.app.state.dijkstra_algorithm
