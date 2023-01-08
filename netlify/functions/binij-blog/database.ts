import mongoose from "mongoose"

export const connectDB = async (uri:string) => {
  if (mongoose.connection.readyState === 0) {
    try {
      await mongoose.connect(uri,{
        dbName: "blog-binij"
      })
      console.log('MongoDB connected!!')
    } catch (err) {
      console.log('Failed to connect to MongoDB', err)
    }
  }else{
    console.log('MongoDB already connected!!')
  }

  }