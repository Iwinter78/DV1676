import { jest, describe, expect, test } from "@jest/globals";
const host = "http://localhost:1337";

describe("User features in rest api", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    global.fetch = jest.fn();
  });

  test("Should create a user", async () => {
    const username = "MyUser";
    const email = "myuser@email.com";

    const mockResponse = {
      message: "Användare skapad",
      status: 201,
      json: () =>
        Promise.resolve({
          username,
          email,
        }),
    };

    global.fetch.mockResolvedValue(mockResponse);

    const response = await fetch(`${host}/api/v1/create/user`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, email }),
    });

    const data = await response.json();
    expect(response.status).toBe(201);
    expect(response.message).toBe("Användare skapad");
    expect(data.username).toBe(username);
    expect(data.email).toBe(email);
  });

  test("Should not create a user when missing email", async () => {
    const username = "MyUser";

    const mockResponse = {
      message: "Email och användarnamn krävs",
      status: 400,
      json: () =>
        Promise.resolve({
          message: "Email och användarnamn krävs",
          status: 400,
        }),
    };

    global.fetch.mockResolvedValue(mockResponse);

    const response = await fetch(`${host}/api/v1/create/user`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username }),
    });

    const data = await response.json();
    expect(response.status).toBe(400);
    expect(data.message).toBe("Email och användarnamn krävs");
  });

  test("Should not create a user when missing username", async () => {
    const email = "myuser@email.com";

    const mockResponse = {
      message: "Email och användarnamn krävs",
      status: 400,
      json: () =>
        Promise.resolve({
          message: "Email och användarnamn krävs",
          status: 400,
        }),
    };

    global.fetch.mockResolvedValue(mockResponse);

    const response = await fetch(`${host}/api/v1/create/user`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });

    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.message).toBe("Email och användarnamn krävs");
  });

  test("Tries to create a user that is a data type that is not string", async () => {
    const username = [];
    const email = null;

    const mockResponse = {
      message: "Email och användarnamn krävs",
      status: 400,
      json: () =>
        Promise.resolve({
          message: "Email och användarnamn krävs",
          status: 400,
        }),
    };

    global.fetch.mockResolvedValue(mockResponse);

    const response = await fetch(`${host}/api/v1/create/user`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, email }),
    });

    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.message).toBe("Email och användarnamn krävs");
  });

  test("Should get a user", async () => {
    const username = "MyUser";

    const mockResponse = {
      status: 200,
      json: () =>
        Promise.resolve({
          username,
          balance: 0,
          debt: 0,
        }),
    };

    global.fetch.mockResolvedValue(mockResponse);

    const response = await fetch(`${host}/api/v1/user?username=${username}`);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.username).toBe(username);
    expect(data.balance).toBe(0);
    expect(data.debt).toBe(0);
  });

  test("Being able to delete a user", async () => {
    const username = "MyUser";

    const mockResponse = {
      status: 200,
      json: () =>
        Promise.resolve({
          message: "Användare raderad",
          status: 200,
        }),
    };

    global.fetch.mockResolvedValue(mockResponse);

    const response = await fetch(`${host}/api/v1/delete/user/${username}`, {
      method: "DELETE",
    });

    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.message).toBe("Användare raderad");
  });

  test("Should not be able to delete a user if the username is missing", async () => {
    const mockResponse = {
      status: 400,
      json: () =>
        Promise.resolve({
          message: "Användarnamn krävs",
          status: 400,
        }),
    };

    global.fetch.mockResolvedValue(mockResponse);

    const response = await fetch(`${host}/api/v1/delete/user/`, {
      method: "DELETE",
    });

    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.message).toBe("Användarnamn krävs");
  });

  test("Should update a users balance", async () => {
    const username = "MyUser";
    const balance = 100;

    const mockResponse = {
      status: 200,
      json: () =>
        Promise.resolve({
          message: "Användarens saldo uppdaterat",
          status: 200,
        }),
    };

    global.fetch.mockResolvedValue(mockResponse);

    const response = await fetch(
      `${host}/api/v1/update/user/balance`,
      {
        method: "PUT",
        body: JSON.stringify({ username, balance }),
      }
    );

    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.message).toBe("Användarens saldo uppdaterat");
  });
});
