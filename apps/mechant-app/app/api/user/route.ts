import prisma from "@repo/db/client";
import { NextResponse } from "next/server";

export const GET = async () => {
    await prisma.user.create({
        data: {
            email: "asd",
            number: "",
            name: "asd",
            password: "asd"
        }
    })
    return NextResponse.json({
        message: "hii there!"
    })
}