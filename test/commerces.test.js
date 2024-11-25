import request from "supertest";
import mongoose from "mongoose";
import app from "../app"; // Assuming your Express app is exported from this file
import "dotenv/config";
import commerce from "../models/nosql/commerce";

let token; // Declare the token variable outside the describe block

describe("Commerce API", () => {
  beforeAll(async () => {
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.DB_URI_TEST, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
    }

    // Create an admin user
    await request(app).post("/api/users/register").send({
      name: "Alice Doe",
      email: "alice@example.com",
      password: "password123",
      age: 25,
      city: "San Francisco",
      interest: "Finance",
      allowOffers: true,
      role: "admin",
    });

    // Login to get the auth token
    const loginRes = await request(app).post("/api/users/login").send({
      email: "alice@example.com",
      password: "password123",
    });

    token = loginRes.header["auth-token"];
  });

  afterAll(async () => {
    await mongoose.connection.db.dropDatabase();
    await mongoose.connection.close();
  });

  afterEach(async () => {
    await commerce.deleteMany({});
  });

  // Other tests can use the `token` variable
  it("should get all commerces", async () => {
    const response = await request(app)
      .get("/api/commerces/view-all")
      .set("Authorization", `Bearer ${token}`)
      .expect(200);

    expect(response.body).toBeInstanceOf(Array);
  });

  it("should create a new commerce", async () => {
    const response = await request(app)
      .post("/api/commerces/create")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "Commerce 1",
        cif: "A12345678",
        address: "1234 Main St",
        email: "commerce1@example.com",
        phone: "123-456-7890",
        pageId: 1,
      })
      .expect(200);

    expect(response.body.message).toBe("Commerce saved");
  });

  it("should view the created commerce", async () => {
    // First, create a new commerce
    const createRes = await request(app)
      .post("/api/commerces/create")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "Commerce 2",
        cif: "B12345678",
        address: "5678 Market St",
        email: "commerce2@example.com",
        phone: "987-654-3210",
        pageId: 2,
      })
      .expect(200);

    // Now, view the created commerce
    const response = await request(app)
      .get(`/api/commerces/view/B12345678`)
      .set("Authorization", `Bearer ${token}`)
      .expect(200);

    expect(response.body).toHaveProperty("name", "Commerce 2");
    expect(response.body).toHaveProperty("cif", "B12345678");
    expect(response.body).toHaveProperty("address", "5678 Market St");
    expect(response.body).toHaveProperty("email", "commerce2@example.com");
    expect(response.body).toHaveProperty("phone", "987-654-3210");
    expect(response.body).toHaveProperty("pageId", 2);
  });

  it("should update an existing commerce", async () => {
    // First, create a new commerce
    const createRes = await request(app)
      .post("/api/commerces/create")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "Commerce 3",
        cif: "C12345678",
        address: "9101 Elm St",
        email: "commerce3@example.com",
        phone: "321-654-9870",
        pageId: 3,
      })
      .expect(200);

    // Now, update the created commerce
    const updateRes = await request(app)
      .put(`/api/commerces/update/C12345678`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "Updated Commerce 3",
        address: "Updated Address",
        email: "updated_commerce3@example.com",
        phone: "111-222-3333",
        pageId: 4,
      })
      .expect(200);

    expect(updateRes.body.message).toBe("Commerce updated");

    // Verify the update
    const response = await request(app)
      .get(`/api/commerces/view/C12345678`)
      .set("Authorization", `Bearer ${token}`)
      .expect(200);

    expect(response.body).toHaveProperty("name", "Updated Commerce 3");
    expect(response.body).toHaveProperty("address", "Updated Address");
    expect(response.body).toHaveProperty(
      "email",
      "updated_commerce3@example.com"
    );
    expect(response.body).toHaveProperty("phone", "111-222-3333");
    expect(response.body).toHaveProperty("pageId", 4);
  });

  it("should delete an existing commerce", async () => {
    // First, create a new commerce
    const createRes = await request(app)
      .post("/api/commerces/create")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "Commerce 4",
        cif: "D12345678",
        address: "1213 Oak St",
        email: "commerce4@example.com",
        phone: "555-666-7777",
        pageId: 5,
      })
      .expect(200);

    // Now, delete the created commerce
    const deleteRes = await request(app)
      .delete(`/api/commerces/delete/D12345678`)
      .set("Authorization", `Bearer ${token}`)
      .expect(200);

    expect(deleteRes.body.message).toBe("Commerce deleted");
  });
});
