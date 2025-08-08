type Props = {
    front: string;
    back: string;
};

export default function CardItem({ front, back }: Props) {
    return (
        <li className="p-2 border rounded">
            <strong>{front}</strong> → {back}
        </li>
    );
}

