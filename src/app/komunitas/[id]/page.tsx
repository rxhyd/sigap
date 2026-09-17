import { ThreadDetailView } from "@/components/community/ThreadDetailView";

export default async function ThreadDetailPage(props: PageProps<"/komunitas/[id]">) {
  const { id } = await props.params;
  return <ThreadDetailView id={id} />;
}
