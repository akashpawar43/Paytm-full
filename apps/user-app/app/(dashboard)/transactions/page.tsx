import { Suspense } from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "../../lib/auth";
import prisma from "@repo/db/client";
import { P2pTransactions } from "../../../components/P2pTransactions"
import { Center } from "@repo/ui/center";

async function getP2pTransactions() {
    const session = await getServerSession(authOptions);
    const txns = await prisma.p2pTransfer.findMany({
        where: {
            fromUserId: session?.user.id
        }
    })
    return txns.map(t => ({
        time: t.timestamp,
        amount: t.amount,
        from: t.fromUserId,
        to: t.toUserId
    }))
}

export default async function () {
    const transactions = await getP2pTransactions();
    return (
        <div className="pt-4">
            <Center>
                <Suspense fallback={"loading..."}>
                    <P2pTransactions transactions={transactions} />
                </Suspense>
            </Center>
        </div>
    )
}