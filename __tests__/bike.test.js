import { jest, describe, expect, test } from "@jest/globals";
import e from "express";
const host = "http://localhost:1337";

describe("Bike features in rest api", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        global.fetch = jest.fn();
    });

    test("Be able to create a bike", async () => {
        const bike = {
            gps: "5HJW+FGX",
            city: "Karlskrona"
        };

        const mockResponse = {
            message: "Cykel skapad",
            status: 201,
            json: () =>
                Promise.resolve({
                    bike
                }),
        };

        global.fetch.mockResolvedValue(mockResponse);

        const response = await fetch(`${host}/api/v1/create/bike`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(bike),
        });

        const data = await response.json();

        expect(response.status).toBe(201);
        expect(response.message).toBe("Cykel skapad");
        expect(data.bike.gps).toBe(bike.gps);
        expect(data.bike.city).toBe(bike.city);
    });

    test("Should not create a bike when missing city", async () => {
        const bike = {
            gps: "5HJW+FGX"
        };

        const mockResponse = {
            message: "GPS och stad krävs",
            status: 400,
        };

        global.fetch.mockResolvedValue(mockResponse);

        const response = await fetch(`${host}/api/v1/create/bike`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(bike),
        });

        expect(response.status).toBe(400);
        expect(response.message).toBe("GPS och stad krävs");
    });

    test("Should not create a bike when missing gps", async () => {
        const bike = {
            city: "Karlskrona"
        };

        const mockResponse = {
            message: "GPS och stad krävs",
            status: 400,
        };

        global.fetch.mockResolvedValue(mockResponse);

        const response = await fetch(`${host}/api/v1/create/bike`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(bike),
        });

        expect(response.status).toBe(400);
        expect(response.message).toBe("GPS och stad krävs");
    });

    test("Updates the position of a bike", async () => {
        const bike = {
            id: 1,
            gps: "5HJW+FGX"
        };

        const mockResponse = {
            message: "Cykel uppdaterad",
            status: 200,
            json: () =>
                Promise.resolve({
                    bike
                }),
        };

        global.fetch.mockResolvedValue(mockResponse);

        const response = await fetch(`${host}/api/v1/update/bike`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(bike),
        });

        const data = await response.json();

        expect(response.status).toBe(200);
        expect(response.message).toBe("Cykel uppdaterad");
        expect(data.bike.id).toBe(bike.id);
        expect(data.bike.gps).toBe(bike.gps);
    });

    test("Should not update a bike when missing gps", async () => {
        const bike = {
            id: 1
        };

        const mockResponse = {
            message: "GPS och id krävs",
            status: 400,
        };

        global.fetch.mockResolvedValue(mockResponse);

        const response = await fetch(`${host}/api/v1/update/bike`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(bike),
        });

        expect(response.status).toBe(400);
        expect(response.message).toBe("GPS och id krävs");
    });

    test("Should not update a bike when missing id", async () => {
        const bike = {
            gps: "5HJW+FGX"
        };

        const mockResponse = {
            message: "GPS och id krävs",
            status: 400,
        };

        global.fetch.mockResolvedValue(mockResponse);

        const response = await fetch(`${host}/api/v1/update/bike`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(bike),
        });

        expect(response.status).toBe(400);
        expect(response.message).toBe("GPS och id krävs");
    });

    test("Should be able to book a bike", async () => {
        const bike = {
            id: 1,
            user: 1
        };

        const mockResponse = {
            message: "Cykel bokad",
            status: 200,
            json: () =>
                Promise.resolve({
                    bike
                }),
        };

        global.fetch.mockResolvedValue(mockResponse);

        const response = await fetch(`${host}/api/v1/bike/book`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(bike),
        });

        const data = await response.json();

        expect(response.status).toBe(200);
        expect(response.message).toBe("Cykel bokad");
        expect(data.bike.id).toBe(bike.id);
        expect(data.bike.user).toBe(bike.user);
    });

    test("Should not be able to book a bike when missing user", async () => {
        const bike = {
            id: 1
        };

        const mockResponse = {
            message: "Id och användare-id krävs",
            status: 400,
        };

        global.fetch.mockResolvedValue(mockResponse);

        const response = await fetch(`${host}/api/v1/bike/book`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(bike),
        });

        expect(response.status).toBe(400);
        expect(response.message).toBe("Id och användare-id krävs");
    });

    test("Should not be able to book a bike when missing id", async () => {
        const bike = {
            user: 1
        };

        const mockResponse = {
            message: "Id och användare-id krävs",
            status: 400,
        };

        global.fetch.mockResolvedValue(mockResponse);

        const response = await fetch(`${host}/api/v1/bike/book`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(bike),
        });

        expect(response.status).toBe(400);
        expect(response.message).toBe("Id och användare-id krävs");
    });
});
