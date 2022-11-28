import express from "express";
import serverless from "serverless-http";
import NepaliDate from 'nepali-date-converter';
import cors from "cors";

const app = express();
const router = express.Router();
app.use(cors());
app.use(express.json());

router.get("/datebs2ad", function(req,res){
    let dateAD = new Date()
    let dateBS: string;
    try {
        if (req.query.date) {
            dateAD = new Date((req.query.date).toString())
        }
        dateBS = new NepaliDate(dateAD).format('YYYY-MM-DD')
        res.status(200).json({ date: dateBS })
    } catch (e) {
        console.log(e);
        res.status(501).json({ date: "Not Implemented" })
    }
});


app.use("/.netlify/functions/date-converter", router);
module.exports.handler = serverless(app);

