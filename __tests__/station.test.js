import { jest, describe, expect, test, beforeEach } from "@jest/globals";

const host = "http://localhost:1337";

const mockResponse = [
    [
      {
        id: 1,
        charge_taken: 0,
        city: 1,
        charging_size: 10,
        gps: "[\n    [56.162176519644504, 15.586952569742806],\n    [56.16212933069397, 15.586952569742806],\n    [56.16212933069397, 15.587559898243313],\n    [56.162176519644504, 15.587559898243313],\n    [56.162176519644504, 15.586952569742806]\n]",
        bikes_in_station: 0,
      },
      {
        id: 2,
        charge_taken: 0,
        city: 1,
        charging_size: 10,
        gps: "[\n    [56.16346379886474, 15.58657449282066],\n    [56.16317586060731, 15.58657449282066],\n    [56.16317586060731, 15.586744450395031],\n    [56.16346379886474, 15.586744450395031],\n    [56.16346379886474, 15.58657449282066]\n]",
        bikes_in_station: 0,
      },
    ],
  ];

describe("Station features in rest api", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    global.fetch = jest.fn();
  });
  test("Check that all keys are in place", async () => {
    global.fetch.mockResolvedValue({
      json: () => Promise.resolve(mockResponse),
    });

    let response = await fetch(`${host}/api/v1/stations`);
    let data = await response.json();

    expect(data[0].length).toBe(2);

    expect(data[0].find((station) => station.id === 1)).toEqual({
      id: 1,
      charge_taken: 0,
      city: 1,
      charging_size: 10,
      gps: "[\n    [56.162176519644504, 15.586952569742806],\n    [56.16212933069397, 15.586952569742806],\n    [56.16212933069397, 15.587559898243313],\n    [56.162176519644504, 15.587559898243313],\n    [56.162176519644504, 15.586952569742806]\n]",
      bikes_in_station: 0,
    });
    
    expect(data[0].find((station) => station.id === 2)).toEqual({ 
        id: 2,
        charge_taken: 0,
        city: 1,
        charging_size: 10,
        gps: "[\n    [56.16346379886474, 15.58657449282066],\n    [56.16317586060731, 15.58657449282066],\n    [56.16317586060731, 15.586744450395031],\n    [56.16346379886474, 15.586744450395031],\n    [56.16346379886474, 15.58657449282066]\n]",
        bikes_in_station: 0,
     });

     data[0].forEach((station) => {
      expect(station).toHaveProperty("id");
      expect(station).toHaveProperty("charge_taken");
      expect(station).toHaveProperty("city");
      expect(station).toHaveProperty("charging_size");
      expect(station).toHaveProperty("gps");
      expect(station).toHaveProperty("bikes_in_station");
    });
  });

  test("Look for the correct values from the response", async () => {
    global.fetch.mockResolvedValue({
      json: () => Promise.resolve(mockResponse),
    });

    let response = await fetch(`${host}/api/v1/stations`);
    let data = await response.json();

    expect(data[0].find((station) => station.id === 1).charge_taken).toBe(0);
    expect(data[0].find((station) => station.id === 1).city).toBe(1);
    expect(data[0].find((station) => station.id === 1).charging_size).toBe(10);
    expect(data[0].find((station) => station.id === 1).gps).toBe("[\n    [56.162176519644504, 15.586952569742806],\n    [56.16212933069397, 15.586952569742806],\n    [56.16212933069397, 15.587559898243313],\n    [56.162176519644504, 15.587559898243313],\n    [56.162176519644504, 15.586952569742806]\n]");
    expect(data[0].find((station) => station.id === 1).bikes_in_station).toBe(0);

    expect(data[0].find((station) => station.id === 2).charge_taken).toBe(0);
    expect(data[0].find((station) => station.id === 2).city).toBe(1);
    expect(data[0].find((station) => station.id === 2).charging_size).toBe(10);
    expect(data[0].find((station) => station.id === 2).gps).toBe("[\n    [56.16346379886474, 15.58657449282066],\n    [56.16317586060731, 15.58657449282066],\n    [56.16317586060731, 15.586744450395031],\n    [56.16346379886474, 15.586744450395031],\n    [56.16346379886474, 15.58657449282066]\n]");
    expect(data[0].find((station) => station.id === 2).bikes_in_station).toBe(0);
  });

  test("Check for the correct data types", async () => {
    global.fetch.mockResolvedValue({
      json: () => Promise.resolve(mockResponse),
    });

    let response = await fetch(`${host}/api/v1/stations`);
    let data = await response.json();

    data[0].forEach((station) => {
      expect(typeof station.id).toBe("number");
      expect(typeof station.charge_taken).toBe("number");
      expect(typeof station.city).toBe("number");
      expect(typeof station.charging_size).toBe("number");
      expect(typeof station.gps).toBe("string");
      expect(typeof station.bikes_in_station).toBe("number");
    });
  });

  test("Check for returning correct status and msg on failure", async () => {
    global.fetch.mockResolvedValue({
      json: () => Promise.resolve({ 
        message: "Något gick fel, försök igen senare",
        status: 500,
        error: "Procedure get_all_stations does not exist",
      }),
    });

    let response = await fetch(`${host}/api/v1/stations`);
    let data = await response.json();

    expect(data.status).toBe(500);
    expect(data.message).toBe("Något gick fel, försök igen senare");
    expect(data.error).toBe("Procedure get_all_stations does not exist");
  });
});
