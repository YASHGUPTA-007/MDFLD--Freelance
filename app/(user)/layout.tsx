// app/(user)/layout.tsx — pure Server Component
// The (user) folder is a route GROUP — it does NOT appear in the URL.
// app/(user)/myorders/page.tsx  →  localhost:3000/myorders  ✓
// app/(user)/saved/page.tsx     →  localhost:3000/saved     ✓

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { verifyToken } from '@/lib/jwt';
import { connectDB } from '@/lib/mongodb';
import User from '@/models/User';

import DashboardShell from './DashboardShell';
import DashboardSidebar from '@/Components/User-Account/DashboardSidebar';
import DashboardNavbar  from '@/Components/User-Account/dashboardNavbar';

type UserType = {
    _id: string;
    name: string;
    email: string;
    createdAt: Date | string;
};

export default async function UserLayout({ children }: { children: React.ReactNode }) {
    const cookieStore = await cookies();
    const token       = cookieStore.get('token')?.value;
    const payload     = verifyToken(token || '');

    if (!payload) redirect('/login');

    await connectDB();
    const user = await User.findById(payload.userId).lean<UserType | null>();

    if (!user) redirect('/login');

    const userData = {
        name:   user.name,
        email:  user.email,
        joined: new Date(user.createdAt).toLocaleDateString('en-GB', {
            month: 'short',
            year:  'numeric',
        }),
    };

    return (
        <DashboardShell
            sidebar={<DashboardSidebar user={userData} />}
            navbar ={<DashboardNavbar  user={userData} />}
        >
            {children}
        </DashboardShell>
    );
}