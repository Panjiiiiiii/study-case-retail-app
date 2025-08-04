import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req) {
    try {
        const body = await req.json();
        const { name } = body;
        
        const category = await prisma.category.create({
            data: {
                name,
            },
        });

        const categoryData = await prisma.category.findUnique({
            where: { id: category.id },
        });

        return NextResponse.json({ 
            success: true, 
            message: 'Category created successfully', 
            data: categoryData 
        }, { status: 201 });
        
    } catch (error) {
        console.error('Error creating category:', error);
        return NextResponse.json({ 
            success: false, 
            message: 'Failed to create category',
            error: error.message 
        }, { status: 500 });
    }
};
