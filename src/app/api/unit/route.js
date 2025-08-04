import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req) {
    try {
        const body = await req.json();
        const { unit_type } = body;
        const unit = await prisma.unit.create({
            data: {
                unit_type,
            },
        });

        const data = [];
        const newUnit = await prisma.unit.findUnique({
            where: { id: unit.id },
        });

        data.push(newUnit);
        return NextResponse.json({ success: 'Unit created successfully', data }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to create unit' }, { status: 500 });
    }
};
