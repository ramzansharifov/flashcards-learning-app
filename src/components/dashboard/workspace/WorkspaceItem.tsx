type Props = {
    id: string;
    name: string;
    onSelect: (id: string) => void;
};

export default function WorkspaceItem({ id, name, onSelect }: Props) {
    return (
        <li
            className="p-2 border rounded hover:bg-gray-100 cursor-pointer"
            onClick={() => onSelect(id)}
        >
            {name}
        </li>
    );
}
