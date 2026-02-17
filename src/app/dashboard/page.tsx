import { redirect } from 'next/navigation';

export default function DashboardPage() {
    // In a real app, check auth role here.
    // For MVP/Demo purposes, redirect to the demo dashboard.
    redirect('/dashboard/demo');
}
