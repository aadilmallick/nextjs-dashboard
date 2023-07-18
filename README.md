# My learning

## Schema

```javascript
model Project {
  id        String   @id @default(uuid())
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  ownerId String
  owner   User   @relation(fields: [ownerId], references: [id])

  name        String
  description String?
  due         DateTime?
  tasks        Task[]
  // soft delete: only flag the items so we can ignore it on queries. Don't actually delete
  deleted     Boolean   @default(false)

  @@unique([ownerId, name]) // no two projects can have the same combination of ownerId and name
  @@index([ownerId, id]) // create composite index with ownerId and project id
}
```

- We often add a `deleted` property to our database for soft deletion, where instead of deleting from the database irrecoverably, we instead flag the item as "deleted", ignoring it in our filtering queries. This way the user can undelete an item whenever he wants.
- The `@@unique` block attribute creates a combination of fields saying that the combination must be unique. In this case, no two projects can have the same combination of ownerId and name, essentially saying no projects with the same owner can have the same name.
- The `@@index` helps with performance, by setting up prisma to efficiently query the specified fields.

## Seeding the database

### Seed script

Create a `seed.ts` next to your database script

```javascript
import { hashPassword } from "./auth";
import { prisma as db } from "./db";
import { TASK_STATUS } from "@prisma/client";

const getRandomTaskStatus = () => {
  const statuses = [
    TASK_STATUS.COMPLETED,
    TASK_STATUS.NOT_STARTED,
    TASK_STATUS.STARTED,
  ];
  return statuses[Math.floor(Math.random() * statuses.length)];
};

async function main() {
  // create a user, with 5 projects, and 10 tasks per project
  const user = await db.user.upsert({
    where: { email: "user@email.com" },
    update: {},
    create: {
      email: "user@email.com",
      firstName: "User",
      lastName: "Person",
      password: await hashPassword("password"),
      projects: {
        create: new Array(5).fill(1).map((_, i) => ({
          name: `Project ${i}`,
          due: new Date(2022, 11, 25),
        })),
      },
    },
    include: {
      projects: true,
    },
  });

  // for each project, create 10 tasks, each with a random status
  const tasks = await Promise.all(
    user.projects.map((project) =>
      db.task.createMany({
        data: new Array(10).fill("only care about index").map((_, i) => {
          return {
            name: `Task ${i}`,
            ownerId: user.id,
            projectId: project.id,
            description: `Everything that describes Task ${i}`,
            status: getRandomTaskStatus(),
          };
        }),
      })
    )
  );

  console.log({ user, tasks });
}

// disconnect from the database
main()
  .then(async () => {
    await db.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await db.$disconnect();
    process.exit(1);
  });
```

### tsconfig seed script

To run the seed script, we have to use `ts-node`. To use that, we need to create a `tsconfig.json` just for our seed script, calling it `tsconfig-seed.json`

```bash
npm i -D ts-node
```

```json
{
  "compilerOptions": {
    "target": "es5",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": false,
    "forceConsistentCasingInFileNames": true,
    "noEmit": true,
    "incremental": true,
    "esModuleInterop": true,
    "module": "CommonJS",
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "baseUrl": ".",
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/components/*": ["./components/*"],
      "@/hooks/*": ["./hooks/*"],
      "@/lib/*": ["./lib/*"],
      "@/styles/*": ["./styles/*"],
      "@/prisma/*": ["./prisma/*"],
      "@/assets/*": ["./assets/*"]
    }
  },
  "include": ["next-env.d.ts", ".next/types/**/*.ts", "**/*.ts", "**/*.tsx"],
  "exclude": ["node_modules"]
}
```

You can then add this script to your `package.json`, and check your prisma database using `npx prisma studio`:

```json
{
  "scripts": {
    "seed": "ts-node -P tsconfig-seed.json -r tsconfig-paths/register --transpileOnly src/lib/seed.ts"
  }
}
```

## Authentication

### Hashing passwords

```bash
npm i bcrypt
npm i --save-dev @types/bcrypt
```
