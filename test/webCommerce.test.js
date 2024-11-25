import request from "supertest";
import mongoose from "mongoose";
import app from "../app"; // Assuming your Express app is exported from this file
import "dotenv/config";
import webCommerce from "../models/nosql/webCommerce";

let token; // Declare the token variable outside the describe block
let commerceToken;
let userToken;

describe("webCommerce API", () => {
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
    // Create a user to get the user token
    await request(app).post("/api/users/register").send({
      name: "Bob Smith",
      email: "bob@example.com",
      password: "password123",
      age: 30,
      city: "Los Angeles",
      interest: "Technology",
      allowOffers: true,
      role: "user",
    });

    // Login to get the user auth token
    const userLoginRes = await request(app).post("/api/users/login").send({
      email: "bob@example.com",
      password: "password123",
    });

    userToken = userLoginRes.header["auth-token"];

    // Create a commerce to get the commerce token
    // Create a commerce to get the commerce token
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
      });

    // Get the commerce token
    const viewResponse = await request(app)
      .get(`/api/commerces/view/A12345678`)
      .set("Authorization", `Bearer ${token}`)
      .expect(200);

    commerceToken = viewResponse.body.token;
  });

  afterAll(async () => {
    await mongoose.connection.db.dropDatabase();
    await mongoose.connection.close();
  });

  afterEach(async () => {
    await webCommerce.deleteMany({});
  });

  it("should create a new webCommerce", async () => {
    const response = await request(app)
      .post("/api/webCommerce/create")
      .set("Authorization", `${commerceToken}`)
      .send({
        city: "Madrid",
        activity: "Retail",
        title: "My Web Commerce",
        summary: "This is a summary of my web commerce.",
        text: ["Introduction", "Details", "Conclusion"],
        commerceCIF: "A12345678",
      })
      .expect(200);

    expect(response.body.message).toBe("WebCommerce created");
  });

  it("should get a webCommerce by CIF", async () => {
    await request(app)
      .post("/api/webCommerce/create")
      .set("Authorization", `${commerceToken}`)
      .send({
        city: "Madrid",
        activity: "Retail",
        title: "My Web Commerce",
        summary: "This is a summary of my web commerce.",
        text: ["Introduction", "Details", "Conclusion"],
        commerceCIF: "A12345678",
      });

    const response = await request(app)
      .get("/api/webCommerce/view/A12345678")
      .set("Authorization", `${commerceToken}`)
      .expect(200);

    expect(response.body.city).toBe("Madrid");
    expect(response.body.activity).toBe("Retail");
    expect(response.body.title).toBe("My Web Commerce");
    expect(response.body.summary).toBe("This is a summary of my web commerce.");
    expect(response.body.text).toStrictEqual([
      "Introduction",
      "Details",
      "Conclusion",
    ]);
  });

  it("should update a webCommerce", async () => {
    await request(app)
      .post("/api/webCommerce/create")
      .set("Authorization", `${commerceToken}`)
      .send({
        city: "Madrid",
        activity: "Retail",
        title: "My Web Commerce",
        summary: "This is a summary of my web commerce.",
        text: ["Introduction", "Details", "Conclusion"],
        commerceCIF: "A12345678",
      });

    const response = await request(app)
      .put("/api/webCommerce/update/")
      .set("Authorization", `${commerceToken}`)
      .send({
        city: "Barcelona",
        activity: "Wholesale",
        title: "Updated Web Commerce",
        summary: "This is an updated summary of my web commerce.",
        text: ["Updated Introduction", "Updated Details", "Updated Conclusion"],
      })
      .expect(200);

    const updatedResponse = await request(app)
      .get("/api/webCommerce/view/A12345678")
      .set("Authorization", `${commerceToken}`)
      .expect(200);

    expect(updatedResponse.body.city).toBe("Barcelona");
    expect(updatedResponse.body.activity).toBe("Wholesale");
    expect(updatedResponse.body.title).toBe("Updated Web Commerce");
    expect(updatedResponse.body.summary).toBe(
      "This is an updated summary of my web commerce."
    );
    expect(updatedResponse.body.text).toStrictEqual([
      "Updated Introduction",
      "Updated Details",
      "Updated Conclusion",
    ]);
  });

  it("should archive a webCommerce", async () => {
    await request(app)
      .post("/api/webCommerce/create")
      .set("Authorization", `${commerceToken}`)
      .send({
        city: "Madrid",
        activity: "Retail",
        title: "My Web Commerce",
        summary: "This is a summary of my web commerce.",
        text: ["Introduction", "Details", "Conclusion"],
        commerceCIF: "A12345678",
      });

    const response = await request(app)
      .delete("/api/webCommerce/A12345678?action=archive")
      .set("Authorization", `${commerceToken}`)
      .expect(200);

    expect(response.body.message).toBe("WebCommerce archived");

    const archivedResponse = await request(app)
      .get("/api/webCommerce/view/A12345678")
      .set("Authorization", `${commerceToken}`)
      .expect(200);

    expect(archivedResponse.body.isArchived).toBe(true);
  });

  it("should delete a webCommerce", async () => {
    await request(app)
      .post("/api/webCommerce/create")
      .set("Authorization", `${commerceToken}`)
      .send({
        city: "Madrid",
        activity: "Retail",
        title: "My Web Commerce",
        summary: "This is a summary of my web commerce.",
        text: ["Introduction", "Details", "Conclusion"],
        commerceCIF: "A12345678",
      });

    const response = await request(app)
      .delete("/api/webCommerce/A12345678?action=delete")
      .set("Authorization", `${commerceToken}`)
      .expect(200);

    expect(response.body.message).toBe("WebCommerce deleted");

    const deletedResponse = await request(app)
      .get("/api/webCommerce/view/A12345678")
      .set("Authorization", `${commerceToken}`)
      .expect(404);

    expect(deletedResponse.body.message).toBe("Web Commerce not found");
  });

  it("should upload a photo to webCommerce", async () => {
    await request(app)
      .post("/api/webCommerce/create")
      .set("Authorization", `${commerceToken}`)
      .send({
        city: "Madrid",
        activity: "Retail",
        title: "My Web Commerce",
        summary: "This is a summary of my web commerce.",
        text: ["Introduction", "Details", "Conclusion"],
        commerceCIF: "A12345678",
      });
    const response = await request(app)
      .patch("/api/webCommerce/upload/A12345678")
      .set("Authorization", `${commerceToken}`)
      .attach(
        "image",
        "/Users/nicolaspertierra/Developer/2CEB/2CEB/Fullstack_web_programming/server/mvc_commerce/images/image_1.png"
      )
      .expect(200);

    const viewResponse = await request(app)
      .get("/api/webCommerce/view/A12345678")
      .set("Authorization", `${commerceToken}`)
      .expect(200);

    expect(viewResponse.body.images.length).toBeGreaterThan(0);
  });

  it("should get webCommerces by city", async () => {
    await request(app)
      .post("/api/webCommerce/create")
      .set("Authorization", `${commerceToken}`)
      .send({
        city: "Madrid",
        activity: "Retail",
        title: "My Web Commerce",
        summary: "This is a summary of my web commerce.",
        text: ["Introduction", "Details", "Conclusion"],
        commerceCIF: "A12345678",
      });

    await request(app).get("/api/webCommerce/city/Madrid").expect(200);
  });

  it("should get webCommerces by activity", async () => {
    await request(app)
      .post("/api/webCommerce/create")
      .set("Authorization", `${commerceToken}`)
      .send({
        city: "Madrid",
        activity: "Retail",
        title: "My Web Commerce",
        summary: "This is a summary of my web commerce.",
        text: ["Introduction", "Details", "Conclusion"],
        commerceCIF: "A12345678",
      });

    const response = await request(app)
      .get("/api/webCommerce/activity/Retail")
      .expect(200);

    expect(response.body.length).toBeGreaterThan(0);
    expect(response.body[0].activity).toBe("Retail");
  });

  it("should get webCommerces by city and activity", async () => {
    await request(app)
      .post("/api/webCommerce/create")
      .set("Authorization", `${commerceToken}`)
      .send({
        city: "Madrid",
        activity: "Retail",
        title: "My Web Commerce",
        summary: "This is a summary of my web commerce.",
        text: ["Introduction", "Details", "Conclusion"],
        commerceCIF: "A12345678",
      });

    const response = await request(app)
      .get("/api/webCommerce/city/Madrid/activity/Retail")
      .expect(200);

    expect(response.body.length).toBeGreaterThan(0);
    expect(response.body[0].city).toBe("Madrid");
    expect(response.body[0].activity).toBe("Retail");
  });

  it("should create a user review for a webCommerce", async () => {
    // Create a commerce
    const commerceResponse = await request(app)
      .post("/api/commerces/create")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "Commerce 2",
        cif: "B12345678",
        address: "5678 Market St",
        email: "commerce2@example.com",
        phone: "987-654-3210",
        pageId: 2,
      });

    // Get the commerce token for the newly created commerce
    const viewResponse = await request(app)
      .get(`/api/commerces/view/B12345678`)
      .set("Authorization", `Bearer ${token}`)
      .expect(200);

    const newCommerceToken = viewResponse.body.token;

    // Create a webCommerce
    await request(app)
      .post("/api/webCommerce/create")
      .set("Authorization", `${newCommerceToken}`)
      .send({
        city: "Madrid",
        activity: "Retail",
        title: "Another Web Commerce",
        summary: "This is another summary of my web commerce.",
        text: ["Intro", "Details", "Conclusion"],
        commerceCIF: "B12345678",
      });

    // Create a review for the webCommerce
    const reviewResponse = await request(app)
      .post("/api/webCommerce/review/B12345678")
      .set("Authorization", `Bearer ${token}`)
      .send({
        review: "Excellent service and products!",
        rating: 5,
      })
      .expect(200);

    expect(reviewResponse.body.message).toBe("Review added");

  });

  it("should get emails of users interested in the commerce's activity", async () => {
    // Create users with different interests
    await request(app).post("/api/users/register").send({
      name: "Charlie Brown",
      email: "charlie@example.com",
      password: "password123",
      age: 28,
      city: "New York",
      interest: ["Retail"],
      allowOffers: true,
      role: "user",
    });

    // Create a commerce
    await request(app)
      .post("/api/commerces/create")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "Commerce 1",
        cif: "A12345678",
        address: "1234 Main St",
        email: "commerce1@example.com",
        phone: "123-456-7890",
        pageId: 1,
      });

    // Get the commerce token
    const commerceResponse = await request(app)
      .get("/api/commerces/view/A12345678")
      .set("Authorization", `Bearer ${token}`)
      .expect(200);
    const commerceToken = commerceResponse.body.token;

    // Create a webCommerce linked to the commerce with activity 'Retail'
    await request(app)
      .post("/api/webCommerce/create")
      .set("Authorization", `${commerceToken}`)
      .send({
        city: "Madrid",
        activity: "Retail",
        title: "My Web Commerce",
        summary: "This is a summary of my web commerce.",
        text: ["Introduction", "Details", "Conclusion"],
        commerceCIF: "A12345678",
      });

    // Get emails of users interested in the commerce's activity
    const response = await request(app)
      .get("/api/users/interest")
      .set("Authorization", `${commerceToken}`)
      .expect(200);
  });

});
