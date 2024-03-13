import { Show, SimpleShowLayout, TextField } from "react-admin";

export default function LecturerShow() {
	return (
		<Show>
				<SimpleShowLayout>
						<TextField source="id" />
						<TextField source="name" />
						<TextField source="email"/>
				</SimpleShowLayout>
	
		</Show>
	);
} 