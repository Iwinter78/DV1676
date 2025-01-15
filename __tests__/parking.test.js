import { jest, describe, expect, test, beforeEach } from "@jest/globals";
const host = "http://localhost:1337";

const mockResponse = [
    [
        {
            "id": 1,
            "city": 1,
            "gps": "[\n  [56.1638, 15.59596],\n  [56.16385, 15.59615],\n  [56.16373, 15.59627],\n  [56.16367, 15.59606]\n  ]",
        },
        {
            "id": 2,
            "city": 1,
            "gps": "[\n[56.166, 15.58494],\n[56.16599, 15.58532],\n[56.16594, 15.58532],\n[56.16597, 15.58494]\n]",
        }
    ],
];

describe("Parking features in rest api", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        global.fetch = jest.fn();
    });

    test("Be able to get all parking zones", async () => {
        global.fetch.mockResolvedValue({
            json: () => Promise.resolve(mockResponse),
        });

        let response = await fetch(`${host}/api/v1/parking`);
        let data = await response.json();

        expect(data[0].length).toBe(2);

        expect(data[0].find((parking) => parking.id === 1)).toEqual({
            "id": 1,
            "city": 1,
            "gps": "[\n  [56.1638, 15.59596],\n  [56.16385, 15.59615],\n  [56.16373, 15.59627],\n  [56.16367, 15.59606]\n  ]",
        });

        expect(data[0].find((parking) => parking.id === 2)).toEqual({
            "id": 2,
            "city": 1,
            "gps": "[\n[56.166, 15.58494],\n[56.16599, 15.58532],\n[56.16594, 15.58532],\n[56.16597, 15.58494]\n]",
        });

        data[0].forEach((parking) => {
            expect(parking).toHaveProperty("id");
            expect(parking).toHaveProperty("city");
            expect(parking).toHaveProperty("gps");
        });
    });

    test("Should be the correct values", async () => {
        global.fetch.mockResolvedValue({
            json: () => Promise.resolve(mockResponse),
        });

        let response = await fetch(`${host}/api/v1/parking`);

        let data = await response.json();

        expect(data[0].length).toBe(2);
        expect(data[0][0].id).toBe(1);
        expect(data[0][0].city).toBe(1);
        expect(data[0][0].gps).toBe("[\n  [56.1638, 15.59596],\n  [56.16385, 15.59615],\n  [56.16373, 15.59627],\n  [56.16367, 15.59606]\n  ]");
    });
});
