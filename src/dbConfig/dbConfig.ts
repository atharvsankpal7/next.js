import mongoose from "mongoose";
export async function connectDB() {
    try {
        mongoose.connect(process.env.MONGO_URI!);
        const connection = mongoose.connection;
        connection.on("connected", () => {
            console.log("connected to MongoDB");
        });
        connection.on("error", (err) => {
            console.log("make sure mongoDB is running " + err);
            process.exit()
        });
    } catch (error) {
        console.log("something went wrong" + error);
    }
}
