// src/app/page.tsx
import Table from "./components/table";
import issuesData from "./constants/issues.json";
import { Issue } from "./type";

export default function Home() {
  const issues = issuesData as Issue[];
  return <Table issues={issues} />;
}
