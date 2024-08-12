"use server";

import prisma from "@repo/db/client";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth";

export default async function createOnRampTransaction(amount: number, provider: string) {
    const session = await getServerSession(authOptions);
    const userId = session?.user.id;
    if (!userId) {
        return {
            message: "Unauthenticated request"
        }
    }
    const token = (Math.random()* 1000).toString();
    await prisma.onRampTransaction.create({
        data: {
            userId: userId,
            status: "Processing",
            token: token,
            provider,
            amount: amount,
            startTime: new Date()
        }
    });

    return {
        message: "On Ramp Transaction Added"
    }
}