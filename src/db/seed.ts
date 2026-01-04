import { eq } from 'drizzle-orm';
import { createId } from '@paralleldrive/cuid2';
import { userTable } from './schema/users';
import { organizationTable } from './schema/organization';
import { orgMembershipTable } from './schema/orgMembership';
import { clientTable } from './schema/clients';
import { projectTable } from './schema/projects';
import { projectMembershipTable } from './schema/projectMembership';
import { taskTable } from './schema/tasks';
import { db } from '.';

async function seedDatabase() {
    try {
        console.log('Starting database seeding...');

        // 1. Seed User
        console.log('Seeding user...');
        const userId = createId();
        const user = {
            id: userId,
            name: 'John Doe',
            email: 'john.doe@example.com',
            password_hash: '$2b$10$yourHashedPasswordHere', // Replace with actual hashed password
        };

        await db.insert(userTable).values(user);
        console.log('✓ User seeded');

        // 2. Seed Organization
        console.log('Seeding organization...');
        const organizationId = createId();
        const organization = {
            id: organizationId,
            name: 'Acme Corporation',
            description: 'A leading technology company specializing in innovative solutions',
        };

        await db.insert(organizationTable).values(organization);
        console.log('✓ Organization seeded');

        // 3. Seed Organization Membership
        console.log('Seeding organization membership...');
        const orgMembership = {
            id: createId(),
            organization_id: organizationId,
            user_id: userId,
            role: 'ORG_ADMIN' as const,
        };

        await db.insert(orgMembershipTable).values(orgMembership);
        console.log('✓ Organization membership seeded');

        // 4. Seed Client
        console.log('Seeding client...');
        const clientId = createId();
        const client = {
            id: clientId,
            organization_id: organizationId,
            name: 'Global Enterprises Inc',
            description: 'A multinational corporation seeking digital transformation',
        };

        await db.insert(clientTable).values(client);
        console.log('✓ Client seeded');

        // 5. Seed Project
        console.log('Seeding project...');
        const projectId = createId();
        const project = {
            id: projectId,
            organization_id: organizationId,
            client_id: clientId,
            name: 'E-Commerce Platform Redesign',
            description: 'Complete overhaul of the existing e-commerce platform with modern technologies',
            start_date: new Date('2024-01-15'),
            due_date: new Date('2024-06-30'),
            tech_stack: 'React, Node.js, PostgreSQL, AWS',
        };

        await db.insert(projectTable).values(project);
        console.log('✓ Project seeded');

        // 6. Seed Project Membership
        console.log('Seeding project membership...');
        const projectMembership = {
            id: createId(),
            project_id: projectId,
            user_id: userId,
            role: 'PROJECT_MANAGER' as const,
        };

        await db.insert(projectMembershipTable).values(projectMembership);
        console.log('✓ Project membership seeded');

        // 7. Seed Task
        console.log('Seeding task...');
        const task = {
            id: createId(),
            organization_id: organizationId,
            project_id: projectId,
            title: 'Implement User Authentication',
            description: 'Set up secure user authentication system with JWT tokens',
            assigned_to: userId,
            status: 'ASSIGNED' as const,
            priority: 'HIGH' as const,
            due_date: new Date('2024-02-15'),
        };

        await db.insert(taskTable).values(task);
        console.log('✓ Task seeded');

        console.log('\n✅ Database seeding completed successfully!');
        console.log('\nSummary of seeded data:');
        console.log('1 User');
        console.log('1 Organization');
        console.log('1 Organization Membership');
        console.log('1 Client');
        console.log('1 Project');
        console.log('1 Project Membership');
        console.log('1 Task');

    } catch (error) {
        console.error('❌ Error seeding database:', error);
        process.exit(1);
    }
}

// Execute the seed function
seedDatabase();