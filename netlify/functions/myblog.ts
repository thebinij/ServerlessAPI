import express from "express";
import serverless from "serverless-http";
import cors from "cors";
import { validationResult } from "express-validator";
import { check } from "express-validator";
import { generateAccessToken, verifyJWT } from "./wealth-manager/middlewares";
import { connectDB } from "./binij-blog/database";
import { Article, User, Song, Gallery } from "./binij-blog/models";
import mongoose from "mongoose";
const app = express();
const router = express.Router();
app.use(cors());
app.use(express.json());

const URI = process.env["MONGO_URI"] || "";

// Login USER
router.post(
  "/login",
  [check("email").isEmail().withMessage("the email must be valid.")],
  async function (req, res) {
    const { email, password } = req.body;

    // User info validition
    const error = validationResult(req).formatWith(({ msg }) => msg);
    const hasError = !error.isEmpty();
    if (hasError) {
      return res.status(422).json({ error: error.array() });
    }

    try {
      await connectDB(URI);
      const existingUser = await User.findOne({ email: email.toLowerCase() });

      if (!existingUser) {
        return res.status(400).json({ message: "User not found!" });
      }

      // Check Password
      const matchedPassword = existingUser.password == password;
      if (!matchedPassword) {
        return res.status(400).json({ message: "Invalid Credential!" });
      }
      existingUser.lastLogin = new Date().toUTCString();
      const result = await existingUser.save();
      const accessToken = generateAccessToken(existingUser);
      const userCredential = {
        email: existingUser.email,
        token: accessToken,
      };

      res.status(200).json({ userCredential });
    } catch (e) {
      console.log(e);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
);

// Validate Token USER
router.post("/validate-token", async function (req, res) {
  try {
    const { token } = req.body;
    console.log(token);
    if (!token) {
      return res.status(400).json({ message: "Invalid Token!" });
    }

    const result = await verifyJWT(token);
    res.status(200).json({ result });
  } catch (e) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

//Get Article By ID
router.get("/article", async function (req, res) {
  try {
    await connectDB(URI);
    const articleId = req.query.id;
    if (!articleId) {
      return res.status(400).json({ message: "Invalid Query" });
    }

    if (!mongoose.isValidObjectId(articleId)) {
      return res.status(400).json({ message: "Invalid ObjectId" });
    }

    const article = await Article.findOne({ _id: articleId });

    if (!article) {
      return res.status(404).json({ message: "Post not found" });
    }

    res.status(200).json({ data: article });
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: "Something Went Wrong!" });
  }
});

//Get All Articles
router.get("/articles", async function (req, res) {
  try {
    await connectDB(URI);
    const allArticles = await Article.find();
    res.status(200).json({ data: allArticles });
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: "Something Went Wrong!" });
  }
});

//Get All Gallery
router.get("/galleries", async function (req, res) {
  try {
    await connectDB(URI);
    const allGalleries = await Gallery.find();
    res.status(200).json({ data: allGalleries });
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: "Something Went Wrong!" });
  }
});

//Get All Audio
router.get("/audios", async function (req, res) {
  try {
    await connectDB(URI);
    const allAudios = await Song.find();
    res.status(200).json({ data: allAudios });
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: "Something Went Wrong!" });
  }
});

// Update Audio
router.patch("/audios", async function (req, res) {
  try {
    await connectDB(URI);
    const audioId = req.query.id;
    const count = req.query.increment;

    if (!audioId || !mongoose.isValidObjectId(audioId)) {
      return res.status(400).json({ message: "Invalid Query" });
    }
    const audio = await Song.findOne({ _id: audioId });
    if (!audio) {
      return res.status(404).json({ message: "Song not found" });
    }
    let update = {};
    if (count == "like") {
      update = { $inc: { likeCount: 1 } };
    } else if (count == "play") {
      update = { $inc: { playCount: 1 } };
    } else {
      return res.status(400).json({ message: "Nothing To Update" });
    }
    const updatedAudio = await Song.updateOne({ _id: audioId }, update);
    if (updatedAudio.modifiedCount > 0) {
      res.status(200).json({ message: "Success" });
    } else {
      res.status(400).json({ message: "Update Failed" });
    }
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: "Something Went Wrong!" });
  }
});

//Create a Article
router.post("/article-create", async function (req, res) {
  const error = validationResult(req).formatWith(({ msg }) => msg);

  const hasError = !error.isEmpty();
  if (hasError) {
    return res.status(422).json({ error: error.array() });
  }
  try {
    await connectDB(URI);
    const newArticle = new Article({
      dateCreated: new Date(),
      dateUpdated: null,
      authorId: req.body.authorId,
      authorName: req.body.authorName,
      metaTitle: req.body.metaTitle,
      metaDescription: req.body.metaDescription,
      metaImage: req.body.metaImage,
      metaTag: req.body.metaTag,
      topicClass: req.body.topicClass,
      similarTags: req.body.similarTags,
      content: req.body.content,
      contentLength: req.body.contentLength,
      comments: [],
    });

    const result = await newArticle.save();
    res.status(201).json(result);
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: "Something Went Wrong!" });
  }
});

//Create a Gallery
router.post("/gallery-create", async function (req, res) {
  const error = validationResult(req).formatWith(({ msg }) => msg);

  const hasError = !error.isEmpty();
  if (hasError) {
    return res.status(422).json({ error: error.array() });
  }
  try {
    await connectDB(URI);
    const newGallery = new Gallery({
      title: req.body.title,
      date: new Date(),
      images: [
        {
          largeURL:
            "https://mdbcdn.b-cdn.net/img/Photos/Horizontal/Nature/4-col/img%20(75).webp",
          thumbnailURL:
            "https://mdbcdn.b-cdn.net/img/Photos/Horizontal/Nature/4-col/img%20(75).webp",
          width: 2500,
          height: 1666,
          caption: "caption-1",
        },
        {
          largeURL:
            "https://mdbcdn.b-cdn.net/img/Photos/Horizontal/Nature/4-col/img%20(77).webp",
          thumbnailURL:
            "https://mdbcdn.b-cdn.net/img/Photos/Horizontal/Nature/4-col/img%20(77).webp",
          width: 2500,
          height: 1666,
          caption: "caption-2",
        },
        {
          largeURL:
            "https://cdn.photoswipe.com/photoswipe-demo-images/photos/3/img-2500.jpg",
          thumbnailURL:
            "https://cdn.photoswipe.com/photoswipe-demo-images/photos/3/img-200.jpg",
          width: 2500,
          height: 1666,
          caption: "caption-3",
        },
        {
          largeURL:
            "https://mdbcdn.b-cdn.net/img/Photos/Horizontal/Nature/4-col/img%20(70).webp",
          thumbnailURL:
            "https://mdbcdn.b-cdn.net/img/Photos/Horizontal/Nature/4-col/img%20(70).webp",
          width: 2500,
          height: 1666,
          caption: "caption-4",
        },
      ],
    });

    const result = await newGallery.save();
    res.status(201).json(result);
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: "Something Went Wrong!" });
  }
});

app.use("/.netlify/functions/myblog", router);
module.exports.handler = serverless(app);
