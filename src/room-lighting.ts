// Shared positions for visible practical fixtures and their actual light sources.
export const studioLighting = {
  task: {
    position: [-3.25, 2.95, -2.8] as [number, number, number],
    color: "#ffd9a0",
    intensity: 12,
    distance: 5,
  },
  monitor: {
    position: [-0.65, 2.1, -1.9] as [number, number, number],
    color: "#a6d8ca",
    intensity: 5,
    distance: 3.5,
  },
  wall: {
    position: [0.1, 2.65, -2.75] as [number, number, number],
    color: "#8dc8b6",
    intensity: 7,
    distance: 5,
  },
  accent: {
    position: [2.7, 2.95, -2.8] as [number, number, number],
    color: "#ffe2ae",
    intensity: 12,
    distance: 4,
  },
};
