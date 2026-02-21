// import { cookies } from 'next/headers';
// import { redirect } from 'next/navigation';
// import { verifyToken } from '@/lib/jwt';
// import { connectDB } from '@/lib/mongodb';
// import User from '@/models/User';
// import AccountClient from '@/Components/User-Account/Accountclient';

// export default async function AccountPage() {
//     const cookieStore = await cookies();
//     const token = cookieStore.get('token')?.value;
//     const payload = verifyToken(token || '');

//     if (!payload) redirect('/login');

//     await connectDB();
//     const user = await User.findById(payload.userId).lean() as any;

//     if (!user) redirect('/login');

//     return (
//         <AccountClient
//             user={{
//                 name: user.name,
//                 email: user.email,
//                 joined: new Date(user.createdAt).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' }),
//             }}
//         />
//     );
// }


import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { verifyToken } from '@/lib/jwt';
import { connectDB } from '@/lib/mongodb';
import User from '@/models/User';
import AccountClient from '@/Components/User-Account/Accountclient';

export default async function AccountPage() {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
    const payload = verifyToken(token || '');

    if (!payload) redirect('/login');

    await connectDB();

    type UserType = {
        _id: string;
        name: string;
        email: string;
        createdAt: Date | string;
    };

    const user = await User.findById(payload.userId).lean<UserType | null>();

    if (!user) redirect('/login');

    return (
        <AccountClient
            user={{
                name: user.name,
                email: user.email,
                joined: new Date(user.createdAt).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' }),
            }}
        />
    );
}