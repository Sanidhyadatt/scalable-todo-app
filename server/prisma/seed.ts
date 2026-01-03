import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    console.log('Start seeding...');

    // Clear existing data
    await prisma.task.deleteMany();
    await prisma.user.deleteMany();

    // Create Users
    const hashedPassword = await bcrypt.hash('password123', 10);

    const user1 = await prisma.user.create({
        data: {
            email: 'john@example.com',
            password: hashedPassword,
            name: 'John Doe',
            tasks: {
                create: [
                    {
                        title: 'Complete Project Proposal',
                        description: 'Draft the initial project proposal for the client.',
                        status: 'completed',
                    },
                    {
                        title: 'Prepare for Sprint Planning',
                        description: 'Review the backlog and prioritize tasks for the next sprint.',
                        status: 'in-progress',
                    },
                    {
                        title: 'Update Documentation',
                        description: 'Update the API documentation with the latest changes.',
                        status: 'pending',
                    },
                ],
            },
        },
    });

    const user2 = await prisma.user.create({
        data: {
            email: 'jane@example.com',
            password: hashedPassword,
            name: 'Jane Smith',
            tasks: {
                create: [
                    {
                        title: 'Bug Bash',
                        description: 'Join the bug bash to find and report issues.',
                        status: 'pending',
                    },
                    {
                        title: 'Refactor Auth Logic',
                        description: 'Clean up the authentication middleware and controllers.',
                        status: 'in-progress',
                    },
                ],
            },
        },
    });

    console.log({ user1, user2 });
    console.log('Seeding finished.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
