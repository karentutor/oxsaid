import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const BusinessCard = ({ item, onDelete, onEdit }) => {
  return (
    <Card key={item._id} className="p-4 flex flex-col lg:flex-row items-start gap-4">
      <img src={item.picturePath} alt="Business" className="w-24 h-24 object-cover" />
      <div className="flex-1 flex flex-col lg:flex-row justify-between w-full">
        <div className="flex-1">
          <h2 className="text-xl font-semibold">{item.name.name}</h2>
          <p className="text-sm"><strong className="text-accent">Address:</strong> {item.address}</p>
          <p className="text-sm"><strong className="text-accent">Phone:</strong> {item.phone}</p>
          <p className="text-sm"><strong class="text-accent">Email:</strong> {item.email}</p>
          <p className="text-sm"><strong class="text-accent">Description:</strong> {item.description}</p>
        </div>
        <div className="flex-1 lg:mt-0 mt-2 lg:ml-2">
          <p className="text-sm"><strong className="text-accent">Size:</strong> {item.size}</p>
          <p className="text-sm"><strong class="text-accent">Alumni Owned:</strong> {item.isAlumniOwned ? "Yes" : "No"}</p>
          <p className="text-sm"><strong class="text-accent">Less Than Two Years:</strong> {item.isLessThanTwoYears ? "Yes" : "No"}</p>
          <p className="text-sm"><strong class="text-accent">Visibility:</strong> {item.visibility}</p>
          <p className="text-sm"><strong class="text-accent">Year Founded:</strong> {item.yearFounded}</p>
          <p className="text-sm"><strong class="text-accent">Occupation:</strong> {item.occupation}</p>
          <p className="text-sm"><strong class="text-accent">Sub-Occupation:</strong> {item.subOccupation}</p>
          <p className="text-sm"><strong class="text-accent">Website:</strong> <a href={item.websiteUrl} target="_blank" rel="noopener noreferrer">{item.websiteUrl}</a></p>
          <p className="text-sm"><strong class="text-accent">Created At:</strong> {new Date(item.createdAt).toLocaleDateString()}</p>
        </div>
        <div className="flex flex-row items-center gap-2 lg:ml-2 lg:self-start">
          <Button variant="default" className="mb-2 lg:mb-0" onClick={onEdit}>Edit</Button>
          <Button variant="destructive" onClick={onDelete}>Delete</Button>
        </div>
      </div>
    </Card>
  );
};

export default BusinessCard;
