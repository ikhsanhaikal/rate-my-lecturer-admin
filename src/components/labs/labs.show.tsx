import { Show, SimpleShowLayout, TextField } from "react-admin";

export default function LabShow() {
	return (
		<Show>
				<SimpleShowLayout>
						<TextField source="id" />
						<TextField source="name" />
						<TextField source="code"/>
				</SimpleShowLayout>
		</Show>
	);
} 