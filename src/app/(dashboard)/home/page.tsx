import Greetings from "@/components/Greetings";
import GreetingsSkeleton from "@/components/GreetingsSkeleton";
import NewProject from "@/components/NewProject";
import ProjectCard from "@/components/ProjectCard";
import TaskList from "@/components/TaskList";
import { IUser, decodeToken } from "@/lib/auth";
import { prisma as db } from "@/lib/db";
import { cookies } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Suspense } from "react";

const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

const getUser = async () => {
  const token = cookies().get("token");
  if (!token) redirect("/signin");
  const user = decodeToken(token?.value);
  if (!user) redirect("/signin");
  // await delay(5000);
  return user as IUser;
};

const getProjects = async (id: string) => {
  const projects = await db.project.findMany({
    where: { ownerId: id },
    include: { tasks: true },
  });
  return projects;
};

export default async function Page() {
  const user = await getUser();
  const projects = await getProjects(user.id);
  return (
    <div className="h-full overflow-y-auto flex-1 px-2">
      <div className=" h-full  items-stretch justify-center min-h-[content]">
        <div className="flex-1 grow flex">
          <Greetings user={user} />
        </div>
        <div className="grid grid-cols-2 gap-8 mt-4">
          {/** projects map here */}
          {projects.map((project) => (
            <Link href={`/project/${project.id}`} key={project.id}>
              <Suspense fallback={<GreetingsSkeleton />}>
                <ProjectCard project={project} />
              </Suspense>
            </Link>
          ))}
          <div className="w-1/3 p-3">
            <NewProject />
          </div>
        </div>
        <div className="mt-6 flex-2 grow w-full flex">
          <div className="w-full">
            <TaskList id={user.id} title="Today" />
          </div>
        </div>
      </div>
    </div>
  );
}
