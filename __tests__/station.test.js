import { jest, describe, expect, test } from "@jest/globals";

const host = "http://localhost:1337";

describe("Station features in rest api", () => {
    test("Get all infomation about every station", async () => {
        const mockResponse = [
            [
                {
                    {
                        id: 1,
                        charge_taken: 0,
                        city: 1,
                        charging_size: 10,
                        gps: "[\n    [56.162176519644504, 15.586952569742806],\n    [56.16212933069397, 15.586952569742806],\n    [56.16212933069397, 15.587559898243313],\n    [56.162176519644504, 15.587559898243313],\n    [56.162176519644504, 15.586952569742806]\n]",
                        bikes_in_station: 0
                    },
                }
            ]
        ]
    });
});