import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Separator } from "../ui/separator";
import { FeedItem } from "./FeedItem";
import { NewPostCard } from "./NewPostCard";

const SortByDivider = () => {
  return (
    <div className="flex flex-row mt-2">
      <div className="pt-2 w-full">
        <Separator className="bg-zinc-300" />
      </div>
      <span className="text-zinc-500 text-xs w-24 pl-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <span className="cursor-pointer">
              Sort by: <span className="font-semibold text-zinc-800">Top</span>
            </span>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-24">
            <DropdownMenuItem>
              <span>Top</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <span>Recent</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </span>
    </div>
  );
};

export const Main = () => {
  return (
    <div style={{ gridArea: "main" }}>
      <NewPostCard />
      <SortByDivider />
      <FeedItem
        type="post"
        content="Today, we are bringing together AI and quantum with Azure Quantum Elements, ushering in a new era of scientific discovery. Our goal is to compress the next 250 years of chemistry and materials science progress into the next 25."
        link={{
          title:
            "Accelerating scientific discovery with Azure Quantum - The Official Microsoft Blog",
          thumbnail:
            "https://images.pexels.com/photos/7654425/pexels-photo-7654425.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
          href: "https://blogs.microsoft.com/blog/2023/06/21/accelerating-scientific-discovery-with-azure-quantum/",
        }}
        author={{
          name: "Satya Nadella",
          subtext: "Chairman and CEO at Microsoft",
          imageUrl:
            "https://images.pexels.com/photos/834863/pexels-photo-834863.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
          connectionDegree: "1st",
        }}
        stats={{
          likes: 5788,
          comments: 139,
          reposts: 593,
        }}
      />
      <FeedItem
        type="post"
        content="In my annual letter to shareholders, I reflect on our opportunity and responsibility to connect what technology can do with what the world needs it to do."
        link={{
          title:
            "My annual letter: A historic intersection of opportunity and responsibility",
          thumbnail:
            "https://images.pexels.com/photos/5912321/pexels-photo-5912321.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
          href: "https://www.linkedin.com/pulse/my-annual-letter-historic-intersection-opportunity-satya-nadella?trackingId=dxsWwqZOReOJKem4oxhXlg%3D%3D&lipi=urn%3Ali%3Apage%3Ad_flagship3_search_srp_content%3BpL6f%2BL5xQK%2BhHU6uCrNBdg%3D%3D",
        }}
        author={{
          name: "Satya Nadella",
          subtext: "Chairman and CEO at Microsoft",
          imageUrl:
            "https://images.pexels.com/photos/834863/pexels-photo-834863.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
          connectionDegree: "1st",
        }}
        stats={{
          likes: 5361,
          comments: 73,
          reposts: 275,
        }}
      />
      <FeedItem
        type="post"
        content="Incredible day in New York for Salesforce AI Day. Huge thanks to all our customer TrAIlblazers, partners, media, and analysts who joined us. "
        thumbnail="https://media.licdn.com/dms/image/D4D22AQFLRo-p2OjMKQ/feedshare-shrink_800/0/1686611197634?e=1690416000&v=beta&t=A2bGER0kZYs6vX37v8sALclnrESFkCcqO9Y4vv3cr4s"
        author={{
          name: "Clara Shih",
          subtext: "CEO of Salesforce AI, Board Director & Entrepreneur",
          imageUrl:
            "https://media.licdn.com/dms/image/D5603AQGVuircu90KUw/profile-displayphoto-shrink_100_100/0/1677475762784?e=1692835200&v=beta&t=zTH1P27U-lV_I_2hT74hDcqk-fhgg7wHrhx8W8a5xio",
          connectionDegree: "3rd",
        }}
        stats={{
          likes: 837,
          comments: 39,
          reposts: 27,
        }}
      />
      <FeedItem
        type="post"
        content="Proud to announce the launch of our new sustainable data center region in Sweden, using 100% renewable energy and zero-waste operations."
        link={{
          title:
            "Google unveils its first sustainable data center region in Sweden",
          thumbnail:
            "https://media.licdn.com/dms/image/D4D22AQHwbzamGqyhWQ/feedshare-shrink_800/0/1686151921691?e=1690416000&v=beta&t=6VEWqCSPlxjPcK2BtSpSBLsU_oOTeHM2jL95igfB71E",
          href: "https://www.blog.google/inside-google/infrastructure/google-announces-first-sustainable-data-center-region-in-sweden/",
        }}
        author={{
          name: "Sundar Pichai",
          subtext: "CEO at Google",
          imageUrl:
            "https://pbs.twimg.com/profile_images/864282616597405701/M-FEJMZ0_400x400.jpg",
          connectionDegree: "2nd",
        }}
        stats={{
          likes: 4891,
          comments: 131,
          reposts: 503,
        }}
      />
    </div>
  );
};
