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

## Glasspane component

### CLSX

The `clsx` library helps us use the `className` prop easier with easy string manipulation.

```bash
npm i clsx
```

The main use is like below, where it adds the two string you provide as arguments together, merging them into one `className` string.

```javascript
<div className={clsx(classString1, classString2)} />
```

### Glasspane styling

The `backdrop-filter` and semi-transparent white `background-color` is what gives the glasspane effect.

```scss
.glass-pane {
  backdrop-filter: blur(16px) saturate(180%);
  background-color: rgba(255, 255, 255, 0.4);
  border-radius: 0.5rem;
  border: 2px solid #d3d3d3;
}
```

```javascript
import React from "react";
import clsx from "clsx";

interface GlassPaneProps {
  children: React.ReactNode;
  className?: string;
}
const GlassPane = ({ children, className = "" }: GlassPaneProps) => {
  return <div className={clsx("glass-pane", className)}>{children}</div>;
};

export default GlassPane;
```

## Form and composability

One very cool thing we can do is make things we usually think of as having to be client component (Buttons, Inputs) and make them only as server components. The only things we need to make client components are forms, and then forms can pass down their props and state to the inputs and buttons.

### Default component extension

When creating a component that has all the props of some HTML element, we can follow a pattern like below:

```javascript
import React, { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: string;
}

const Button = ({ variant, children, ...props }: ButtonProps) => {
  return (
    <button variant={variant} {...props}>
      {children}
    </button>
  );
};

export default Button;
```

1. Import the default types for the element's props you want to extend. Create an interface and extend those default types. In this case, we want to extend the `ButtonHTMLAttributes<HTMLButtonElement>` interface.

   ```javascript
   interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
     variant?: string;
   }
   ```

2. Create the component, and destructure the props you want to use. In this case, we want to use the `variant` prop, so we destructure it. We also want to use the `children` prop, so we destructure that as well. We also want to use all the other props, so we use the **spread operator** to spread out all default props

   ```javascript
   const Button = ({ variant, children, ...props }: ButtonProps) => {
     return (
       <button variant={variant} {...props}>
         {children}
       </button>
     );
   };
   ```

### Button component and class-variance-authority

We can use the `class-variance-authority` library to make easy variants of a component, and have additional type checking. This ensures consistent styling and avoidance of ternaries.

```bash
npm i class-variance-authority
```

#### Creating classes for variants

The basic syntax is as follows:

```javascript
const classes = cva(base_classes_list, {
  variants: {
    variant_name: {
      variant_value1: [variant_classes_list1],
      variant_value2: [variant_classes_list2],
      variant_value3: [variant_classes_list3],
    },
    ...
  },
  defaultVariants: {
    variant_name: variant_value1,
    variant_name2: variant_value2,
    ...
  }
})
```

As you can see, we define all variant types, which will be props on our component, in the `variants` key. Then we give each variant and base styles styling through a list of tailwind classes, each list element as only one class.

- `base_classes_list` : is a list of tailwind classes that will be applied to all variants, the default styling for each component.
- `variants` : Defines the variants of the component and their styling for each variant value
- `defaultVariants` : defines the default values for each variant.

```javascript
const buttonClasses = cva(
  // first argument: base classes that get applied to all variants
  [
    "rounded-3xl",
    "font-bold",
    "hover:scale-110",
    "active:scale-100",
    "transition",
    "duration-200",
    "ease-in-out",
  ],
  {
    variants: {
      intent: {
        // intent="primary" styling
        primary: [
          "bg-violet-500",
          "text-white",
          "border-transparent",
          "hover:bg-violet-600",
        ],
        // intent="secondary" styling
        secondary: [
          "bg-white",
          "text-black",
          "border-gray-400",
          "hover:bg-gray-100",
          "border-solid",
          "border-2",
          "border-gray-800",
        ],
        // intent="text" styling
        text: ["bg-transparent", "text-black", "hover:bg-gray-100"],
      },
      size: {
        // size="small" styling
        small: ["text-md", "py-1", "px-2"],
        // size="medium" styling
        medium: ["text-lg", "px-6", "py-2"],
        // size="large" styling
        large: ["text-xl", "px-8", "py-4"],
      },
    },
    defaultVariants: {
      intent: "primary",
      size: "medium",
    },
  }
);
```

#### Merging types

1. Extend the default props for an HTML element you're trying to extend from with the variant props type, which creates props from your variant styling. Here, the variants we defined - `intent` and `size` - are now props on our component.

   ```javascript
   interface ButtonProps
     extends ButtonHTMLAttributes<HTMLButtonElement>,
       VariantProps<typeof buttonClasses> {}
   ```

2. Destructure those props out and apply them on our component. Spread out the rest of the props.

```javascript
interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonClasses> {}

const Button = ({
  intent,
  children,
  size,
  className,
  ...props
}: ButtonProps) => {
  return (
    <button
      {...props}
      className={buttonClasses({
        intent,
        size,
        className,
      })}
    >
      {children}
    </button>
  );
};
```

## Custom fetch utility helper

```javascript
interface FetcherProps {
  url: string;
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  body?: any;
  json?: boolean;
}

const fetcher = async ({ url, method, body, json = true }: FetcherProps) => {
  const res = await fetch(url, {
    method,
    body: body && JSON.stringify(body),
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    throw new Error("API Error");
  }

  if (json) {
    const data = await res.json();
    return data;
  }
};
```

### Using function overloads

We can also use template literal strings for typing in typescript, which is really useful to represent dynamics, like so:

```typescript
const url = `http://localhost:3000/api/${string}`;
```

## Authentication

### Hashing passwords

```bash
npm i bcrypt
npm i --save-dev @types/bcrypt
```

### JSON web tokens

```bash
npm i jsonwebtoken
npm i --save-dev @types/jsonwebtoken
```

## Tailwind and template string

You cannot use tailwind with template strings, since tailwind can only evaluate CSS statically from static classnames. It cannot be dynamic. So you cannot do something like this:

```javascript
<div className={`w-${someVar}`} />
```

## Prisma types

## Middleware

## React modal

1. Installation

```bash
npm i react-modal
npm i --save-dev @types/react-modal
```

2. Create an element at the top of your app that will serve as a portal for the modal to be rendered into. We don't have to do any of the portal logic ourselves, all we have to do is create the element and give it an id of our choosing.

```javascript
export default function DashboardLayout({ children }) {
  return (
    // ...
    <div id="modal"></div>
  );
}
```

3. Before using the modal, register the element we want to use as the portal.
   - In the example below, we register the element with an id of `modal` as our modal

```javascript
import Modal from "react-modal";
Modal.setAppElement("#modal");
```

Now all you need to do is create modal state, which is controlled by the `isOpen` prop, and create a modal component.

```javascript
import React from "react";
import Modal from "react-modal";

// these are the props you can pass on react modal
interface ModalProps {
  isOpen: boolean; // whether the modal is open or not
  onRequestClose: () => void; // function to close the modal
  children: React.ReactNode;
  overlayClassName: string; // overlay styling
  className: string; // modal container styling.
}

const App = () => {
  const [modalIsOpen, setIsOpen] = useState(false);
  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  return (
    <>
      {/* ...other component */}
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        overlayClassName="bg-[rgba(0,0,0,.4)] flex justify-center items-center absolute top-0 left-0 h-screen w-screen"
        className="w-1/2 bg-white rounded-xl p-8 relative"
      >
        <h1>Modal</h1>
        {/* ...nested content */}
      </Modal>
    </>
  );
};
```

## Drag and drop

Make any elements you want to drag as draggable, by setting the HTML attribute `draggable` to `true` on any elements you want to drag.

```javascript
<div draggable="true" />
```

Add event listeners for the drag events on the element you want to drag. The `dragstart` event is fired when the user starts dragging a draggable element. In this event, make sure to transfer any data that you want to transfer to the drop target.

```javascript
<div
  draggable="true"
  onDragStart={(e) => {
    console.log("drag start");
  }}
/>
```

For any elements you want to make droppable, listen for the `onDragOver` event and make sure to prevent the default event behavior, which is to prevent dragging over.

```javascript
<div
  onDragOver={(e) => {
    e.preventDefault();
  }}
/>
```

Listen for the `onDrop` event, and make sure to prevent the default event behavior, which is to prevent dropping. In this event, you can access the data transferred from the drag event and use that to do stuff like reordering lists or the such.

```javascript
<div
  onDrop={(e) => {
    e.preventDefault();
    console.log("dropped");
  }}
/>
```

### Full example

```javascript
  const [theTasks, setTheTasks] = useState<Task[]>(tasks);

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, targetId: string) => {
    e.preventDefault();
    const sourceId = e.dataTransfer.getData("text/plain");

    // source: the thing you're dragging.
    // target: the thing you're dragging to.

    // Find the index of the source task and the target task in the tasks array
    const sourceIndex = theTasks.findIndex((task) => task.id === sourceId);
    const targetIndex = theTasks.findIndex((task) => task.id === targetId);

    // Create a new array to hold the updated order of tasks
    const newTasks = [...theTasks];

    // Remove the source task from its original position
    const [sourceTask] = newTasks.splice(sourceIndex, 1);

    // Insert the source task into its new position
    newTasks.splice(targetIndex, 0, sourceTask);

    // Update the state with the new order of tasks
    setTheTasks(newTasks);
  };
```

```javascript
// makes all tasks draggable and droppable for reordering
<div
  // make element draggable
  draggable
  // make transfer data available to drop target under data type key text/plain
  onDragStart={(e) => {
    e.dataTransfer.setData("text/plain", task.id);
  }}
  // prevent default dragover behavior. This allows dragging over
  onDragOver={(e) => {
    e.preventDefault();
  }}
  // prevent default drop behavior. This allows dropping. Now use transfered data to reorder elements in list
  onDrop={(e) => {
    handleDrop(e, task.id);
  }}
/>
```

## Skeleton with tailwind css

```javascript
const GreetingsSkeleton = () => {
  return (
    <div className="w-full card py-14">
      <div className="animate-pulse flex space-x-4">
        {/* profile picture*/}
        <div className="rounded-full bg-gray-300 h-10 w-10"></div>
        {/* bars */}
        <div className="flex-1 space-y-6 py-1">
          <div className="h-2 bg-gray-300 rounded"></div>
          <div className="space-y-3">
            <div className="grid grid-cols-3 gap-4">
              <div className="h-2 bg-gray-300 rounded col-span-2"></div>
              <div className="h-2 bg-gray-300 rounded col-span-1"></div>
            </div>
            <div className="h-2 bg-gray-300 rounded"></div>
          </div>
        </div>
      </div>
    </div>
  );
};
```
