import { FunctionIcon } from "./Icons";

type Props = { name: string; description: string; function: string; photoUrl?: string | null; ownerName?: string | null; ownerAvatar?: string | null; };

export default function ProjectCard({ name, description, function: fungsi, photoUrl, ownerName, ownerAvatar }: Props) {
  return (
    <div className="card">
      <img className="card-photo" src={photoUrl || "/avatars/placeholder-project.svg"} alt={name} />
      <div className="card-body">
        <div className="card-name">{name}</div>
        <div className="card-desc">{description}</div>
        <div className="card-fn"><FunctionIcon />{fungsi}</div>
        <div className="card-owner"><img src={ownerAvatar || "/avatars/avatar1.svg"} alt={ownerName || "Owner"} /><span>{ownerName || "Anonim"}</span></div>
      </div>
    </div>
  );
}
