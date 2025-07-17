'use server';

import { prisma } from '@/lib/prisma';

export async function getAllUnits() {
    try {
        const units = await prisma.unit.findMany();
        return { success: 'Units fetched successfully', data: units };
    } catch (error) {
        console.error('Error fetching units:', error);
        return { error: 'Failed to fetch units' };
    }
}

export async function getUnitById(id) {
    try {
        const unit = await prisma.unit.findUnique({
            where: { id }
        });
        if(!unit) {
            return { error: 'Unit not found' };
        }
        return { success: 'Unit fetched successfully', data: unit };
    } catch (error) {
        console.error('Error fetching unit:', error);
        return { error: 'Failed to fetch unit' };
    }
}

export async function createUnit(formData) {
    try {
        const unit_type = formData.get('unit_type');
        const unit = await prisma.unit.create({
            data: {
                unit_type
            }
        });
        return { success: 'Unit created successfully', data: unit };
    } catch (error) {
        console.error('Error creating unit:', error);
        return { error: 'Failed to create unit' };
    }
}

export async function updateUnit(id, formData) {
    try {
        const unit_type = formData.get('unit_type');
        const unit = await prisma.unit.findUnique({
            where: { id }
        });
        if(!unit) {
            return { error: 'Unit not found' };
        }
        const updatedUnit = await prisma.unit.update({
            where: { id },
            data: { unit_type }
        });
        return { success: 'Unit updated successfully', data: updatedUnit };
    } catch (error) {
        console.error('Error updating unit:', error);
        return { error: 'Failed to update unit' };
    }
}
