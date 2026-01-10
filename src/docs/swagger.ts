import swaggerAutogen from "swagger-autogen";

const doc = {
  info: {
    version: "v0.0.1",
    title: "Dokumentasi API ACARA",
    description: "Dokumentasi API ACARA",
  },
  servers: [
    {
      url: "http://localhost:3000/api",
      description: "Local Server",
    },
    {
      url: "https://be-acara-sigma.vercel.app/api",
      description: "Deploy Server",
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
      },
    },
    schemas: {
      LoginRequest: {
        identifier: "azhril nurmaulidan",
        password: "azhrilnurmaulidan1234",
      },
      RegisterRequest: {
        fullName: "lirhza lirhza",
        username: "lirhza2025",
        email: "lirhza@yopmail.com",
        password: "12345678",
        confirmPassword: "12345678",
      },
      ActivationRequest: {
        code: "abcdef",
      },
      CreateBannerRequest: {
        title: "banner title",
        image: "banner.jpg",
        isShow: false,
      },
      CreateOrderRequest: {
        events: "674a1b2c3d4e5f6g7h8i9j0k",
        ticket: "674a1b2c3d4e5f6g7h8i9j0k",
        quantity: 2,
      },
      CreateTicketRequest: {
        name: "ticket name",
        description: "ticket description",
        events: "ticket events",
        price: "ticket price",
        quantity: "ticket quantity",
      },
      CreateCategoryRequest: {
        name: "category name",
        description: "category description",
        icon: "category",
      },
      CreateEventRequest: {
        name: "events name",
        banner: "fileUrl",
        category: "category ObjectID",
        description: "events - description",
        startDate: "yyyy-mm-dd hh:mm:ss",
        endDate: "yyyy-mm-dd hh:mm:ss",
        location: {
          region: "region id",
          coordinate: [0, 0],
          address: "address",
        },
        isOnline: false,
        isFeatured: false,
        isPublish: false,
      },
      RemoveMediaRequest: {
        fileUrl: "",
      },
    },
  },
};

const outputFile = "./swagger_output.json";
const endpointFiles = ["../routes/api.ts"];

swaggerAutogen({ openapi: "3.0.0" })(outputFile, endpointFiles, doc);
