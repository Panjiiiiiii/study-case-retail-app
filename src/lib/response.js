import { NextResponse } from 'next/server';

export function successResponse(message, data) {
    return NextResponse.json({
        success: true,
        message,
        data,
    }, { status: 200 })
}

export function notFoundResponse(message) {
    return NextResponse.json({
        success: false,
        message,
    }, { status: 404 })
}

export function badRequestResponse(message) {
    return NextResponse.json({
        success: false,
        message,
    }, { status: 400 })
}

export function unauthorizedResponse(message) {
    return NextResponse.json({
        success: false,
        message,
    }, { status: 401 })
}

export function errorResponse(message, status = 400) {
    return NextResponse.json({
        success: false,
        message,
    }, { status })
}