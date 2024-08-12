import express from "express";
import db from "@repo/db/client";

const app = express();

app.use(express.json());


app.get("/", (req, res) => {
    res.json({
        message: "hello there!"
    })
});

app.post("/hdfcWebhook", async (req, res) => {
    const paymentInformation: {
        token: string;
        userId: string;
        amount: number
    } = {
        token: req.body.token,
        userId: req.body.user_identifier,
        amount: req.body.amount
    };
    // Update balance in db, add txn
    try {
        await db.$transaction([
            db.balance.update({
                where: {
                    userId: paymentInformation.userId
                },
                data: {
                    amount: {
                        increment: paymentInformation.amount
                    }
                }
            }),
            db.onRampTransaction.update({
                where: {
                    token: paymentInformation.token,
                },
                data: {
                    status: "Success"
                }
            })
        ])
        res.json({
            message: "Captured"
        });
    } catch (error) {
        console.log(error);
        res.status(411).json({
            message: "Error while processing webhook"
        });
    }
})

app.listen(3003);