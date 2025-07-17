'use server';

import { prisma } from '@/lib/prisma';

export async function getAllCategories() {
    try {
        const categories = await prisma.category.findMany();
        return { success: 'Categories fetched successfully', data: categories };
    } catch (error) {
        console.error('Error fetching categories:', error);
        return { error: 'Failed to fetch categories' };
    }
}

export async function getCategoryById(id) {
    try {
        const category = await prisma.category.findUnique({
            where: { id }
        });
        if(!category) {
            return { error: 'Category not found' };
        }
        return { success: 'Category fetched successfully', data: category };
    } catch (error) {
        console.error('Error fetching category:', error);
        return { error: 'Failed to fetch category' };
    }
}

export async function createCategory(formData) {
    try {
        const name = formData.get('name');
        const category = await prisma.category.create({
            data: {
                name
            }
        });
        return { success: 'Category created successfully', data: category };
    } catch (error) {
        console.error('Error creating category:', error);
        return { error: 'Failed to create category' };
    }
}

export async function updateCategory(id, formData) {
    try {
        const name = formData.get('name');
        const category = await prisma.category.findUnique({
            where: { id }
        });
        if(!category) {
            return { error: 'Category not found' };
        }
        const updatedCategory = await prisma.category.update({
            where: { id },
            data: { name }
        });
        return { success: 'Category updated successfully', data: updatedCategory };
    } catch (error) {
        console.error('Error updating category:', error);
        return { error: 'Failed to update category' };
    }
}

export async function deleteCategory(id) {
    try {
        const category = await prisma.category.findUnique({
            where: { id }
        });
        if(!category) {
            return { error: 'Category not found' };
        }
        await prisma.category.delete({
            where: { id }
        });
        return { success: 'Category deleted successfully', data: category };
    } catch (error) {
        console.error('Error deleting category:', error);
        return { error: 'Failed to delete category' };
    }
}